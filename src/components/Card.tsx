import { PlayerSport } from "@/types";
import Image from "next/image";
import { ReactNode, useMemo, useState } from "react";
import { BiFootball } from "react-icons/bi";

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
				<div className="self-end px-4 pt-4 -mb-12 z-50 relative" dir="rtl">
					<div className="flex flex-col">
						<button
							id="dropdownButton"
							data-dropdown-toggle="dropdown"
							className="inline-block text-black  hover:bg-gray-100  focus:ring-4 focus:outline-none focus:ring-gray-100 rounded-lg text-sm p-1.5"
							type="button"
							onClick={onMenuClick}
						>
							<span className="sr-only">Open dropdown</span>
							<svg
								className="w-6 h-6"
								aria-hidden="true"
								fill="currentColor"
								viewBox="0 0 20 20"
								xmlns="http://www.w3.org/2000/svg"
							>
								<path d="M6 10a2 2 0 11-4 0 2 2 0 014 0zM12 10a2 2 0 11-4 0 2 2 0 014 0zM16 12a2 2 0 100-4 2 2 0 000 4z"></path>
							</svg>
						</button>
						<div
							id="dropdown"
							className={`${
								openMenu ? "" : "hidden"
							} absolute mt-8 text-base list-none bg-white divide-y divide-gray-100 rounded-lg shadow shadow-orange-900 w-40`}
						>
							<div
								className={`flex flex-col ${sport?.Penalty ? "divide-y divide-dashed" : ""}`}
							>
								<ul className="" aria-labelledby="dropdownButton">
									{sport.DiscountOptions?.map((discount) => (
										<li key={discount.id}>
											<a href="#" className="block p-2 text-sm text-black ">
												{discount.title}
											</a>
										</li>
									))}
								</ul>
								<div className="" aria-labelledby="dropdownButton">
									<a href="#" className="block p-2 text-sm text-orange-900 ">
										{sport.Penalty?.title}
									</a>
								</div>
							</div>
						</div>
					</div>
				</div>
				<div className="flex flex-col items-center  p-4 pt-12 bg-white border border-gray-100 rounded-lg shadow w-72">
					<div className="text-lg font-extrabold text-black">{sport.title}</div>
					<div className="text-lg text-orange-900">{sport.price}</div>
					<button
						onClick={add}
						className="flex items-center self-start justify-between p-2 font-semibold transition bg-gray-100 rounded-lg hover:text-orange-900"
					>
						اضف
					</button>
				</div>
			</div>
		</div>
	);
};

export default Card;
