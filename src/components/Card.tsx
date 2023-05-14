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
        <div className="flex-1 grid grid-rows-4 items-center p-2 bg-white border border-gray-100 rounded-lg shadow min-w-[15rem] min-h-[11rem] ">
            <div
                className="relative z-20 flex items-start justify-between w-full px-4-mb-12"
                dir="rtl"
            >
                <CardMenu sport={sport} />
                <div className="flex px-4 text-lg font-semibold text-orange-900">
                    <span className="-mt-1">ج_</span>
                    <p className="">{sport.price}</p>
                </div>
            </div>
            <p className="w-full row-span-2 text-lg font-extrabold text-center text-black">
                {sport.title}
            </p>
            <div className="flex items-center justify-center w-full">
                <CustomButton
                    onClick={add}
                    buttontype={ButtonsType.SECONDARY}
                    className="w-16"
                >
                    اضف
                </CustomButton>
            </div>
        </div>
    );
};

export default Card;
