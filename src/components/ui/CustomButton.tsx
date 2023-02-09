import { ButtonsType } from "@/data/constants";
import React, { ButtonHTMLAttributes } from "react";

interface Props extends ButtonHTMLAttributes<HTMLButtonElement> {
	buttontype?: ButtonsType;
}

const CustomButton = (props: Props) => {
	return (
		<button
			{...props}
			className={`px-4 py-2 rounded-full ${
				props.buttontype === ButtonsType.PRIMARY
					? "bg-orange-900 text-white"
					: "text-gray-900 bg-gray-100"
			}  hover:text-black ${props.className}`}
		>
			{props.children}
		</button>
	);
};

export default CustomButton;
