import { Discount, Penalty, Sport } from "@prisma/client";

export interface PlayerSport extends Sport {
	DiscountOptions?: Discount[];
	Penalty?: Penalty;
	totalPenalty?: number;
	totalDiscount?: number;
}

export interface Player {
	id: number;
	name: string;
	sports: PlayerSport[];
}
