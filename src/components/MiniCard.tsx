import { Category } from "@prisma/client";
import { ButtonHTMLAttributes, ReactNode } from "react";

type Props = {
	icon?: ReactNode;
	category: Category;
	selected: boolean;
};
const MiniCard = ({ icon, category, selected }: Props) => {
	return (
		<div
			className={`flex items-center justify-center px-4 py-2 space-x-3  rounded-full w-fit ${
				selected ? "text-orange-900 bg-orange-100" : "text-gray-900 bg-gray-100"
			}`}
		>
			<div className="text-lg font-extrabold">{category.title}</div>
			{/* <div
				style={{
					color: `${selected ? "text-orange-900" : "text-black"}`,
				}}
			>
				{icon}
			</div> */}
		</div>
	);
};

export default MiniCard;
