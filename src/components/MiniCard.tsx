import { ReactNode } from "react";

type Props = {
	icon?: ReactNode;
	title: string;
	text?: string;
};
const MiniCard = (props: Props) => {
	return (
		<div className="flex items-center justify-center px-4 py-2 space-x-3 text-gray-900 bg-gray-100 rounded-full w-fit">
			<h5 className="text-lg font-extrabold">{props.title}</h5>

			{props.icon}
		</div>
	);
};

export default MiniCard;
