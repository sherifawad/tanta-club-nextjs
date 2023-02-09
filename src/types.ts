import { Discount, Penalty, Sport } from "@prisma/client";

export interface PlayerSport extends Sport {
	DiscountOptions?: Discount[];
	Penalty: Penalty;
}

export interface Player {
	id: number;
	name: string;
	sports: PlayerSport[];
}
