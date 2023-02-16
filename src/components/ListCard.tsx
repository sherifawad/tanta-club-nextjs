import { Player, PlayerSport } from "@/types";
import { RefObject, forwardRef, useEffect, useState } from "react";
import CustomButton from "./ui/CustomButton";
import { ButtonsType } from "@/data/constants";
import { AiFillDelete } from "react-icons/ai";

type Props = {
	players?: Player[];
	calc?: () => void;
	newPlayer?: () => void;
	deletePlayer: (player: Player) => void;
	deleteSport: (playerId: number, sport: PlayerSport) => void;
};

const ListCard = forwardRef<null | HTMLButtonElement, Props>(function ListCard(
	{ players, calc, newPlayer, deletePlayer, deleteSport }: Props,
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
				<CustomButton onClick={newPlayer} buttontype={ButtonsType.PRIMARY} className="w-full">
					اضف لاعب ➕
				</CustomButton>
			</div>
			<div className=" py-4 overflow-y-scroll">
				<div className="mx-4 overflow-y-auto divide-y divide-dashed">
					{players?.map((player) => (
						<div key={player.id} className=" flex flex-col items-center py-4">
							<div className="flex flex-row-reverse gap-2 bg-orange-100 w-2/3 justify-center rounded-full">
								<div className="text-black font-bold text-lg w-2/3 m-auto">
									{player?.name}
								</div>
								<button
									onClick={() => deletePlayer(player)}
									className="text-orange-900 w-1/3 px-2 hover:text-black"
								>
									<AiFillDelete />
								</button>
							</div>
							<div className=" divide-gray-900 divide-y divide-dashed p-4 w-full">
								{player?.sports?.map((sport) => (
									<div
										key={sport.id}
										className="grid grid-cols-[auto_1fr_auto] gap-2 items-center justify-between py-4 w-full"
									>
										<div className="">
											<div className="font-semibold text-base text-orange-900 flex">
												<p className="">{sport.price}</p>
												<span className="">_L.E</span>
											</div>
										</div>
										<div className="text-lg font-semibold text-start w-full" dir="rtl">
											{sport.title}
										</div>
										<CustomButton
											onClick={() => deleteSport(player.id, sport)}
											buttontype={ButtonsType.PRIMARY}
											className="px-2 py-0 rounded-full"
										>
											<AiFillDelete />
										</CustomButton>
									</div>
								))}
							</div>
						</div>
					))}
				</div>
			</div>
			<div dir="rtl" className="shadow-2xl p-4">
				<div className="flex flex-col  divide-y divide-dashed  gap-2">
					<div className="flex justify-between font-semibold">
						<div className="text-orange-900">{players?.length}</div>
						<div className="">Players</div>
					</div>
					<div className="flex justify-between font-semibold">
						<div className="text-orange-900">{sportCount}</div>
						<div className="">Sports</div>
					</div>
				</div>
				<div className="  text-center self-end">
					<CustomButton ref={ref} onClick={calc} buttontype={ButtonsType.PRIMARY}>
						احسب
					</CustomButton>
				</div>
			</div>
		</div>
	);
});

export default ListCard;
