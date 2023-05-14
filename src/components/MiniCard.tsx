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
                    ? "text-orange-900 bg-orange-100 shadow-orange-900"
                    : "text-gray-900 bg-gray-100"
            }`}
        >
            <div className="text-lg font-extrabold whitespace-nowrap">
                {category.title}
            </div>
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
