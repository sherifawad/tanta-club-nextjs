import { ReactNode } from "react";

type Props = {
	icon?: ReactNode;
	title: string;
	text?: string;
};
const Card = (props: Props) => {
	return (
		<div className="bg-[#27496D] text-white w-[40px] h-[40px] p-[50px] rounded-full">
			<div className="card-icon">
				<div className="card-body">
					<h5 className="text-lg font-extrabold card-title">{props.title}</h5>
					<p className="font-bold card-text">{props.text}</p>
				</div>
			</div>
		</div>
	);
};

export default Card;
