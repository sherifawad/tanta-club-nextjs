import Head from "next/head";
import { Inter } from "@next/font/google";
import { Category, Discount, Penalty, Sport } from "@prisma/client";
import { prisma } from "lib/prisma";
import SingleSelection from "@/components/ui/SingleSelection";
import MiniCard from "@/components/MiniCard";
import { useEffect, useMemo, useState } from "react";
import {
	Player,
	PlayerSport,
	moreThanTwoPlayers,
	onePlayer,
	swimmingDiscount,
	twoPlayers,
} from "@/utils/calc";
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
	const [selectedCategoryId, setSelectedCategoryId] = useState<number>(1);
	const [sportsList, setSportsList] = useState<PlayerSport[]>([]);
	const [selectedSportId, setSelectedSportId] = useState<number>();
	const [playersResultList, setPlayersResultList] = useState<Player[]>([]);
	const [playerName, setPlayerName] = useState("");
	const [playersList, setPlayersList] = useState<Player[]>([]);
	const [openNameModel, setOpenNameModel] = useState(false);

	const currentPlayer = useMemo<Player>(
		() => playersList.find((player) => player.name === playerName.trim()),
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
		if (playerName === "") {
			setOpenNameModel(true);
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
			const [currentPlayer, rest] = divvyUp(playersList, (player) => player.name === playerName.trim());
			const orderedSports = [...currentPlayer[0]?.sports, sport].sort((s1, s2) =>
				s1.price < s2.price ? 1 : s1.price > s2.price ? -1 : 0
			);
			return [...rest, { name: currentPlayer[0].name, sports: orderedSports }];
		});
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
		setPlayersResultList(refracted);
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

	return (
		<>
			<Head>
				<title>Create Next App</title>
				<meta name="description" content="Generated by create next app" />
				<meta name="viewport" content="width=device-width, initial-scale=1" />
				<link rel="icon" href="/favicon.ico" />
			</Head>
			<ToastContainer />
			<Popup
				modal
				nested
				open={openNameModel}
				closeOnDocumentClick
				onClose={() => setOpenNameModel(false)}
				contentStyle={{ width: "18rem" }}
			>
				<div className="modal ">
					<div className="flex flex-col justify-center gap-4 ">
						<input
							className="bg-gray-500"
							onChange={(e) => setPlayerName(e.target.value)}
							value={playerName}
						/>
						<button
							className="px-4 py-2 rounded-full w-full  bg-orange-900 text-white hover:text-black"
							onClick={() => savePlayer()}
						>
							احفظ
						</button>
					</div>
				</div>
			</Popup>
			<div className="flex flex-wrap justify-center overflow-hidden bg-orange-100">
				<div className="w-full sm:w-2/3 p-8 flex flex-col items-center">
					<Carousel
						responsive={{
							desktop: {
								breakpoint: { max: 3000, min: 1024 },
								items: 3,
							},
							tablet: {
								breakpoint: { max: 1024, min: 464 },
								items: 3,
							},
							mobile: {
								breakpoint: { max: 464, min: 0 },
								items: 2,
							},
						}}
						slidesToSlide={2}
						containerClass="w-4/6 pb-4 "
						sliderClass="flex justify-center items-center gap-4 rounded-all"
						deviceType={""}
						infinite
						arrows
						ssr
						centerMode
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
					<div className="flex flex-wrap items-center justify-center gap-4 ">
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
				<div className="pt-10">
					<ListCard
						players={playersList}
						calc={() => calculationHandler()}
						newPlayer={() => setOpenNameModel(true)}
					/>
				</div>
			</div>
			{JSON.stringify(playersResultList, null, 2)}
		</>
	);
}
