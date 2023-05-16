import { Category } from "types";
import { ButtonHTMLAttributes, ReactNode } from "react";

type Props = {
    icon?: ReactNode;
    category: Category;
    selected: boolean;
};
const MiniCard = ({ icon, category, selected }: Props) => {
    return (
        <div
            className={`flex flex-nowrap items-center justify-center p-2 gap-2 shadow rounded-full w-28 ${
                selected
                    ? "text-customOrange-900 bg-customOrange-100 shadow-customOrange-900"
                    : "text-customGray-900 bg-customGray-100"
            }`}
        >
            <div className="text-lg font-extrabold whitespace-nowrap">
                {category.title}
            </div>
            {/* <div
				style={{
					color: `${selected ? "text-customOrange-900" : "text-black"}`,
				}}
			>
				{icon}
			</div> */}
        </div>
    );
};

export default MiniCard;
