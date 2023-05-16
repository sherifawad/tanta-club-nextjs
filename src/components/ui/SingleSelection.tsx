import { ChangeEvent, ReactNode } from "react";

type props = {
    id?: string;
    optionsList: ReactNode[];
    value?: any;
    onChange?: (e: ChangeEvent<HTMLSelectElement>, index?: number) => void;
};

const SingleSelection = ({ id, value, onChange, optionsList }: props) => {
    return (
        <select
            value={value}
            id={id}
            onChange={onChange}
            className="bg-gray-50 border border-gray-300 text-customGray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white"
        >
            {optionsList}
        </select>
    );
};

export default SingleSelection;
