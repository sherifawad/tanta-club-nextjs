import Link from "next/link";
import { RxSketchLogo, RxDashboard, RxPerson } from "react-icons/rx";
import { HiOutlineShoppingBag } from "react-icons/hi";
import { FiSettings } from "react-icons/fi";
import { type Category } from "@prisma/client";
import { Dispatch, SetStateAction, useState } from "react";

const Sidebar = ({
    children,
    categoriesList,
    setCategory,
}: {
    children: React.ReactNode;
    setCategory: Dispatch<SetStateAction<Category | null>>;
    categoriesList: Category[] | null;
}) => {
    const [selectedId, setSelectedId] = useState(0);

    const onMainItemSelected = () => {
        setSelectedId(0);
        setCategory(null);
    };

    const onItemSelected = (category: Category) => {
        setSelectedId(category.id);
        setCategory(category);
    };

    return (
        <div className="flex">
            <main className="w-full mr-15 ">{children}</main>

            <nav className="fixed w-15 h-screen p-1 bg-customOrange-100 border-orange-400 border-l-[1px] flex flex-col justify-between">
                <div className="flex flex-col items-center h-full ">
                    <div
                        onClick={onMainItemSelected}
                        className={`${
                            selectedId === 0
                                ? "bg-orange-400 hover:bg-orange-600 text-white"
                                : "bg-gray-100 hover:bg-gray-200 text-black"
                        } inline-block p-3 rounded-lg cursor-pointer `}
                    >
                        <RxSketchLogo size={15} />
                    </div>
                    <span className="border-b-[1px] border-orange-400 w-full p-2"></span>
                    <ul className="flex flex-col items-center gap-2 my-2 overflow-scroll no-scrollbar">
                        {categoriesList?.map((cat) => (
                            <li
                                key={cat.id}
                                onClick={() => onItemSelected(cat)}
                            >
                                <div
                                    className={`${
                                        selectedId === cat.id
                                            ? "bg-orange-400 hover:bg-orange-600 text-white"
                                            : "bg-gray-100 hover:bg-gray-200 text-black"
                                    } inline-block p-3 mx-2 rounded-lg cursor-pointer `}
                                >
                                    <RxDashboard size={15} />
                                </div>
                            </li>
                        ))}
                    </ul>
                </div>
            </nav>
        </div>
    );
};

export default Sidebar;
