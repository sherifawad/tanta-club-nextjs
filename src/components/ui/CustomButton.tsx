import { ButtonsType } from "@/data/constants";
import { ButtonHTMLAttributes, forwardRef, useEffect } from "react";

interface Props extends ButtonHTMLAttributes<HTMLButtonElement> {
	buttontype?: ButtonsType;
}

const CustomButton = forwardRef<null | HTMLButtonElement, Props>(function CustomButton(
	{ buttontype, className, children, ...rest }: Props,
	ref
) {
	return (
		<button
			ref={ref}
			{...rest}
			className={`px-4 py-2 rounded-full ${
				buttontype === ButtonsType.PRIMARY
					? "bg-orange-900 text-white hover:text-black"
					: "text-black bg-gray-100 hover:text-orange-900"
			}   ${className}`}
		>
			{children}
		</button>
	);
});

export default CustomButton;
