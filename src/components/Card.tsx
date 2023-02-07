import { PlayerSport } from "@/utils/calc";
import Image from "next/image";
import { ReactNode } from "react";
import { BiFootball } from "react-icons/bi";

type Props = {
	icon?: ReactNode;
	sport: PlayerSport;
};
const Card = ({ icon, sport }: Props) => {
	const generateColor = Math.random().toString(16).substr(-6);

	return (
		<div className="">
			<div className="flex flex-col items-center">
				<div
					className="relative w-32 h-32 -mb-20 bg-white rounded-full shadow-inner"
					style={{
						color: `#${generateColor}`,
					}}
				>
					{icon}
				</div>
				<div className="flex flex-col items-center p-4 pt-20 bg-white border border-gray-100 rounded-lg shadow w-72">
					<div className="text-lg font-extrabold text-black">{sport.title}</div>
					<div className="text-lg text-orange">{sport.price}</div>
					<button className="flex items-center self-start justify-between p-2 font-semibold transition bg-gray-100 rounded-lg hover:text-orange">
						اضف
					</button>
				</div>
			</div>
		</div>
	);
};

export default Card;
