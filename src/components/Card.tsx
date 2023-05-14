import { PlayerSport } from "types";
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

    const generateColor = useMemo(
        () => Math.random().toString(16).substr(-6),
        []
    );

    const onMenuClick = () => {
        setOpenMenu(!openMenu);
    };

    return (
        <div className="">
            <div className="flex flex-col items-center ">
                {/* <div
					className="relative flex-1 w-32 h-32 -mb-20 bg-white rounded-full shadow-inner"
					style={{
						color: `#${generateColor}`,
					}}
				>
					{icon}
				</div> */}
                <div
                    className="relative z-50 flex items-start self-end justify-between w-full px-4 pt-4 -mb-12"
                    dir="rtl"
                >
                    <CardMenu sport={sport} />
                    <div className="flex px-4 text-lg font-semibold text-orange-900">
                        <span className="">L.E_</span>
                        <p className="">{sport.price}</p>
                    </div>
                </div>
                <div className="grid grid-rows-[1fr_auto]  place-items-center p-4 pt-12 bg-white border border-gray-100 rounded-lg shadow w-60 h-44">
                    <div className="w-full text-lg font-extrabold text-center text-black">
                        {sport.title}
                    </div>
                    <CustomButton
                        onClick={add}
                        buttontype={ButtonsType.SECONDARY}
                        className="w-16"
                    >
                        اضف
                    </CustomButton>
                </div>
            </div>
        </div>
    );
};

export default Card;
