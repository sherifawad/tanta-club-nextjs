import { Player } from "@/types";
import { maxDiscountSorting } from "./sportsUtils";
import { calByDiscountType } from "./discountUtils";

// ترتيب العاب كل لاعب حسب أكبر خصم
export const playersMaxDiscountSorting = (players: Player[]): Player[] => {
	return players.map((player) => ({
		...player,
		sports: maxDiscountSorting(player.sports),
	}));
};
// ترتيب اللاعبين حسب أول كل لعبة بعد ترتيب الالبعاي خسب الخصم
export const playersWithMaxDiscountSorting = (players: Player[], step: number = 0): Player[] => {
	players = playersMaxDiscountSorting(players);
	return players.sort((p1, p2) =>
		calByDiscountType(p1.sports[0].DiscountOptions![0], p1.sports[0].price, step) <
		calByDiscountType(p2.sports[0].DiscountOptions![0], p2.sports[0].price, step)
			? 1
			: calByDiscountType(p1.sports[0].DiscountOptions![0], p1.sports[0].price, step) >
			  calByDiscountType(p2.sports[0].DiscountOptions![0], p2.sports[0].price, step)
			? -1
			: 0
	);
};

// اللاعبين اللي عندهم خاص سباحة خصم أول الشهر
export const getPlayersWithPrivateSwimmingTimeDiscount = (players: Player[]): Player[] => {
	return players.filter((player) =>
		player.sports.filter((sport) => sport.DiscountOptions?.find((discount) => discount.id === 5))
	);
};

export const mergePlayers = (players1: Player[], players2: Player[]): Player[] => {
	return players1
		.map((x) => {
			const y = players2.find((item) => x.name === item.name);
			if (y) {
				return { ...x, sports: [...x.sports, ...y.sports] };
			} else return x;
		})
		.concat(players2.filter((item) => players1.every((x) => x.name !== item.name)));
};
