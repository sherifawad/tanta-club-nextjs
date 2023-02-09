import { Player, PlayerSport } from "@/types";
import React from "react";
import CustomButton from "./ui/CustomButton";
import { ButtonsType } from "@/data/constants";

type Props = {
	players?: Player[];
	calc?: () => void;
	newPlayer?: () => void;
};

const ListCard = ({ players, calc, newPlayer }: Props) => {
	return (
		<div className="grid grid-rows-[auto_3fr_1fr] bg-white border border-gray-100 rounded-lg shadow min-w-[1rem] w-72 h-2/3 sm:h-1/3 max-h-screen ">
			<div className="p-4">
				<CustomButton onClick={newPlayer} buttontype={ButtonsType.PRIMARY} className="w-full">
					اضف لاعب ➕
				</CustomButton>
			</div>
			<div className=" py-4 overflow-y-auto">
				<div className="mx-4 overflow-y-auto divide-y divide-dashed">
					{players?.map((player) => (
						<div key={player.id} className=" flex flex-col items-center py-4">
							<div className="text-orange-900 font-bold text-lg">{player?.name}</div>
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
										<button className="px-4 py-2 rounded-full w-fit  bg-orange-900 text-white hover:text-black">
											X
										</button>
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
