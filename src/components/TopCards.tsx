import { SportData, aggregatedData } from "@/lib/data-repo-prisma";
import { ConvertToArabicNumbers } from "@/lib/utils";
import type { Data, Sport, Category } from "@prisma/client";
import { useEffect, useState } from "react";
import { TbSwimming } from "react-icons/tb";
import IconImage from "./IconImage";

type TopCardsProps = {
    sportsData: aggregatedData[];
    category: Category | null;
};

const TopCards = ({ sportsData, category }: TopCardsProps) => {
    const [totalPrice, setTotalPrice] = useState(0);
    const [totalRecites, setTotalRecites] = useState(0);

    useEffect(() => {
        let initialPrice = 0;
        let initialRecites = 0;
        sportsData?.forEach((s) => {
            initialPrice += s.totalPrice;
            initialRecites += s.totalNumber;
        });
        setTotalRecites(initialRecites);
        setTotalPrice(initialPrice);
    }, [sportsData]);

    return (
        <div className="grid grid-cols-1 mx-auto gap-y-10 sm:grid-cols-2 gap-x-6 lg:grid-cols-3 xl:grid-cols-4 xl:gap-x-8">
            <div className="w-full gap-4 p-4 overflow-hidden bg-white border rounded-lg aspect-w-1 aspect-h-1 xl:aspect-w-7 xl:aspect-h-8">
                <div className="flex flex-row items-center pb-2 border-b-2 border-gray-400 border-dashed">
                    <div className="inline-block p-1 text-white bg-orange-600 rounded-full">
                        <IconImage
                            src={category ? `/icons/${category?.image}` : null}
                        />
                    </div>
                    <p className="flex-grow text-xl text-orange-300 text-end">
                        الكل
                    </p>
                </div>
                <div className="flex flex-row items-center pb-2 border-b-2 border-gray-400 border-dashed">
                    <p className="text-gray-600">الإجمالي</p>
                    <p className="flex-grow text-xl font-bold text-end">
                        ج {ConvertToArabicNumbers(totalPrice)}
                    </p>
                </div>
                <div className="flex flex-row items-center">
                    <p className="text-gray-600">العدد</p>
                    <p className="flex-grow text-xl font-bold text-end">
                        {ConvertToArabicNumbers(totalRecites)}
                    </p>
                </div>
            </div>
            {sportsData?.map((data) => (
                <div
                    key={data.id}
                    className="w-full gap-4 p-4 overflow-hidden bg-white border rounded-lg aspect-w-1 aspect-h-1 xl:aspect-w-7 xl:aspect-h-8"
                >
                    <div className="flex flex-row items-center pb-2 border-b-2 border-gray-400 border-dashed">
                        <div className="inline-block p-1 text-white bg-orange-600 rounded-full">
                            <IconImage
                                src={
                                    category
                                        ? `/icons/${category?.image}`
                                        : null
                                }
                            />
                        </div>
                        <p className="flex-grow text-xl text-orange-300 text-end">
                            {data.title}
                        </p>
                    </div>
                    <div className="flex flex-row items-center pb-2 border-b-2 border-gray-400 border-dashed">
                        <p className="text-gray-600">الإجمالي</p>
                        <p className="flex-grow text-xl font-bold text-end">
                            ج {ConvertToArabicNumbers(data.totalPrice)}
                        </p>
                    </div>
                    <div className="flex flex-row items-center ">
                        <p className="text-gray-600">العدد</p>
                        <p className="flex-grow text-xl font-bold text-end">
                            {ConvertToArabicNumbers(data.totalNumber)}
                        </p>
                    </div>
                </div>
            ))}
        </div>
    );
};

export default TopCards;
