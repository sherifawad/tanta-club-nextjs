import Head from "next/head";
import { Inter } from "@next/font/google";
import { Category, Discount, Penalty, Sport } from "@prisma/client";
import { prisma } from "lib/prisma";
import MiniCard from "@/components/MiniCard";
import { ChangeEvent, useCallback, useEffect, useLayoutEffect, useMemo, useRef, useState } from "react";
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
import Search from "@/components/Search";
import { FcCalculator } from "react-icons/fc";
import PopUp from "@/components/PopUp";
import CategoriesList from "@/components/CategoriesList";

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
	const fixedButtonRef = useRef<null | HTMLButtonElement>(null);
	const calcButtonRef = useRef<null | HTMLButtonElement>(null);
	const resultsRef = useRef<null | HTMLDivElement>(null);
	const listRef = useRef<null | HTMLDivElement>(null);
	const sportsListRef = useRef<null | HTMLDivElement>(null);
	const categoriesListRef = useRef<null | HTMLDivElement>(null);
	const [sportListWidth, setSportListWidth] = useState<number>(0);
	const [fixedButtonWidth, setFixedButtonWidth] = useState<number>(0);
	const [windowWidth, setWindowWidth] = useState<number>(0);
	const [selectedCategoryId, setSelectedCategoryId] = useState<number>(1);
	const [sportsList, setSportsList] = useState<PlayerSport[]>([]);
	const [selectedSportId, setSelectedSportId] = useState<number>();
	const [playersResultList, setPlayersResultList] = useState<Player[]>([]);
	const [playerName, setPlayerName] = useState("");
	const [playersList, setPlayersList] = useState<Player[]>([]);
	const [openNameModel, setOpenNameModel] = useState(false);
	const [searchValue, setSearchValue] = useState("");

	let currentPlayer = useMemo<Player | undefined>(
		() => playersList?.find((player) => player.name === playerName.trim()),
		[playerName, playersList]
	);

	const onSelectedCategoryChange = useCallback(
		(categoryId: number) => {
			setSelectedCategoryId(categoryId);
			const sportsList = sports?.filter((sport) => sport.categoryId === categoryId);
			setSportsList((prev) => {
				if (sportsList && sportsList?.length > 0) {
					setSelectedSportId(sportsList[0].id);
					return sportsList;
				}
				return [];
			});
		},
		[sports]
	);

	const onSportAdded = useCallback(
		(sport: PlayerSport | undefined) => {
			if (!sport) return;
			if (playerName === "" || playersList.length < 1) {
				listRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });

				toast.error("اضف اسم", {
					position: "top-center",
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
			if (playerName === "" || playersList.length < 1) return;
			if (!currentPlayer) {
				currentPlayer = playersList.at(-1);
				if (!currentPlayer) return;
				setPlayerName(currentPlayer.name);
			}
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
				const [currentPlayers, rest] = divvyUp(
					prev,
					(player) => player.name === currentPlayer?.name.trim()
				);
				const orderedSports = [...currentPlayers[0]?.sports, sport].sort((s1, s2) =>
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
				return [...rest, { ...currentPlayers[0], sports: orderedSports }];
			});
		},
		[playerName, playersList]
	);

	const deleteSport = useCallback((playerId: number, sport: PlayerSport) => {
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
			return orderedSports.length < 1
				? prev.filter((player) => player.id !== playerId)
				: [...rest, { ...currentPlayer[0], sports: orderedSports }];
		});
	}, []);

	const deletePlayer = useCallback((player: Player) => {
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
	}, []);

	const calculationHandler = useCallback(() => {
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
	}, [playerName, playersList]);

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
		window.scrollTo({
			top: 0,
			left: 0,
			behavior: "smooth",
		});
	};

	const onSearchValueChange = useCallback(
		(e: ChangeEvent<HTMLInputElement>) => {
			const { value } = e.target;
			setSearchValue(value);
			if (value.length > 1) {
				const filteredSports = sports?.filter(
					(sport) =>
						sport.title?.toLowerCase()?.includes(value.trim()) ||
						sport.name?.toLowerCase()?.includes(value.trim())
				);
				if (!filteredSports || filteredSports.length < 1) return;
				setSportsList(filteredSports);
				setSelectedCategoryId(-1);
			}
		},
		[sports]
	);

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
		setFixedButtonWidth((prev) => fixedButtonRef.current?.offsetWidth ?? prev);
		setWindowWidth(window.innerWidth);
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

	useEffect(() => {
		if (sportsListRef.current) {
			setSportListWidth((prev) => (prev === 0 ? sportsListRef.current?.offsetWidth ?? 0 : prev));
			setFixedButtonWidth((prev) => (prev === 0 ? fixedButtonRef.current?.offsetWidth ?? 0 : prev));
			setWindowWidth((prev) => (prev === 0 ? window.innerWidth ?? 0 : prev));
		}
	}, [sportsListRef.current?.offsetWidth, fixedButtonRef.current?.offsetWidth]);

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
				<PopUp
					onChange={(e) => setPlayerName(e.target.value)}
					onClose={() => setOpenNameModel(false)}
					openNameModel={openNameModel}
					playerName={playerName}
					savePlayer={() => savePlayer()}
				/>

				<div className="overflow-hidden">
					{/* data */}
					<div
						style={{ paddingInlineEnd: "10px" }}
						className="grid lg:grid-cols-[3fr_20rem] grid-cols-1 justify-items-center gap-4 pt-28"
					>
						{/* fixed Button */}
						<button
							ref={fixedButtonRef}
							style={{
								left: `${
									sportListWidth / windowWidth > 0.46 && windowWidth < 1024
										? (windowWidth - sportListWidth) / 2.25
										: (windowWidth - sportListWidth) / 4.9
								}px`,
							}}
							className="flex flex-col items-center fixed pt-3"
							onClick={() =>
								calcButtonRef.current?.scrollIntoView({
									behavior: "smooth",
									block: "end",
								})
							}
						>
							<FcCalculator className="text-3xl " />
							<div className="text-orange-900 font-extrabold text-lg cursor-pointer">احسب</div>
						</button>
						{/* DataBody */}
						<div className="flex flex-col items-center gap-1">
							{/* searchBar */}
							<div
								className="pl-8"
								style={{
									width: `${sportListWidth - fixedButtonWidth}px`,
								}}
							>
								<Search onChange={onSearchValueChange} value={searchValue} />
							</div>
							{/* CategoryList */}
							<div className="grid grid-rows-[50px_50px] gap-4 place-items-center grid-cols-1">
								<div
									ref={categoriesListRef}
									className="text-xl font-extrabold text-black self-center"
								>
									〽 حرك و اختر رياضتك〽
								</div>

								<div className="w-2/3" style={{ width: `${sportListWidth}px` }}>
									<CategoriesList
										categories={categories ?? []}
										selectedCategoryId={selectedCategoryId}
										onCategorySelected={(id) => onSelectedCategoryChange(id)}
									/>
								</div>
							</div>
							{/* sportList */}
							<div className="flex flex-col gap-6 items-center px-[8rem]">
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
						{/* ListCard */}

						<div ref={listRef} className="">
							<ListCard
								ref={calcButtonRef}
								players={playersList}
								calc={() => calculationHandler()}
								newPlayer={() => setOpenNameModel(true)}
								deleteSport={deleteSport}
								deletePlayer={deletePlayer}
							/>
						</div>
					</div>
					{/* Result */}
					<div ref={resultsRef} className=" p-8 w-full ">
						<ResultComponents result={playersResultList} />
					</div>
				</div>
			</div>
		</>
	);
}
