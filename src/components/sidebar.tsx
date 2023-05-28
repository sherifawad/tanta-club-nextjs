import { RxSketchLogo, RxDashboard } from "react-icons/rx";
import { type Category } from "@prisma/client";
import { useState } from "react";
import IconImage from "./IconImage";

const Sidebar = ({
    children,
    categoriesList,
    onCategoryChange,
}: {
    children: React.ReactNode;
    onCategoryChange: (category: Category | null) => void;
    categoriesList: Category[] | null;
}) => {
    const [selectedId, setSelectedId] = useState(0);

    const onItemSelected = (category: Category | null) => {
        setSelectedId(category?.id ?? 0);
        onCategoryChange(category);
    };

    return (
        <div className="flex">
            <main className="w-full mr-[50px] ">{children}</main>

            <nav className="fixed w-[50px] h-screen p-1 bg-customOrange-100 border-orange-400 border-l-[1px] flex flex-col justify-between">
                <div className="flex flex-col items-center h-full ">
                    <div
                        onClick={() => onItemSelected(null)}
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
                                            ? "bg-orange-600 hover:bg-orange-400 text-white"
                                            : "bg-slate-900 hover:bg-slate-600 text-black"
                                    } inline-block p-3 mx-2 rounded-lg cursor-pointer `}
                                >
                                    <IconImage
                                        src={
                                            cat ? `/icons/${cat?.image}` : null
                                        }
                                    />
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
