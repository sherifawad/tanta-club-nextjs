import { Discount, DiscountType } from "@prisma/client";
import { Player, PlayerSport } from "./calc";

export function divvyUp<T>(array: T[], predicate: (el: T, index?: number, arr?: Array<T>) => any) {
	// const filterTrue: T[] = [],
	// 	filterFalse: T[] = [];
	// array.forEach(function (value) {
	// 	(predicate(value) ? filterTrue : filterFalse).push(value);
	// });
	const filterTrue = array.filter(predicate);
	const filterFalse = array.filter(function (data) {
		return !predicate(data);
	});
	return [filterTrue, filterFalse];
}

export const discountDayTimeValidation = (discount: Discount | undefined) => {
	const currentDay = new Date().getDate();
	if (
		discount &&
		discount.startDay &&
		discount.startDay >= currentDay &&
		discount.endDay &&
		discount.endDay <= currentDay
	) {
		return true;
	}
	return false;
};

export const discountStep = (discount: Discount, step: number) => {
	let totalDiscount = discount.minimum;

	for (let index = 0; index <= step; index++) {
		if (totalDiscount === discount.Maximum) break;
		totalDiscount += step * discount.step;
	}
	return totalDiscount;
};

export const calPriceDiscount = (discount: Discount | undefined, price: number, step: number = 0) => {
	if (!discount) return price;
	const totalDiscount = discountStep(discount, step);
	if (discount.type === DiscountType.FIXED) {
		price -= totalDiscount;
	} else if (discount.type === DiscountType.PERCENTAGE) {
		price = price * (1 - totalDiscount / 100);
	} else {
		price;
	}
	return price;
};

export const calByDiscountType = (discount: Discount | undefined, price: number, step: number = 0) => {
	let discountValue = 0;
	if (!discount) return discountValue;
	const totalDiscount = discountStep(discount, step);
	if (discount.type === DiscountType.FIXED) {
		discountValue = totalDiscount;
	} else if (discount.type === DiscountType.PERCENTAGE) {
		discountValue = price * (totalDiscount / 100);
	}
	return discountValue;
};

export const sportDiscountSorting = (playerSport: PlayerSport, step: number = 0) => {
	if (!playerSport.DiscountOptions) return playerSport;
	const discounts = playerSport.DiscountOptions.sort((d1, d2) =>
		calByDiscountType(d1, playerSport.price, step) < calByDiscountType(d2, playerSport.price, step)
			? 1
			: calByDiscountType(d1, playerSport.price, step) > calByDiscountType(d2, playerSport.price, step)
			? -1
			: 0
	);
	return { ...playerSport, DiscountOptions: discounts };
};

export const playerSportsDiscountSorting = (sports: PlayerSport[], step: number = 0) => {
	const [sportsWithDiscount, onlySports] = divvyUp(sports, (sport) => sport.DiscountOptions !== undefined);
	const sortingSportsWithDiscount = sportsWithDiscount?.map((sport) => sportDiscountSorting(sport, step));
	return [...sortingSportsWithDiscount, ...onlySports];
};

export const maxDiscountSorting = (sports: PlayerSport[], step: number = 0) => {
	const filteredSports = playerSportsDiscountSorting(sports, step);
	return filteredSports.sort((s1, s2) =>
		calByDiscountType(s1.DiscountOptions![0], s1.price, step) <
		calByDiscountType(s2.DiscountOptions![0], s2.price, step)
			? 1
			: calByDiscountType(s1.DiscountOptions![0], s1.price, step) >
			  calByDiscountType(s2.DiscountOptions![0], s2.price, step)
			? -1
			: 0
	);
};

export const firstSportsWithDiscountBigger = (
	firstSport: PlayerSport,
	secondSport: PlayerSport,
	step: number = 0
) => {
	return calByDiscountType(firstSport.DiscountOptions![0], firstSport.price, step) >
		calByDiscountType(secondSport.DiscountOptions![0], secondSport.price, step)
		? true
		: false;
};

export const numberOfSportsWithDiscount = (player: Player) => {
	return player.sports.filter((sport) => sport.DiscountOptions?.some((discount) => discount.id !== 6));
};

// ترتيب العاب كل لاعب حسب أكبر خصم
export const playersMaxDiscountSorting = (players: Player[]): Player[] => {
	return players.map((player) => ({
		name: player.name,
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
