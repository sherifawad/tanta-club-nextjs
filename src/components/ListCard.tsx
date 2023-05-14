import { Player, PlayerSport } from "types";
import { RefObject, forwardRef, useEffect, useState } from "react";
import CustomButton from "./ui/CustomButton";
import { ButtonsType } from "@/data/constants";
import { AiFillDelete } from "react-icons/ai";

type Props = {
    players?: Player[];
    calc?: () => void;
    addSport: (id: number) => void;
    newPlayer?: () => void;
    deletePlayer: (player: Player) => void;
    deleteSport: (playerId: number, sport: PlayerSport) => void;
};

const ListCard = forwardRef<null | HTMLButtonElement, Props>(function ListCard(
    { players, addSport, calc, newPlayer, deletePlayer, deleteSport }: Props,
    ref
) {
    const [sportCount, setSportCount] = useState(0);
    const [total, setTotal] = useState(0);

    useEffect(() => {
        setSportCount(0);
        setTotal(0);

        players?.forEach((player) => {
            player.sports.forEach((sport) => {
                setTotal((prev) => (prev += sport.price));
                setSportCount((prev) => prev + 1);
            });
        });
    }, [players]);

    return (
        <div className="grid grid-rows-[60px_1fr_120px] bg-white border border-gray-100 rounded-lg shadow md:min-w-[20rem] w-60 sm:max-h-[90vh] max-h-[60vh] min-h-[60vh]">
            <div className="p-4">
                <CustomButton
                    onClick={newPlayer}
                    buttontype={ButtonsType.PRIMARY}
                    className="w-full"
                >
                    {`${
                        players && players.length < 1
                            ? "اضف لاعب ➕"
                            : " اضف اخ ➕"
                    }`}
                </CustomButton>
            </div>
            <div className="py-4 overflow-y-scroll ">
                <div className="mx-4 overflow-y-auto divide-y divide-dashed">
                    {players?.map((player, PlayerIndex) => (
                        <div
                            key={player.id}
                            className="flex flex-col items-center py-4 "
                        >
                            <div className="flex flex-row-reverse justify-center w-2/3 gap-2 bg-orange-100 rounded-full">
                                <div className="w-2/3 m-auto text-lg font-bold text-black">
                                    {player?.name}
                                </div>
                                <button
                                    onClick={() => deletePlayer(player)}
                                    className="w-1/3 px-2 text-orange-900 hover:text-black"
                                >
                                    <AiFillDelete />
                                </button>
                            </div>
                            <div className="w-full p-4 divide-y divide-gray-900  divide-dashed">
                                {player?.sports?.map((sport) => (
                                    <div
                                        key={sport.id}
                                        className="grid grid-cols-[auto_1fr_auto] gap-2 items-center justify-between py-4 w-full"
                                    >
                                        <div className="">
                                            <div className="flex text-base font-semibold text-orange-900">
                                                <p className="">
                                                    {sport.price}
                                                </p>
                                                <span className="">_L.E</span>
                                            </div>
                                        </div>
                                        <div
                                            className="w-full text-lg font-semibold text-start"
                                            dir="rtl"
                                        >
                                            {sport.title}
                                        </div>
                                        <CustomButton
                                            onClick={() =>
                                                deleteSport(player.id, sport)
                                            }
                                            buttontype={ButtonsType.PRIMARY}
                                            className="!p-0.5 rounded-full !text-white hover:!text-black"
                                        >
                                            <AiFillDelete />
                                        </CustomButton>
                                    </div>
                                ))}
                                <CustomButton
                                    onClick={() => addSport(player.id)}
                                    buttontype={ButtonsType.SECONDARY}
                                    className="w-full"
                                >
                                    اضف لعبة ➕
                                </CustomButton>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
            <div dir="rtl" className="p-4 shadow-2xl">
                <div className="flex flex-col gap-2 divide-y divide-dashed">
                    <div className="flex justify-between font-semibold">
                        <div className="text-orange-900">{players?.length}</div>
                        <div className="">Players</div>
                    </div>
                    <div className="flex justify-between font-semibold">
                        <div className="text-orange-900">{sportCount}</div>
                        <div className="">Sports</div>
                    </div>
                </div>
                <div className="self-end text-center ">
                    <CustomButton
                        ref={ref}
                        onClick={calc}
                        buttontype={ButtonsType.PRIMARY}
                    >
                        احسب
                    </CustomButton>
                </div>
            </div>
        </div>
    );
});

export default ListCard;
