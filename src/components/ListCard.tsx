import { Player, PlayerSport } from "@/types";
import React from "react";
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

const ListCard = ({ players, calc, newPlayer, deletePlayer, deleteSport }: Props) => {
	return (
		<div className="grid grid-rows-[auto_3fr_1fr] bg-white border border-gray-100 rounded-lg shadow min-w-[1rem] w-72  h-2/3 ">
			<div className="p-4">
				<CustomButton onClick={newPlayer} buttontype={ButtonsType.PRIMARY} className="w-full">
					اضف لاعب ➕
				</CustomButton>
			</div>
			<div className=" py-4 overflow-y-auto">
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
										className="flex flex-row-reverse items-center justify-between py-4 w-full"
									>
										<div className="flex flex-col items-center w-2/3">
											<div className="text-lg font-semibold" dir="rtl">
												{sport.title}
											</div>
											<div className="  w-full">
												<div className="font-semibold text-orange-900 px-4">
													{sport.price}
												</div>
											</div>
										</div>
										<CustomButton
											onClick={() => deleteSport(player.id, sport)}
											buttontype={ButtonsType.PRIMARY}
											className="px-2 py-0 rounded-full"
										>
											X
										</CustomButton>
									</div>
								))}
							</div>
						</div>
					))}
				</div>
			</div>
			<div className="shadow-2xl  p-4">
				<div className="  text-center self-end ">
					<CustomButton onClick={calc} buttontype={ButtonsType.PRIMARY}>
						احسب
					</CustomButton>
				</div>
			</div>
		</div>
	);
};

export default ListCard;
