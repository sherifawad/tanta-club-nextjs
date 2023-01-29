import { Discount, Penalty, Sport } from "@prisma/client";
import {
	calPriceDiscount,
	discountDayTimeValidation,
	divvyUp,
	maxDiscountSorting,
	playerSportsDiscountSorting,
	sportDiscountSorting,
} from "./utils";

export interface PlayerSport extends Sport {
	DiscountOptions?: Discount[];
	Penalty: Penalty;
}

export interface Player {
	name: string;
	sports: PlayerSport[];
}

export const calculationResult = (data: Player[]) => {
	const currentDay = new Date().getDate();
	const result = data.reduce((acc: Player[], current: Player) => {
		// لاعب واحد
		if (data.length === 1) {
			return [onePlayer(data[0])];
		}
		// لو عدد اللاعبين اقل من 3
		if (data.length < 3) {
			const haveManySports = data.every((p) => p.sports.length > 1);
			// كل لاعب يملك اكثر من لعبة
			if (haveManySports) {
				const isSecondSportBigger = data[0].sports[0] <= data[1].sports[0];
				// قيمة اللعبةالأكبر لللاعب الثاني أكبر
				if (isSecondSportBigger) {
					return [
						{
							name: data[0].name,
							sports: data[0].sports.map((s, i) => {
								if (i === 0) {
									return { ...s, price: s.price * 0.9 };
								}
								return s;
							}),
						},
						{
							name: data[1].name,
							sports: data[1].sports.map((s, i) => {
								if (i === 0) {
									return { ...s, price: s.price * 0.8 };
								}
								return s;
							}),
						},
					];
				}
				// قيمة اللعبةالأكبر لللاعب الأول أكبر
				return [
					{
						name: data[1].name,
						sports: data[1].sports.map((s, i) => {
							if (i === 0) {
								return { ...s, price: s.price * 0.9 };
							}
							return s;
						}),
					},
					{
						name: data[0].name,
						sports: data[0].sports.map((s, i) => {
							if (i === 0) {
								return { ...s, price: s.price * 0.8 };
							}
							return s;
						}),
					},
				];
			} else {
				const playerIndexWithMultiple = data.findIndex((x) => x.sports.length > 1);
				// كل لاعب يملك رياضة واحدة فقط
				if (playerIndexWithMultiple === -1) {
					// قيمة لعبة اللاعب الاول أكبر
					if (data[0].sports[0].price > data[1].sports[0].price) {
						return [
							{
								name: data[0].name,
								sports: data[0].sports.map((s) => {
									return { ...s, price: s.price * 0.9 };
								}),
							},
							currentDay <= 7
								? {
										name: data[1].name,
										sports: data[1].sports.map((s) => {
											return { ...s, price: s.price * 0.9 };
										}),
								  }
								: {
										name: data[1].name,
										sports: data[1].sports,
								  },
						];
					}
					return [
						{
							name: data[1].name,
							sports: data[1].sports.map((s) => {
								return { ...s, price: s.price * 0.9 };
							}),
						},
						currentDay <= 7
							? {
									name: data[0].name,
									sports: data[0].sports.map((s) => {
										return { ...s, price: s.price * 0.9 };
									}),
							  }
							: {
									name: data[0].name,
									sports: data[0].sports,
							  },
					];
				} else {
					// اللاعب الذي يملك أكثر من لعبة
					const higherPlayer = data[playerIndexWithMultiple];
					// اللاعب الذي يملك لعبة واحدة
					const lowerPlayer = data[playerIndexWithMultiple === 0 ? 1 : 0];
					// لو اللاعب  الاكبر يملك أكثر من لعبتين
					if (higherPlayer.sports.length > 2) {
						// سعر اكبر ثاني لعبة أكبر من سعر لعبة اللاعب الثاني
						if (higherPlayer.sports[1].price > lowerPlayer.sports[0].price) {
							return [
								{
									name: higherPlayer.name,
									sports: higherPlayer.sports.map((s, i) => {
										if (i === 0) {
											return { ...s, price: s.price * 0.8 };
										} else if (i === 1) {
											return { ...s, price: s.price * 0.9 };
										}
										return s;
									}),
								},
								lowerPlayer,
							];
						}
					}
					return [
						{
							name: higherPlayer.name,
							sports: data[1].sports.map((s, i) => {
								if (i === 0) {
									return { ...s, price: s.price * 0.9 };
								}
								return s;
							}),
						},
						{
							name: lowerPlayer.name,
							sports: lowerPlayer.sports.map((s, i) => {
								return { ...s, price: s.price * 0.8 };
							}),
						},
					];
				}
			}
		}
		// عدد اللاعبين اكبر من 2
		else {
			// اللاعبين الذين يمتلكون أكثر من لعبة
			const higherPlayers = data.filter((l) => l.sports.length > 2);
			if (higherPlayers && higherPlayers.length > 0) {
				// ترتيب اللاعبين حسب سعر اكبر ثاني لعبة
				const sortedHigherPlayers = higherPlayers.sort((p1, p2) =>
					p1.sports[1] < p2.sports[1] ? 1 : p1.sports[1] > p2.sports[1] ? -1 : 0
				);
				console.log(
					"🚀 ~ file: index.tsx ~ line 217 ~ result ~ sortedHigherPlayers",
					sortedHigherPlayers
				);
				// اللاعب الذي يملك اكبر  سعر لعبة
				const heighestPlayer = data.find((p) => p.name === sortedHigherPlayers[0].name) as Player;
				// أول لاعب في القائمة يمتلك أكبر ثاني لعبة
				if (heighestPlayer?.sports[1]?.price > sortedHigherPlayers[1]?.sports[1]?.price) {
					return data.map((p) => {
						if (p.name === heighestPlayer.name) {
							return {
								name: heighestPlayer.name,
								sports: heighestPlayer.sports.map((s, i) => {
									if (i === 0) {
										return { ...s, price: s.price * 0.8 };
									}
									if (i === 1) {
										return { ...s, price: s.price * 0.9 };
									}
									return s;
								}),
							};
						}
						return p;
					});
				}
			}
			// ترتيب اللاعبين حسب سعر أكبر لعبة
			const sortedHigherPlayers = data.sort((p1, p2) =>
				p1.sports[1] < p2.sports[0] ? 1 : p1.sports[0] > p2.sports[0] ? -1 : 0
			);
			// ثاني لاعب في الترتيب عند أكثر من لعبة
			if (sortedHigherPlayers[1].sports.length > 1) {
				return sortedHigherPlayers.map((p, i) => {
					switch (i) {
						case 0:
							return {
								name: p.name,
								sports: p.sports.map((s, i) => {
									if (i === 0) {
										return { ...s, price: s.price * 0.8 };
									}
									return s;
								}),
							};
						case 1:
							return {
								name: p.name,
								sports: p.sports.map((s, i) => {
									if (i === 0) {
										return { ...s, price: s.price * 0.9 };
									}
									return s;
								}),
							};
						default:
							return p;
					}
				});
			}
			return sortedHigherPlayers.map((p, i) => {
				switch (i) {
					case 0:
						return {
							name: p.name,
							sports: p.sports.map((s, i) => {
								if (i === 0) {
									return { ...s, price: s.price * 0.8 };
								}
								return s;
							}),
						};
					case 1:
						return {
							name: p.name,
							sports: p.sports.map((s, i) => {
								if (i === 0) {
									return { ...s, price: s.price * 0.9 };
								}
								return s;
							}),
						};

					default:
						return p;
				}
			});
		}
		return acc;
	}, []);
};

export const onePlayer = (player: Player) => {
	const sportsWithDiscount = player.sports.filter((sport) =>
		sport.DiscountOptions?.some((discount) => discount.id !== 6)
	); // لو عدد الرياضات واحد
	if (sportsWithDiscount.length === 1) {
		//check first time Discount
		const discount = sportsWithDiscount[0].DiscountOptions![0];
		if (discount.id === 5 && discountDayTimeValidation(discount)) {
			console.log("within time discount");
			player = {
				name: player.name,
				sports: player.sports.map((s) => {
					return {
						...s,
						price: calPriceDiscount(discount, s.price, 0),
						note: "first month discount",
					};
				}),
			};
		}
		return player;
	} else {
		console.log("more than one Sports");

		const sortingSports = maxDiscountSorting(player.sports);
		if (sportsWithDiscount) {
			// لو عدد الرياضات 2
			if (sportsWithDiscount.length === 2) {
				console.log("two Sports");

				player = {
					name: player.name,
					sports: sortingSports.map((s, i) => {
						if (i === 0) {
							return {
								...s,
								price: calPriceDiscount(sortingSports[0].DiscountOptions![0], s.price, 0),
							};
						}
						return s;
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
					name: player.name,
					sports: sortingSports.map((s, i) => {
						if (i === 0) {
							return {
								...s,
								price: calPriceDiscount(s.DiscountOptions![0], s.price, 1),
							};
						} else if (i === 1) {
							return {
								...s,
								price: calPriceDiscount(s.DiscountOptions![0], s.price, 0),
							};
						}
						return s;
					}),
				};
			}
		}
		return player;
	}
};

export const lessThanThreePlayers = (players: Player[]) => {
	const currentDay = new Date().getDate();
	const haveManySports = players.every((p) => p.sports.length > 1);
	// كل لاعب يملك اكثر من لعبة
	if (haveManySports) {
		const isSecondSportBigger = players[0].sports[0] <= players[1].sports[0];
		// قيمة اللعبةالأكبر لللاعب الثاني أكبر
		if (isSecondSportBigger) {
			return [
				{
					name: players[0].name,
					sports: players[0].sports.map((s, i) => {
						if (i === 0) {
							return { ...s, price: s.price * 0.9 };
						}
						return s;
					}),
				},
				{
					name: players[1].name,
					sports: players[1].sports.map((s, i) => {
						if (i === 0) {
							return { ...s, price: s.price * 0.8 };
						}
						return s;
					}),
				},
			];
		}
		// قيمة اللعبةالأكبر لللاعب الأول أكبر
		return [
			{
				name: players[1].name,
				sports: players[1].sports.map((s, i) => {
					if (i === 0) {
						return { ...s, price: s.price * 0.9 };
					}
					return s;
				}),
			},
			{
				name: players[0].name,
				sports: players[0].sports.map((s, i) => {
					if (i === 0) {
						return { ...s, price: s.price * 0.8 };
					}
					return s;
				}),
			},
		];
	} else {
		const playerIndexWithMultiple = players.findIndex((x) => x.sports.length > 1);
		// كل لاعب يملك رياضة واحدة فقط
		if (playerIndexWithMultiple === -1) {
			// قيمة لعبة اللاعب الاول أكبر
			if (players[0].sports[0].price > players[1].sports[0].price) {
				return [
					{
						name: players[0].name,
						sports: players[0].sports.map((s) => {
							return { ...s, price: s.price * 0.9 };
						}),
					},
					currentDay <= 7
						? {
								name: players[1].name,
								sports: players[1].sports.map((s) => {
									return { ...s, price: s.price * 0.9 };
								}),
						  }
						: {
								name: players[1].name,
								sports: players[1].sports,
						  },
				];
			}
			return [
				{
					name: players[1].name,
					sports: players[1].sports.map((s) => {
						return { ...s, price: s.price * 0.9 };
					}),
				},
				currentDay <= 7
					? {
							name: players[0].name,
							sports: players[0].sports.map((s) => {
								return { ...s, price: s.price * 0.9 };
							}),
					  }
					: {
							name: players[0].name,
							sports: players[0].sports,
					  },
			];
		} else {
			// اللاعب الذي يملك أكثر من لعبة
			const higherPlayer = players[playerIndexWithMultiple];
			// اللاعب الذي يملك لعبة واحدة
			const lowerPlayer = players[playerIndexWithMultiple === 0 ? 1 : 0];
			// لو اللاعب  الاكبر يملك أكثر من لعبتين
			if (higherPlayer.sports.length > 2) {
				// سعر اكبر ثاني لعبة أكبر من سعر لعبة اللاعب الثاني
				if (higherPlayer.sports[1].price > lowerPlayer.sports[0].price) {
					return [
						{
							name: higherPlayer.name,
							sports: higherPlayer.sports.map((s, i) => {
								if (i === 0) {
									return { ...s, price: s.price * 0.8 };
								} else if (i === 1) {
									return { ...s, price: s.price * 0.9 };
								}
								return s;
							}),
						},
						lowerPlayer,
					];
				}
			}
			return [
				{
					name: higherPlayer.name,
					sports: players[1].sports.map((s, i) => {
						if (i === 0) {
							return { ...s, price: s.price * 0.9 };
						}
						return s;
					}),
				},
				{
					name: lowerPlayer.name,
					sports: lowerPlayer.sports.map((s, i) => {
						return { ...s, price: s.price * 0.8 };
					}),
				},
			];
		}
	}
};
