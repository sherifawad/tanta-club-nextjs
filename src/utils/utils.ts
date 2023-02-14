import { Player, PlayerSport } from "@/types";
import { Discount, DiscountType, Penalty, RepetationType } from "@prisma/client";

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
		((discount.startDay && discount.startDay >= currentDay) ||
			(discount.endDay && discount.endDay <= currentDay))
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

export const penaltyTimeValid = (penalty: Penalty) => {
	if (!penalty) return false;
	const currentDay = new Date().getDate();
	const currentMonth = new Date().getMonth();
	if (
		(penalty.startDay && penalty.startDay <= currentDay) ||
		(penalty.endDay && penalty.endDay >= currentDay) ||
		(penalty.startMonth && penalty.startMonth <= currentMonth) ||
		(penalty.endMonth && penalty.endMonth >= currentMonth)
	) {
		return true;
	}
	return false;
};

export const penaltyStep = (penalty: Penalty, step: number) => {
	let totalPenalty = penalty.minimum;

	for (let index = 0; index < step - 1; index++) {
		if (totalPenalty === penalty.Maximum) break;
		totalPenalty += penalty.step;
	}
	return totalPenalty;
};

export const calcPenalty = (penalty: Penalty | undefined) => {
	if (!penalty) return 0;
	let totalPenalty = 0;
	const applyPenalty = penaltyTimeValid(penalty);
	if (applyPenalty) {
		totalPenalty = penalty.minimum;
		switch (penalty.repeated) {
			case RepetationType.DAILY: {
				const currentDay = new Date().getDate();
				const steps = currentDay + 1 - (penalty.startDay ?? currentDay);
				totalPenalty = penaltyStep(penalty, steps);
				break;
			}
			case RepetationType.MONTHLY: {
				const currentMonth = new Date().getMonth();
				const steps = currentMonth + 1 - (penalty.startMonth ?? currentMonth);
				totalPenalty = penaltyStep(penalty, steps);
				break;
			}
			default:
				break;
		}
	}

	return totalPenalty;
};

export const calcSportPenalty = (sport: PlayerSport): PlayerSport => {
	const penalty = calcPenalty(sport.Penalty);
	return {
		...sport,
		price: sport.price + penalty,
		Penalty: penalty === 0 ? undefined : sport.Penalty,
	};
};

export const calcTotalSportsPenalty = (sports: PlayerSport[]): PlayerSport[] => {
	return sports.map((sport) => {
		const penalty = calcPenalty(sport.Penalty);
		return {
			...sport,
			price: sport.price + penalty,
			Penalty: penalty === 0 ? undefined : sport.Penalty,
		};
	});
};

export const playerWithNoDiscountSport = (player: Player): Player => {
	return {
		...player,
		sports: player.sports.map((sport) => calcSportPenalty(sport)),
	};
};

export const calPriceDiscount = (
	discount: Discount | undefined,
	price: number,
	step: number = 0,
	penalty: Penalty | undefined = undefined
) => {
	if (!discount) return price;
	const totalDiscount = discountStep(discount, step);
	if (discount.type === DiscountType.FIXED) {
		price -= totalDiscount;
	} else if (discount.type === DiscountType.PERCENTAGE) {
		price = price * (1 - totalDiscount / 100);
	} else {
		price;
	}
	if (penalty) {
		price += calcPenalty(penalty);
	}
	return price;
};

export const calSportPrice = (sport: PlayerSport, step: number = 0): PlayerSport => {
	if (!sport?.DiscountOptions || sport?.DiscountOptions.length < 1)
		return { ...calcSportPenalty(sport), DiscountOptions: undefined };
	let discount = sport.DiscountOptions[0];
	let price = sport.price;
	let penalty = sport.Penalty;
	const totalDiscount = discountStep(discount, step);
	if (discount.type === DiscountType.FIXED) {
		sport.price -= totalDiscount;
	} else if (discount.type === DiscountType.PERCENTAGE) {
		sport.price = price * (1 - totalDiscount / 100);
	} else {
		sport.DiscountOptions = undefined;
		sport.price = price;
	}
	if (penalty) {
		const calculatedPenalty = calcPenalty(penalty);
		if (calculatedPenalty === 0) {
			sport.Penalty = undefined;
		} else {
			sport.price += calculatedPenalty;
		}
	}
	return sport;
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

export const numberOfPrivateSwimmingSportsWithDiscount = (players: Player[]) => {
	return players.filter((player) =>
		player.sports.filter((sport) => sport.categoryId === 1 && sport.name?.includes("rivat"))
	);
};

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

export const swimmingFirstMonthCheck = (player: Player) => {
	if (!player.sports[0].DiscountOptions) return player;
	const timeDiscount = player.sports[0].DiscountOptions.find((discount) => discount.id === 5);

	if (timeDiscount && discountDayTimeValidation(timeDiscount)) {
		return {
			...player,
			sports: player.sports.map((s) => {
				return {
					...s,
					price: calPriceDiscount(timeDiscount, s.price, 0),
					note: "first month discount",
				};
			}),
		};
	}
	return player;
};

export const splitPrivateSwimming = (players: Player[]) => {
	let [swimmingPrivateList, otherSports] = divvyUp(players, (player) =>
		player.sports.find((sport) => sport.categoryId === 1 && sport.name?.includes("rivat"))
	);
	let filteredSwimmingList: Player[] = [];
	swimmingPrivateList.forEach((player) => {
		const currentPlayerOtherSports: Player = { ...player, sports: [] };
		const currentPlayerSwimmingPrivate: Player = { ...player, sports: [] };
		player.sports.map((sport) => {
			if (sport.name?.includes("rivat")) {
				currentPlayerSwimmingPrivate.sports.push(sport);
			} else {
				currentPlayerOtherSports.sports.push(sport);
			}
		});
		otherSports =
			currentPlayerOtherSports.sports.length > 0
				? [...otherSports, currentPlayerOtherSports]
				: otherSports;
		filteredSwimmingList =
			currentPlayerSwimmingPrivate.sports.length > 0
				? [...filteredSwimmingList, currentPlayerSwimmingPrivate]
				: filteredSwimmingList;
	});

	return [filteredSwimmingList, otherSports];
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
