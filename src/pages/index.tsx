import Head from "next/head";
import { Inter } from "@next/font/google";
import { Category, Discount, Penalty, Sport } from "@prisma/client";
import { prisma } from "lib/prisma";
import MiniCard from "@/components/MiniCard";
import { useCallback, useEffect, useLayoutEffect, useMemo, useRef, useState } from "react";
import { moreThanTwoPlayers, swimmingDiscount } from "@/utils/calc";
import { divvyUp, mergePlayers, splitPrivateSwimming } from "@/utils/utils";
import { BiFootball } from "react-icons/bi";
import Card from "@/components/Card";
import ListCard from "@/components/ListCard";
import Carousel from "react-multi-carousel";
import "react-multi-carousel/lib/styles.css";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Popup from "reactjs-popup";
import "reactjs-popup/dist/index.css";
import { Player, PlayerSport } from "@/types";
import CustomButton from "@/components/ui/CustomButton";
import { ButtonsType } from "@/data/constants";
import ResultComponents from "@/components/ResultComponents";

const inter = Inter({ subsets: ["latin"] });

export async function getStaticProps() {
	try {
		const categories = await prisma.category.findMany({ where: { hidden: false } });
		const discounts = await prisma.discount.findMany();
		const penalties = await prisma.penalty.findMany();
		const sports = await prisma.sport.findMany({
			where: { hidden: false },
			include: {
				DiscountOptions: true,
				Category: true,
				Penalty: true,
			},
		});
		return {
			props: {
				categories,
				discounts,
				penalties,
				sports: sports.map((x) => ({
					...x,
					createdAt: x.createdAt.toString(),
					updatedAt: x.updatedAt.toString(),
				})),
			},
		};
	} catch (error) {
		return {
			props: {},
		};
	}
}

export default function Home({
	categories = [],
	discounts = [],
	penalties = [],
	sports = [],
}: {
	categories: Category[] | null;
	discounts: Discount[] | null;
	penalties: Penalty[] | null;
	sports: PlayerSport[] | null;
}) {
	const resultsRef = useRef<null | HTMLDivElement>(null);
	const listRef = useRef<null | HTMLDivElement>(null);
	const sportsListRef = useRef<null | HTMLDivElement>(null);
	const [sportListWidth, setSportListWidth] = useState<number>(
		typeof window !== "undefined" ? window.innerWidth : 0
	);
	const [selectedCategoryId, setSelectedCategoryId] = useState<number>(1);
	const [sportsList, setSportsList] = useState<PlayerSport[]>([]);
	const [selectedSportId, setSelectedSportId] = useState<number>();
	const [playersResultList, setPlayersResultList] = useState<Player[]>([]);
	const [playerName, setPlayerName] = useState("");
	const [playersList, setPlayersList] = useState<Player[]>([]);
	const [openNameModel, setOpenNameModel] = useState(false);

	const currentPlayer = useMemo<Player | undefined>(
		() => playersList?.find((player) => player.name === playerName.trim()),
		[playerName, playersList]
	);

	const onSelectedCategoryChange = (categoryId: number) => {
		setSelectedCategoryId(categoryId);
		const sportsList = sports?.filter((sport) => sport.categoryId === categoryId);
		setSportsList((prev) => {
			if (sportsList) {
				setSelectedSportId(sportsList[0].id);
				return sportsList;
			}
			return [];
		});
	};

	const onSelectedSportChange = (sportId: number) => {
		setSelectedSportId(sportId);
	};

	const onSportAdded = (sport: PlayerSport | undefined) => {
		if (!sport) return;
		if (playerName === "" || playersList.length < 1) {
			listRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });

			toast.error("اضف اسم", {
				position: "top-right",
				autoClose: 1000,
				hideProgressBar: false,
				closeOnClick: true,
				pauseOnHover: true,
				draggable: true,
				progress: undefined,
				theme: "light",
			});
			return;
		}
		if (playerName === "" || !currentPlayer) return;
		const exist = currentPlayer.sports.some((s) => s.id === sport.id);
		if (exist) {
			toast.error(` لعبة مكررة ${sport.title} ${playerName}  للاعب `, {
				position: "top-right",
				autoClose: 1000,
				hideProgressBar: false,
				closeOnClick: true,
				pauseOnHover: true,
				draggable: true,
				progress: undefined,
				theme: "light",
			});
			return;
		}
		setPlayersList((prev) => {
			const [currentPlayer, rest] = divvyUp(prev, (player) => player.name === playerName.trim());
			const orderedSports = [...currentPlayer[0]?.sports, sport].sort((s1, s2) =>
				s1.price < s2.price ? 1 : s1.price > s2.price ? -1 : 0
			);
			toast.success(`${playerName} تم إضافة ${sport.title}  للاعب `, {
				position: "top-right",
				autoClose: 500,
				hideProgressBar: false,
				closeOnClick: true,
				pauseOnHover: true,
				draggable: true,
				progress: undefined,
				theme: "light",
			});
			return [...rest, { ...currentPlayer[0], sports: orderedSports }];
		});
	};

	const deleteSport = (playerId: number, sport: PlayerSport) => {
		if (!playerId || !sport) return;

		setPlayersList((prev) => {
			const [currentPlayer, rest] = divvyUp(prev, (player) => player.id === playerId);
			if (!currentPlayer[0]) return prev;
			const orderedSports = currentPlayer[0].sports.filter((s) => s.id !== sport.id);
			toast.success(` تم إزالة  ${sport.title}  `, {
				position: "top-right",
				autoClose: 500,
				hideProgressBar: false,
				closeOnClick: true,
				pauseOnHover: true,
				draggable: true,
				progress: undefined,
				theme: "light",
			});
			return [...rest, { ...currentPlayer[0], sports: orderedSports }];
		});
	};

	const deletePlayer = (player: Player) => {
		if (!player) return;

		try {
			setPlayersList((prev) => prev.filter((p) => p.id !== player.id));
			toast.success(` تم إزالة  ${player.name}  `, {
				position: "top-right",
				autoClose: 500,
				hideProgressBar: false,
				closeOnClick: true,
				pauseOnHover: true,
				draggable: true,
				progress: undefined,
				theme: "light",
			});
		} catch (error) {}
	};

	const calculationHandler = () => {
		if (playerName === "") {
			toast.error("No Name", {
				position: "bottom-right",
				autoClose: 500,
				hideProgressBar: false,
				closeOnClick: true,
				pauseOnHover: true,
				draggable: true,
				progress: undefined,
				theme: "light",
			});
		}
		// const result = moreThanTwoPlayers(playersList);
		// const result = swimmingDiscount(playersList);
		let [swimmingPrivateList, otherSports] = splitPrivateSwimming(playersList);

		swimmingPrivateList = swimmingDiscount(swimmingPrivateList);
		otherSports = moreThanTwoPlayers(otherSports);
		const result = mergePlayers(otherSports, swimmingPrivateList);
		const refracted = result?.map((player) => {
			return {
				name: player.name,
				sports: player.sports.map((sport) => ({
					name: sport.name,
					price: sport.price,
				})),
			};
		}) as Player[];
		setPlayersResultList(result);
		resultsRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
	};

	const savePlayer = () => {
		setOpenNameModel(true);

		const isNameDuplicated = playersList.find((player) => player.name === playerName.trim());

		if (isNameDuplicated || playerName.trim() === "") {
			toast.error("Name is exist", {
				position: "top-right",
				autoClose: 500,
				hideProgressBar: false,
				closeOnClick: true,
				pauseOnHover: true,
				draggable: true,
				progress: undefined,
				theme: "light",
			});
			return;
		}
		setPlayersList((prev) => [
			...prev,
			{ id: playersList.length + 1, name: playerName.trim(), sports: [] },
		]);
		setOpenNameModel(false);
		sportsListRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
	};

	useEffect(() => {
		if (categories && sports) {
			const sportsList = sports?.filter((sport) => sport.categoryId === selectedCategoryId);
			if (!sportsList) return;
			setSportsList(sportsList ?? []);
			setSelectedSportId(sportsList[0]?.id);
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);

	const handleResize = useCallback(() => {
		setSportListWidth((prev) => sportsListRef.current?.offsetWidth ?? prev);
	}, []);

	useEffect(() => {
		// const ref = sportsListRef.current;
		window.addEventListener("resize", handleResize);
		// if (ref) ref.addEventListener("resize", handleResize);
		// console.log("width", ref?.offsetWidth);

		return () => {
			// remove the event listener before the component gets unmounted
			window.removeEventListener("resize", handleResize);
			// ref?.removeEventListener("resize", handleResize);
		};
	}, [handleResize]);

	// useEffect(() => {
	// 	handleResize();
	// }, [handleResize]);

	useEffect(() => {
		if (sportsListRef.current) {
			setSportListWidth(sportsListRef.current.offsetWidth);
		}
	}, [sportsListRef.current?.offsetWidth]);

	return (
		<>
			<Head>
				<title>Club-Sports</title>
				<meta
					name="description"
					content="web site to calculate club sports subscription including discounts and offers with latest sport price"
				/>
				<meta name="viewport" content="width=device-width, initial-scale=1" />
				<link rel="icon" href="/part_alternation_mark_color.svg" />
			</Head>
			<div className="bg-orange-100">
				<ToastContainer />
				<Popup
					modal
					nested
					open={openNameModel}
					closeOnDocumentClick
					onClose={() => setOpenNameModel(false)}
					contentStyle={{ width: "18rem", borderRadius: "0.75rem" }}
				>
					<div className="modal">
						<div className="flex flex-col justify-center gap-4">
							<div className="grid grid-cols-3 gap-2 rounded-xl border border-black" dir="rtl">
								<div className="bg-gray-100 text-gray-900 rounded-r-xl p-2 text-sm">
									اسم اللاعب
								</div>
								<input
									dir="rtl"
									className="outline-none rounded-xl text-xl"
									onChange={(e) => setPlayerName(e.target.value)}
									value={playerName}
								/>
							</div>
							<CustomButton buttontype={ButtonsType.PRIMARY} onClick={() => savePlayer()}>
								احفظ
							</CustomButton>
						</div>
					</div>
				</Popup>
				<div className="pt-12 overflow-hidden">
					<div
						style={{ paddingInlineEnd: "10px" }}
						className="grid lg:grid-cols-[3fr_20rem] grid-cols-1 justify-items-center gap-4"
					>
						<div className="grid grid-rows-[auto_100px_1fr] place-items-center grid-cols-1">
							<div className="text-xl font-extrabold text-black ">〽 حرك و اخنر رياضتك〽</div>
							<div className="" style={{ width: `${sportListWidth}px` }}>
								<Carousel
									responsive={{
										xxxxl: {
											breakpoint: { max: 1450, min: 1300 },
											items: 5,
											slidesToSlide: 3,
										},
										xxxl: {
											breakpoint: { max: 1300, min: 1170 },
											items: 4,
											slidesToSlide: 2,
											partialVisibilityGutter: 40,
										},
										xxl: {
											breakpoint: { max: 1170, min: 1050 },
											items: 2,
											slidesToSlide: 1,
											partialVisibilityGutter: 4,
										},
										xl: {
											breakpoint: { max: 1080, min: 1020 },
											items: 2,
											slidesToSlide: 1,
											partialVisibilityGutter: 4,
										},
										lg: {
											breakpoint: { max: 1020, min: 850 },
											items: 4,
											slidesToSlide: 1,
											partialVisibilityGutter: 4,
										},
										md: {
											breakpoint: { max: 850, min: 680 },
											items: 2,
											slidesToSlide: 1,
											partialVisibilityGutter: 4,
										},
										sm: {
											breakpoint: { max: 680, min: 0 },
											items: 1,
											slidesToSlide: 1,
											partialVisibilityGutter: 4,
										},
									}}
									keyBoardControl={true}
									customTransition="all .5"
									transitionDuration={500}
									containerClass=""
									itemClass="py-24"
									deviceType={""}
									infinite
									arrows
									ssr
									partialVisible={false}
									focusOnSelect={true}
									centerMode={true}
								>
									{categories?.map((cat) => (
										<button key={cat.id} onClick={() => onSelectedCategoryChange(cat.id)}>
											<MiniCard
												category={cat}
												icon={<BiFootball />}
												selected={selectedCategoryId === cat.id}
											/>
										</button>
									))}
								</Carousel>
							</div>
							<div className="flex flex-col gap-4 items-center px-[8rem]">
								<div className="text-xl font-extrabold text-black">〽 اضف رياضة〽</div>
								<div
									ref={sportsListRef}
									className="flex flex-wrap items-center justify-center gap-2 "
								>
									{sportsList.map((sport) => (
										<Card
											key={sport.id}
											sport={sport}
											icon={<BiFootball className="relative w-32 h-32" />}
											add={() => onSportAdded(sport)}
										/>
									))}
								</div>
							</div>
						</div>
						<div ref={listRef} className="">
							<ListCard
								players={playersList}
								calc={() => calculationHandler()}
								newPlayer={() => setOpenNameModel(true)}
								deleteSport={deleteSport}
								deletePlayer={deletePlayer}
							/>
						</div>
					</div>

					<div ref={resultsRef} className=" p-8 w-full">
						<ResultComponents result={playersResultList} />
					</div>
				</div>
			</div>
		</>
	);
}
