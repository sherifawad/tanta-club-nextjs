import { Player } from "@/types";
import { useEffect, useRef, useState } from "react";
import "react-tooltip/dist/react-tooltip.css";
import { Tooltip, TooltipProvider, TooltipWrapper } from "react-tooltip";
import { DiscountType } from "@prisma/client";

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
		<div className=" bg-white rounded-xl shadow shadow-orange-900 p-4" dir="rtl">
			<div className="flex flex-row-reverse justify-between ">
				<div className="flex flex-col w-1/3 divide-y divide-dashed  gap-2">
					<div className="flex flex-row-reverse justify-between font-semibold   gap-4">
						<div className="text-orange-900">{result.length}</div>
						<div className="">اللاعبين</div>
					</div>
					<div className="flex flex-row-reverse justify-between font-semibold  gap-4">
						<div className="text-orange-900">{sportCount}</div>
						<div className="">الرياضات</div>
					</div>
					<div className="flex flex-row-reverse justify-between font-semibold   gap-4">
						<div className="text-orange-900">{total}</div>
						<div className="">الإجمالي</div>
					</div>
				</div>
				<div className="text-center font-bold text-xl">النتائج</div>
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
								className="flex bg-gray-100 rounded-xl p-2 gap-2 justify-between shadow items-center"
							>
								<div className="font-extrabold">{sport.title}</div>
								<div className="grid grid-cols-[1fr_1fr_50px] gap-2 place-items-center">
									<div
										id={`tooltip-anchor-discount-${player.id}-${sport.id}`}
										className={`py-4  shadow rounded-full ${
											sport.totalDiscount
												? "text-orange-900 bg-orange-100 shadow-orange-900"
												: "text-gray-900 bg-gray-100"
										}`}
									>
										<div className="text-sm font-extrabold whitespace-nowrap -rotate-90 -ml-1">
											خصم
										</div>
									</div>
									<div
										id={`tooltip-anchor-penalty-${player.id}-${sport.id}`}
										className={` py-4 shadow rounded-full ${
											sport.totalPenalty
												? "text-orange-900 bg-orange-100 shadow-orange-900"
												: "text-gray-900 bg-gray-100"
										}`}
									>
										<div className="text-sm font-extrabold whitespace-nowrap -rotate-90 -ml-1">
											غرامه
										</div>
									</div>
									<div className="text-lg  font-bold text-orange-900">{sport.price}</div>
								</div>
								<Tooltip
									anchorId={`tooltip-anchor-discount-${player.id}-${sport.id}`}
									content={
										sport.DiscountOptions
											? `${
													sport.DiscountOptions[0].type === DiscountType.PERCENTAGE
														? "%"
														: "ج"
											  } ${sport.totalDiscount}` ?? undefined
											: undefined
									}
									events={["hover", "click"]}
								/>
								<Tooltip
									float
									anchorId={`tooltip-anchor-penalty-${player.id}-${sport.id}`}
									content={
										sport.totalPenalty
											? `ج ${sport.totalPenalty}` ?? undefined
											: undefined
									}
									clickable
								/>
							</div>
						))}
					</div>
				</div>
			))}
		</div>
	);
}

export default ResultComponents;
