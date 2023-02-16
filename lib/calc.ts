import { discountDayTimeValidation } from "helpers/discountUtils";
import {
	calPriceDiscount,
	calSportPrice,
	calcSportPenalty,
	calcTotalSportsPenalty,
	firstSportsWithDiscountBigger,
	maxDiscountSorting,
	numberOfPrivateSwimmingSportsWithDiscount,
	numberOfSportsWithDiscount,
	playerWithNoDiscountSport,
	swimmingFirstMonthCheck,
} from "../helpers/sportsUtils";
import { Player } from "@/types";
import { divvyUp } from "helpers/arrayUtils";
import { playersMaxDiscountSorting, playersWithMaxDiscountSorting } from "helpers/playerUtils";

export const onePlayer = (player: Player) => {
	const sportsWithDiscount = numberOfSportsWithDiscount(player);
	// لو عدد الرياضات واحد
	if (sportsWithDiscount.length === 1) {
		//check first time Discount
		const discount = sportsWithDiscount[0].DiscountOptions![0];
		if (discount.id === 5 && discountDayTimeValidation(discount)) {
			console.log("within time discount");
			player = {
				...player,
				sports: player.sports.map((s) => {
					return calSportPrice(s);
				}),
			};
		}
		return playerWithNoDiscountSport(player);
	} else {
		console.log("more than one Sports");

		const sortingSports = maxDiscountSorting(player.sports);
		if (sportsWithDiscount) {
			// لو عدد الرياضات 2
			if (sportsWithDiscount.length === 2) {
				console.log("two Sports");

				player = {
					...player,
					sports: sortingSports.map((s, i) => {
						if (i === 0) {
							return calSportPrice(s);
						}
						return calcSportPenalty(s);
					}),
				};
			}

			// لو عدد الرياضات اكبر من 2
			// const [filterTrue, filterFalse] = divvyUp(player.sports, (sport) =>
			// 	sport.DiscountOptions?.some((discount) => discount.id === 1 || discount.id === 2)
			// );
			else if (sportsWithDiscount.length > 2) {
				console.log("more than two Sports");
				player = {
					...player,
					sports: sortingSports.map((s, i) => {
						if (i === 0) {
							return calSportPrice(s, 1);
						} else if (i === 1) {
							return calSportPrice(s);
						}
						return calcSportPenalty(s);
					}),
				};
			}
		}
		return player;
	}
};

export const twoPlayers = (players: Player[]): Player[] => {
	// const haveManySports = players.every((p) => p.sports.length > 1);
	const haveManySports = players.every((p) => numberOfSportsWithDiscount(p).length > 1);
	// كل لاعب يملك اكثر من لعبة
	if (haveManySports) {
		players = playersMaxDiscountSorting(players);

		// const isSecondSportBigger = players[0].sports[0] <= players[1].sports[0];
		const isSecondSportBigger = firstSportsWithDiscountBigger(players[1].sports[0], players[0].sports[0]);
		// قيمة اللعبةالأكبر لللاعب الثاني أكبر
		if (isSecondSportBigger) {
			return [
				{
					...players[0],
					sports: players[0].sports.map((s, i) => {
						if (i === 0) {
							return calSportPrice(s);
						}
						return calcSportPenalty(s);
					}),
				},
				{
					...players[1],
					sports: players[1].sports.map((s, i) => {
						if (i === 0) {
							return calSportPrice(s, 1);
						}
						return calcSportPenalty(s);
					}),
				},
			];
		}
		// قيمة اللعبةالأكبر لللاعب الأول أكبر
		//changed
		return [
			{
				...players[1],
				sports: players[1].sports.map((s, i) => {
					if (i === 0) {
						// return { ...s, price: s.price * 0.9 };
						return calSportPrice(s);
					}
					return calcSportPenalty(s);
				}),
			},
			{
				...players[0],
				sports: players[0].sports.map((s, i) => {
					if (i === 0) {
						// return { ...s, price: s.price * 0.8 };
						return calSportPrice(s, 1);
					}
					return calcSportPenalty(s);
				}),
			},
		];
	} else {
		// const playerIndexWithMultiple = players.findIndex((x) => x.sports.length > 1);
		const playerIndexWithMultiple = players.findIndex((x) => numberOfSportsWithDiscount(x).length > 1);
		// كل لاعب يملك رياضة واحدة فقط
		if (playerIndexWithMultiple === -1) {
			// قيمة لعبة اللاعب الاول أكبر
			if (firstSportsWithDiscountBigger(players[0].sports[0], players[1].sports[0])) {
				return [
					{
						...players[0],
						sports: players[0].sports.map((s, i) => {
							if (i === 0) {
								return calSportPrice(s);
							}
							return calcSportPenalty(s);
						}),
					},
					{
						...players[1],
						sports: calcTotalSportsPenalty(players[1].sports),
					},
				];
			}
			return [
				{
					...players[1],
					sports: players[1].sports.map((s, i) => {
						if (i === 0) {
							return calSportPrice(s);
						}
						return calcSportPenalty(s);
					}),
				},
				{
					...players[0],
					sports: calcTotalSportsPenalty(players[0].sports),
				},
			];
		} else {
			// اللاعب الذي يملك أكثر من لعبة
			const higherPlayer = players[playerIndexWithMultiple];
			// اللاعب الذي يملك لعبة واحدة
			const lowerPlayer = players.findIndex((x) => numberOfSportsWithDiscount(x).length === 1);
			const otherPlayer = players[playerIndexWithMultiple === 0 ? 1 : 0];
			if (lowerPlayer === -1) {
				return [
					{
						...higherPlayer,
						sports: higherPlayer.sports.map((s, i) => {
							if (i === 0) {
								return calSportPrice(s);
							}
							return calcSportPenalty(s);
						}),
					},
					{
						...otherPlayer,
						sports: calcTotalSportsPenalty(otherPlayer.sports),
					},
				];
			}
			// const lowerPlayer = players[playerIndexWithMultiple === 0 ? 1 : 0];
			// لو اللاعب  الاكبر يملك أكثر من لعبتين
			// مقارنة سعر اللعبة الاولي لللاعب الاعلى واللعبة الاولي لللاعب الادنى
			const firstPlayerBigger = firstSportsWithDiscountBigger(
				higherPlayer.sports[0],
				otherPlayer.sports[0]
			);
			if (firstPlayerBigger) {
				return [
					{
						...higherPlayer,
						sports: higherPlayer.sports.map((s, i) => {
							if (i === 0) {
								return calSportPrice(s, 1);
							}
							return calcSportPenalty(s);
						}),
					},
					{
						...otherPlayer,
						sports: otherPlayer.sports.map((s, i) => {
							if (i === 0) {
								return calSportPrice(s);
							}
							return calcSportPenalty(s);
						}),
					},
				];
			}
			return [
				{
					...higherPlayer,
					sports: higherPlayer.sports.map((s, i) => {
						if (i === 0) {
							return calSportPrice(s);
						}
						return calcSportPenalty(s);
					}),
				},
				{
					...otherPlayer,
					sports: otherPlayer.sports.map((s, i) => {
						if (i === 0) {
							return calSportPrice(s, 1);
						}
						return calcSportPenalty(s);
					}),
				},
			];
		}
	}
};

export const moreThanTwoPlayers = (players: Player[]): Player[] => {
	const [playersWithDiscountSports, otherPlayers] = divvyUp(players, (player) =>
		player.sports.find((sport) => sport.DiscountOptions?.some((discount) => discount.id !== 6))
	);
	players = playersWithMaxDiscountSorting(playersWithDiscountSports);
	if (players.length > 2) {
		players = players.map((p, i) => {
			switch (i) {
				case 0:
					return {
						...p,
						sports: p.sports.map((s, i) => {
							if (i === 0) {
								return calSportPrice(s, 1);
							}
							return calcSportPenalty(s);
						}),
					};
				case 1:
					return {
						...p,
						sports: p.sports.map((s, i) => {
							if (i === 0) {
								return calSportPrice(s);
							}
							return calcSportPenalty(s);
						}),
					};

				default:
					return {
						...p,
						sports: p.sports.map((s, i) => {
							return calcSportPenalty(s);
						}),
					};
			}
		});
	} else if (players.length === 2) {
		players = twoPlayers(players);
	} else if (players.length === 1) {
		players = [onePlayer(players[0])];
	}

	return [...players, ...otherPlayers];
};

export const swimmingDiscount = (players: Player[]): Player[] => {
	players = numberOfPrivateSwimmingSportsWithDiscount(players);
	let [sportsWithBrothersDiscount, otherSwimming] = divvyUp(players, (player) =>
		player.sports.find((sport) => sport.DiscountOptions?.find((discount) => discount.id === 6))
	);
	if (otherSwimming && otherSwimming.length > 0) {
		otherSwimming = otherSwimming.map((player) => {
			return swimmingFirstMonthCheck(player);
		});
	}
	if (sportsWithBrothersDiscount.length === 1) {
		//check first time Discount
		const discount = players[0].sports[0].DiscountOptions!.find((disconnect) => disconnect.id === 5);

		if (discount && discountDayTimeValidation(discount)) {
			console.log(
				"🚀 ~ file: calc.ts:416 ~ swimmingDiscount ~ discountDayTimeValidation(discount)",
				discountDayTimeValidation(discount)
			);
			return players.map((p, i) => {
				if (i === 0) {
					return {
						...p,
						sports: p.sports.map((s) => {
							return {
								...s,
								price: calPriceDiscount(discount, s.price, 0, s.Penalty),
								note: "first month discount",
							};
						}),
					};
				}
				return {
					...p,
					sports: p.sports.map((s) => {
						return calcSportPenalty(s);
					}),
				};
			});
		}
	} else if (sportsWithBrothersDiscount.length === 2) {
		sportsWithBrothersDiscount = playersWithMaxDiscountSorting(sportsWithBrothersDiscount);
		sportsWithBrothersDiscount = sportsWithBrothersDiscount.map((player, index) => {
			switch (index) {
				case 0:
					return swimmingFirstMonthCheck(player);
				case 1:
					return {
						...player,
						sports: player.sports.map((s) => {
							return {
								...s,
								price: s.DiscountOptions
									? calPriceDiscount(s.DiscountOptions[0], s.price, 0, s.Penalty)
									: s.price,
								note: "first month discount",
							};
						}),
					};

				default:
					return playerWithNoDiscountSport(player);
			}
		});
	} else if (sportsWithBrothersDiscount.length > 2) {
		sportsWithBrothersDiscount = playersWithMaxDiscountSorting(sportsWithBrothersDiscount);
		sportsWithBrothersDiscount = sportsWithBrothersDiscount.map((player, index) => {
			switch (index) {
				case 0:
					return swimmingFirstMonthCheck(player);
				case 1:
					return {
						...player,
						sports: player.sports.map((s) => {
							return {
								...s,
								price: s.DiscountOptions
									? calPriceDiscount(s.DiscountOptions[0], s.price, 0, s.Penalty)
									: s.price,
								note: "first month discount",
							};
						}),
					};
				case 2:
					return {
						...player,
						sports: player.sports.map((s) => {
							return {
								...s,
								price: s.DiscountOptions
									? calPriceDiscount(s.DiscountOptions[0], s.price, 0, s.Penalty)
									: s.price,
								note: "first month discount",
							};
						}),
					};

				default:
					return playerWithNoDiscountSport(player);
			}
		});
	}
	return [...sportsWithBrothersDiscount, ...otherSwimming];
};
