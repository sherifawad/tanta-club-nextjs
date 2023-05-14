import { Menu, Transition } from "@headlessui/react";
import React, { Fragment } from "react";
import { TbDots } from "react-icons/tb";
import { PlayerSport } from "types";

type Props = {
    sport: PlayerSport;
};

function CardMenu({ sport }: Props) {
    return (
        <Menu as="div" className="relative inline-block text-left">
            <div>
                <Menu.Button className="text-black hover:text-orange-900">
                    <TbDots className="text-2xl" />
                    {/* <HiOutlineChevronDown
						className=""
						aria-hidden="true"
					/> */}
                </Menu.Button>
            </div>
            <Transition
                as={Fragment}
                enter="transition ease-out duration-100"
                enterFrom="transform opacity-0 scale-95"
                enterTo="transform opacity-100 scale-100"
                leave="transition ease-in duration-75"
                leaveFrom="transform opacity-100 scale-100"
                leaveTo="transform opacity-0 scale-95"
            >
                <Menu.Items className="absolute right-0 w-56 mt-2 origin-top-right bg-white divide-y divide-gray-100 rounded-md shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
                    {sport.discounts?.map((discount) => (
                        <div key={discount.id} className="px-1 py-1 ">
                            <Menu.Item>
                                {({ active }) => (
                                    <button
                                        className={` group flex w-full items-center rounded-md px-2 py-2 text-sm`}
                                    >
                                        {discount.title}
                                    </button>
                                )}
                            </Menu.Item>
                        </div>
                    ))}
                    <div className="px-1 py-1 ">
                        <Menu.Item>
                            {({ active }) => (
                                <button
                                    className={`text-orange-900 group flex w-full items-center rounded-md px-2 py-2 text-sm`}
                                >
                                    {sport.Penalty?.title}
                                </button>
                            )}
                        </Menu.Item>
                    </div>
                </Menu.Items>
            </Transition>
        </Menu>
    );
}

export default CardMenu;
