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

function PopUp({ savePlayer, openNameModel, onClose, onChange, playerName }: Props) {
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
					<div className="grid grid-cols-3 gap-2 rounded-xl border border-black" dir="rtl">
						<div className="bg-gray-100 text-gray-900 rounded-r-xl p-2 text-sm ">اسم اللاعب</div>
						<input
							dir="rtl"
							className="outline-none rounded-xl text-xl placeholder-gray-900"
							onChange={onChange}
							placeholder="اي اسم"
							value={playerName}
						/>
					</div>
					<CustomButton buttontype={ButtonsType.PRIMARY} onClick={savePlayer}>
						احفظ
					</CustomButton>
				</div>
			</div>
		</Popup>
	);
}

export default PopUp;
