import Head from "next/head";
import { Category, Discount, Penalty, Sport } from "types";
import {
    ChangeEvent,
    useCallback,
    useEffect,
    useLayoutEffect,
    useMemo,
    useRef,
    useState,
} from "react";
import { moreThanTwoPlayers, swimmingDiscount } from "lib/calc";
import { splitPrivateSwimming } from "helpers/sportsUtils";
import { BiFootball } from "react-icons/bi";
import Card from "@/components/Card";
import ListCard from "@/components/ListCard";
import Carousel from "react-multi-carousel";
import "react-multi-carousel/lib/styles.css";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Popup from "reactjs-popup";
import "reactjs-popup/dist/index.css";
import { Player, PlayerSport } from "types";
import CustomButton from "@/components/ui/CustomButton";
import { ButtonsType } from "@/data/constants";
import ResultComponents from "@/components/ResultComponents";
import Search from "@/components/Search";
import { FcCalculator } from "react-icons/fc";
import PopUp from "@/components/PopUp";
import CategoriesList from "@/components/CategoriesList";
import { divvyUp } from "helpers/arrayUtils";
import { mergePlayers } from "helpers/playerUtils";
import { sportsRepo } from "lib/sports-repo";
import { categoriesRepo } from "lib/categories-repo";
import { discountsRepo } from "lib/discounts-repo";
import { penaltiesRepo } from "lib/penalties-repo";
import SelectCategories from "@/components/SelectCategories";
import { arrayToReactSelectOption } from "@/lib/utils";
import axios from "axios";
import { getCookie } from "cookies-next";
import { getToken } from "next-auth/jwt";
import { getSession } from "next-auth/react";
import { getServerSession } from "next-auth";
import { authOptions } from "./api/auth/[...nextauth]";

const secret = process.env.NEXTAUTH_SECRET;

export async function getStaticProps() {
    try {
        const categories = categoriesRepo.getAll();
        const sports = sportsRepo.getAll();
        const discounts = discountsRepo.getAll();
        const penalties = penaltiesRepo.getAll();
        return {
            props: {
                categories,
                discounts,
                penalties,
                sports,
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
    const [currentPlayer, setCurrentPlayer] = useState<Player | undefined>();
    const [selectedCategoryId, setSelectedCategoryId] = useState<number>(1);
    const [sportsList, setSportsList] = useState<PlayerSport[]>([]);
    const [playersResultList, setPlayersResultList] = useState<Player[]>([]);
    const [playerName, setPlayerName] = useState("");
    const [playersList, setPlayersList] = useState<Player[]>([]);
    const [openNameModel, setOpenNameModel] = useState(false);
    const [searchValue, setSearchValue] = useState("");
    const [pending, setPending] = useState(false);

    const onSelectedCategoryChange = useCallback(
        (categoryId: number) => {
            try {
                setSelectedCategoryId(categoryId);
                const sportsList = sports?.filter(
                    (sport) => sport.categoryId === categoryId
                );
                setSportsList(() => {
                    if (sportsList != null && sportsList?.length > 0) {
                        return sportsList;
                    }
                    return [];
                });
            } catch (error) {
                console.error(error);
            }
        },
        [sports]
    );

    const onSportAdded = useCallback(
        (sport: PlayerSport | undefined) => {
            try {
                if (pending) return;
                setPending(true);
                if (!sport) return;
                if (playersList.length < 1) {
                    listRef.current?.scrollIntoView({
                        behavior: "smooth",
                        block: "start",
                    });

                    toast.error("اضف لاعب", {
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
                // if (playersList.length < 1) return;
                let player = currentPlayer;
                if (player == null) return;
                const exist = player.sports.some((s) => s.id === sport.id);

                if (exist) {
                    toast.error(
                        ` لعبة مكررة ${sport.title} ${player.name}  للاعب `,
                        {
                            position: "top-right",
                            autoClose: 1000,
                            hideProgressBar: false,
                            closeOnClick: true,
                            pauseOnHover: true,
                            draggable: true,
                            progress: undefined,
                            theme: "light",
                        }
                    );
                    return;
                }

                setPlayersList((prev) => {
                    const getPlayer = prev.find((p) => p.id === player!.id);

                    if (getPlayer == null) return prev;
                    const orderedSports = [...getPlayer.sports, sport].sort(
                        (s1, s2) =>
                            s1.price < s2.price
                                ? 1
                                : s1.price > s2.price
                                ? -1
                                : 0
                    );
                    return prev.map((player) =>
                        player.id === getPlayer?.id
                            ? { ...getPlayer, sports: orderedSports }
                            : player
                    );
                });
                toast.success(
                    `${player.name} تم إضافة ${sport.title}  للاعب `,
                    {
                        position: "top-right",
                        autoClose: 500,
                        hideProgressBar: false,
                        closeOnClick: true,
                        pauseOnHover: true,
                        draggable: true,
                        progress: undefined,
                        theme: "light",
                    }
                );
            } catch (error) {
                console.error(error);
            } finally {
                setPending(false);
            }
        },
        [currentPlayer, pending, playersList]
    );

    const deleteSport = useCallback(
        (playerId: number, sport: PlayerSport) => {
            try {
                if (pending) return;
                setPending(true);
                if (!playerId || !sport) return;

                setPlayersList((prev) => {
                    const [currentPlayer, rest] = divvyUp(
                        prev,
                        (player) => player.id === playerId
                    );
                    if (!currentPlayer[0]) return prev;
                    const orderedSports = currentPlayer[0].sports.filter(
                        (s) => s.id !== sport.id
                    );
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
                        : [
                              ...rest,
                              { ...currentPlayer[0], sports: orderedSports },
                          ];
                });
            } catch (error) {
                console.error(error);
            } finally {
                setPending(false);
            }
        },
        [pending]
    );

    const deletePlayer = useCallback(
        (player: Player) => {
            try {
                if (pending) return;
                setPending(true);
                if (!player) return;
                setPlayersList((prev) => {
                    const filteredList = prev.filter((p) => p.id !== player.id);
                    setCurrentPlayer(filteredList.at(-1));
                    return filteredList;
                });
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
            } catch (error) {
                console.error(error);
            } finally {
                setPending(false);
            }
        },
        [pending]
    );

    const calculationHandler = useCallback(() => {
        try {
            if (pending) return;
            setPending(true);
            if (playersList.length < 1) {
                calcButtonRef.current?.scrollIntoView({
                    behavior: "smooth",
                    block: "end",
                });
                toast.error("اضف لاعب", {
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
            let [swimmingPrivateList, otherSports] =
                splitPrivateSwimming(playersList);

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
            resultsRef.current?.scrollIntoView({
                behavior: "smooth",
                block: "start",
            });
        } catch (error) {
            console.error(error);
        } finally {
            setPending(false);
        }
    }, [pending, playersList]);

    const savePlayer = useCallback(() => {
        try {
            if (pending) return;
            setPending(true);
            setOpenNameModel(true);

            const isNameDuplicated = playersList.find(
                (player) => player.name === playerName.trim()
            );

            if (isNameDuplicated || playerName.trim() === "") {
                toast.error("الاسم مكرر", {
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
            const newPlayer = {
                id: playersList.length + 1,
                name: playerName.trim(),
                sports: [],
            };
            setPlayersList((prev) => [...prev, newPlayer]);
            setCurrentPlayer(newPlayer);
            setOpenNameModel(false);
            setPlayerName("");
        } catch (error) {
            console.error(error);
        } finally {
            setPending(false);
        }
    }, [pending, playerName, playersList]);

    const onSearchValueChange = useCallback(
        (e: ChangeEvent<HTMLInputElement>) => {
            try {
                if (pending) return;
                setPending(true);
                const { value } = e.target;
                setSearchValue(value);
                if (value.length > 1) {
                    const filteredSports = sports?.filter(
                        (sport) =>
                            sport.title
                                ?.toLowerCase()
                                ?.includes(value.trim()) ||
                            sport.name?.toLowerCase()?.includes(value.trim())
                    );
                    if (!filteredSports || filteredSports.length < 1) return;
                    setSportsList(filteredSports);
                    setSelectedCategoryId(-1);
                }
            } catch (error) {
                console.error(error);
            } finally {
                setPending(false);
            }
        },
        [pending, sports]
    );

    const addSport = (playerId: number) => {
        try {
            if (pending) return;
            setPending(true);
            if (playerId) {
                setCurrentPlayer(
                    (prev) =>
                        playersList.find((player) => player.id === playerId) ??
                        prev
                );
            }
            window.scrollTo({
                top: 0,
                left: 0,
                behavior: "smooth",
            });
        } catch (error) {
            console.log("🚀 ~ file: index.tsx:399 ~ addSport ~ error:", error);
        } finally {
            setPending(false);
        }
    };

    useEffect(() => {
        setPlayersResultList((prev) =>
            !playersList ||
            playersList.length < 1 ||
            !playersList[0].sports ||
            playersList[0].sports.length < 1
                ? []
                : prev
        );
    }, [playersList]);

    useEffect(() => {
        if (categories && sports) {
            const sportsList = sports?.filter(
                (sport) => sport.categoryId === selectedCategoryId
            );
            if (!sportsList) return;
            setSportsList(sportsList ?? []);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    return (
        <>
            <Head>
                <title>Club-Sports</title>
                <meta
                    name="description"
                    content="web site to calculate club sports subscription including discounts and offers with latest sport price"
                />
                <meta
                    name="viewport"
                    content="width=device-width, initial-scale=1"
                />
                <link rel="icon" href="/part_alternation_mark_color.svg" />
            </Head>
            <div className="container mx-auto">
                <ToastContainer />
                <PopUp
                    onChange={(e) => setPlayerName(e.target.value)}
                    onClose={() => setOpenNameModel(false)}
                    openNameModel={openNameModel}
                    playerName={playerName}
                    savePlayer={() => savePlayer()}
                />

                <div className="container mx-auto overflow-hidden">
                    {/* data */}
                    <div
                        style={{ paddingInlineEnd: "10px" }}
                        className="flex flex-col gap-4 lg:flex-row pt-28"
                    >
                        <div className="flex flex-col w-full px-8 mx-auto">
                            {/* fixed */}
                            <div className="sm:relative fixed z-50 flex items-center self-center min-w-[60%] gap-2">
                                {/* searchBar */}
                                <div className="flex-grow">
                                    <Search
                                        onChange={onSearchValueChange}
                                        value={searchValue}
                                    />
                                </div>

                                {/* calc Button */}

                                <button
                                    ref={fixedButtonRef}
                                    className="flex flex-col items-center"
                                    onClick={calculationHandler}
                                >
                                    <FcCalculator className="text-3xl " />
                                    <div className="text-lg font-extrabold cursor-pointer text-customOrange-900">
                                        احسب
                                    </div>
                                </button>
                            </div>

                            {/* DataBody */}
                            <div className="flex flex-col items-center gap-1 mt-16">
                                {/* CategoryList */}
                                <div className="flex flex-col min-w-[60%] gap-4 my-4">
                                    <div
                                        ref={categoriesListRef}
                                        className="self-center text-xl font-extrabold text-black justify-self-center"
                                    >
                                        〽 اختر رياضتك〽
                                    </div>

                                    <div className="z-30 flex items-center justify-between w-full p-2 bg-white rounded-full shadow shadow-customOrange-900">
                                        <SelectCategories
                                            options={
                                                arrayToReactSelectOption(
                                                    "name",
                                                    "id",
                                                    categories ?? []
                                                ) ?? []
                                            }
                                            onChange={onSelectedCategoryChange}
                                            value={selectedCategoryId}
                                        />
                                    </div>
                                </div>
                                {/* sportList */}
                                <div className="flex flex-col items-center gap-6 ">
                                    <div className="text-xl font-extrabold text-black">
                                        〽 اضف رياضة〽
                                    </div>
                                    <div
                                        ref={sportsListRef}
                                        className="flex flex-wrap items-center justify-center gap-2 "
                                    >
                                        {sportsList.map((sport) => (
                                            <Card
                                                key={sport.id}
                                                sport={sport}
                                                icon={
                                                    <BiFootball className="relative w-32 h-32" />
                                                }
                                                add={() => onSportAdded(sport)}
                                            />
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </div>
                        {/* ListCard */}
                        <div ref={listRef} className="max-w-[20rem] mx-auto">
                            <ListCard
                                ref={calcButtonRef}
                                addSport={addSport}
                                players={playersList}
                                calc={() => calculationHandler()}
                                newPlayer={() => setOpenNameModel(true)}
                                deleteSport={deleteSport}
                                deletePlayer={deletePlayer}
                            />
                        </div>
                    </div>
                    {/* Result */}
                    <div ref={resultsRef} className="w-full p-8 ">
                        <ResultComponents result={playersResultList} />
                    </div>
                </div>
            </div>
        </>
    );
}
