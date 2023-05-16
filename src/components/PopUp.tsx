import { ChangeEvent } from "react";
import Popup from "reactjs-popup";
import CustomButton from "./ui/CustomButton";
import { ButtonsType } from "@/data/constants";

type Props = {
    savePlayer: () => void;
    onClose: () => void;
    onChange: (e: ChangeEvent<HTMLInputElement>) => void;
    openNameModel: boolean;
    playerName: string;
};

function PopUp({
    savePlayer,
    openNameModel,
    onClose,
    onChange,
    playerName,
}: Props) {
    return (
        <Popup
            modal
            nested
            open={openNameModel}
            closeOnDocumentClick
            onClose={onClose}
            contentStyle={{ width: "18rem", borderRadius: "0.75rem" }}
        >
            <div className="modal">
                <div className="flex flex-col justify-center gap-4">
                    <div
                        className="grid grid-cols-3 gap-2 border border-black rounded-xl"
                        dir="rtl"
                    >
                        <div className="p-2 text-sm text-customGray-900 bg-customGray-100 rounded-r-xl ">
                            اسم اللاعب
                        </div>
                        <input
                            dir="rtl"
                            className="text-xl placeholder-customGray-900 outline-none rounded-xl"
                            onChange={onChange}
                            placeholder="اي اسم"
                            value={playerName}
                            onKeyDown={(event) => {
                                if (event.key === "Enter") {
                                    // 👇 Get input value
                                    savePlayer();
                                }
                            }}
                        />
                    </div>
                    <CustomButton
                        buttontype={ButtonsType.PRIMARY}
                        onClick={savePlayer}
                    >
                        احفظ
                    </CustomButton>
                </div>
            </div>
        </Popup>
    );
}

export default PopUp;
