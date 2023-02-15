import { PlayerSport } from "@/types";
import Image from "next/image";
import { ReactNode, useMemo, useState } from "react";
import { BiFootball } from "react-icons/bi";
import CustomButton from "./ui/CustomButton";
import { ButtonsType } from "@/data/constants";
import CardMenu from "./CardMenu";

type Props = {
	icon?: ReactNode;
	sport: PlayerSport;
	add?: () => void;
};
const Card = ({ icon, sport, add }: Props) => {
	const [openMenu, setOpenMenu] = useState(false);

	const generateColor = useMemo(() => Math.random().toString(16).substr(-6), []);

	const onMenuClick = () => {
		setOpenMenu(!openMenu);
	};

	return (
		<div className="">
			<div className="flex flex-col items-center ">
				{/* <div
					className="relative w-32 h-32 -mb-20 bg-white rounded-full shadow-inner flex-1"
					style={{
						color: `#${generateColor}`,
					}}
				>
					{icon}
				</div> */}
				<div
					className="self-end px-4 pt-4 -mb-12 z-50 relative flex justify-between  w-full items-start"
					dir="rtl"
				>
					<CardMenu sport={sport} />
					<div className="text-lg text-orange-900 font-semibold px-4 flex">
						<span className="">L.E_</span>
						<p className="">{sport.price}</p>
					</div>
				</div>
				<div className="grid grid-rows-[1fr_auto]  place-items-center p-4 pt-12 bg-white border border-gray-100 rounded-lg shadow w-60 h-44">
					<div className="text-lg font-extrabold text-black w-full text-center">{sport.title}</div>
					<CustomButton onClick={add} buttontype={ButtonsType.SECONDARY} className="w-16">
						اضف
					</CustomButton>
				</div>
			</div>
		</div>
	);
};

export default Card;
