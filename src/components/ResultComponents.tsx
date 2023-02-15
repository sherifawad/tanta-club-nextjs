import { Player } from "@/types";
import { useEffect, useRef, useState } from "react";
import "react-tooltip/dist/react-tooltip.css";
import { Tooltip, TooltipProvider, TooltipWrapper } from "react-tooltip";

type Props = {
	result: Player[];
};

function ResultComponents({ result }: Props) {
	const [sportCount, setSportCount] = useState(0);
	const [total, setTotal] = useState(0);

	useEffect(() => {
		setSportCount(0);
		setTotal(0);

		result.forEach((player) => {
			player.sports.forEach((sport) => {
				setTotal((prev) => (prev += sport.price));
				setSportCount((prev) => prev + 1);
			});
		});
	}, [result]);

	return (
		<TooltipProvider>
			<div className=" bg-white rounded-xl shadow shadow-orange-900 p-4" dir="rtl">
				<div className="flex justify-between ">
					<div className="flex flex-col w-1/3 divide-y divide-dashed  gap-2">
						<div className="flex justify-between font-semibold">
							<div className="text-orange-900">{result.length}</div>
							<div className="">Players</div>
						</div>
						<div className="flex justify-between font-semibold">
							<div className="text-orange-900">{sportCount}</div>
							<div className="">Sports</div>
						</div>
						<div className="flex justify-between font-semibold">
							<div className="text-orange-900">{total}</div>
							<div className="">Total</div>
						</div>
					</div>
					<div className="text-center font-bold text-xl">Results</div>
				</div>
				{result.map((player) => (
					<div key={player.id} className="flex flex-col ">
						<div className=" py-4">
							<div className="font-extrabold text-xl text-orange-900"> 〽 {player.name}</div>
						</div>
						<div className="flex flex-col gap-4">
							{player.sports.map((sport) => (
								<div
									key={sport.id}
									className="flex bg-gray-100 rounded-xl p-2 justify-between shadow"
								>
									<div className="font-bold">{sport.title}</div>
									<div className="grid grid-cols-[1fr_1fr_50px] gap-2 place-items-center">
										<div
											id={`tooltip-anchor-discount-${player.id}-${sport.id}`}
											className={`flex flex-nowrap items-center justify-center p-2 gap-2 shadow rounded-full ${
												sport.DiscountOptions
													? "text-orange-900 bg-orange-100 shadow-orange-900"
													: "text-gray-900 bg-gray-100"
											}`}
										>
											<div className="text-lg font-extrabold whitespace-nowrap">D</div>
										</div>
										<div
											id={`tooltip-anchor-penalty-${player.id}-${sport.id}`}
											className={`flex flex-nowrap items-center justify-center p-2 gap-2 shadow rounded-full ${
												sport.Penalty
													? "text-orange-900 bg-orange-100 shadow-orange-900"
													: "text-gray-900 bg-gray-100"
											}`}
										>
											<div className="text-lg font-extrabold whitespace-nowrap">P</div>
										</div>
										<div className="text-lg text-orange-900">{sport.price}</div>
									</div>
									<Tooltip
										anchorId={`tooltip-anchor-discount-${player.id}-${sport.id}`}
										content={
											sport.DiscountOptions
												? sport.DiscountOptions[0].title ?? undefined
												: undefined
										}
										events={["hover", "click"]}
									/>
									<Tooltip
										anchorId={`tooltip-anchor-penalty-${player.id}-${sport.id}`}
										content={sport.Penalty ? sport.Penalty.title ?? undefined : undefined}
										events={["hover", "click"]}
									/>
								</div>
							))}
						</div>
					</div>
				))}
			</div>
		</TooltipProvider>
	);
}

export default ResultComponents;
