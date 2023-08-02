import { Discount, DiscountType, Penalty, Player, PlayerSport } from "types";
import { calcPenalty } from "./penalityUtils";
import {
    calByDiscountType,
    discountDayTimeValidation,
    discountStep,
} from "./discountUtils";
import { divvyUp } from "./arrayUtils";

export const calcSportPenalty = (
    sport: PlayerSport,
    removeDiscount: boolean = true
): PlayerSport => {
    const penalty = calcPenalty(sport.penalty!);

    return {
        ...sport,
        price: sport.price!! + penalty,
        penalty: penalty === 0 ? undefined : sport.penalty,
        totalPenalty: penalty === 0 ? undefined : penalty,
        discounts: removeDiscount ? undefined : sport.discounts,
    };
};

export const calcTotalSportsPenalty = (
    sports: PlayerSport[]
): PlayerSport[] => {
    return sports.map((sport) => {
        const penalty = calcPenalty(sport.penalty!);

        return {
            ...sport,
            price: sport.price!! + penalty,
            penalty: penalty === 0 ? undefined : sport.penalty,
            totalPenalty: penalty === 0 ? undefined : penalty,
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
    if (<DiscountType>discount.type === DiscountType.FIXED) {
        price -= totalDiscount;
    } else if (<DiscountType>discount.type === DiscountType.PERCENTAGE) {
        price = price * (1 - totalDiscount / 100);
    } else {
        price;
    }
    if (penalty) {
        price += calcPenalty(penalty);
    }
    return price;
};

export const calSportPrice = (
    sport: PlayerSport,
    step: number = 0
): PlayerSport => {
    if (!sport?.discounts || sport?.discounts.length < 1)
        return { ...calcSportPenalty(sport), discounts: undefined };
    let discount = sport.discounts[0];
    let price = sport.price!;
    let penalty = sport.penalty;
    const totalDiscount = discountStep(discount, step);
    if (<DiscountType>discount.type === DiscountType.FIXED) {
        sport.price!! -= totalDiscount;
        sport.totalDiscount = totalDiscount;
    } else if (<DiscountType>discount.type === DiscountType.PERCENTAGE) {
        sport.price!! = price! * (1 - totalDiscount / 100);
        sport.totalDiscount = totalDiscount;
    } else {
        sport.discounts = undefined;
        sport.price! != price;
        sport.totalDiscount = undefined;
    }
    if (penalty) {
        const calculatedPenalty = calcPenalty(penalty);
        if (calculatedPenalty === 0) {
            sport.penalty = undefined;
            sport.totalPenalty = undefined;
        } else {
            sport.price!! += calculatedPenalty;
            sport.totalPenalty = calculatedPenalty;
        }
    }
    return sport;
};

export const sportDiscountSorting = (
    playerSport: PlayerSport,
    step: number = 0
) => {
    if (!playerSport.discounts) return playerSport;
    const discounts = playerSport.discounts.sort((d1, d2) =>
        calByDiscountType(d1, playerSport.price!, step) <
        calByDiscountType(d2, playerSport.price!, step)
            ? 1
            : calByDiscountType(d1, playerSport.price!, step) >
              calByDiscountType(d2, playerSport.price!, step)
            ? -1
            : 0
    );
    return { ...playerSport, discounts: discounts };
};

export const playerSportsDiscountSorting = (
    sports: PlayerSport[],
    step: number = 0
) => {
    const [sportsWithDiscount, onlySports] = divvyUp(
        sports,
        (sport) => sport.discounts !== undefined
    );
    const sortingSportsWithDiscount = sportsWithDiscount?.map((sport) =>
        sportDiscountSorting(sport, step)
    );
    return [...sortingSportsWithDiscount, ...onlySports];
};

export const maxDiscountSorting = (sports: PlayerSport[], step: number = 0) => {
    const filteredSports = playerSportsDiscountSorting(sports, step);
    return filteredSports.sort((s1, s2) =>
        calByDiscountType(s1.discounts![0], s1.price!, step) <
        calByDiscountType(s2.discounts![0], s2.price!, step)
            ? 1
            : calByDiscountType(s1.discounts![0], s1.price!, step) >
              calByDiscountType(s2.discounts![0], s2.price!, step)
            ? -1
            : 0
    );
};

export const firstSportsWithDiscountBigger = (
    firstSport: PlayerSport,
    secondSport: PlayerSport,
    step: number = 0
) => {
    return calByDiscountType(
        firstSport.discounts![0],
        firstSport.price!,
        step
    ) > calByDiscountType(secondSport.discounts![0], secondSport.price!, step)
        ? true
        : false;
};

export const numberOfSportsWithDiscount = (player: Player) => {
    return player.sports.filter((sport) =>
        sport.discounts?.some((discount) => discount.id !== 6)
    );
};

export const numberOfPrivateSwimmingSportsWithDiscount = (
    players: Player[]
) => {
    return players.filter((player) =>
        player.sports.filter(
            (sport) => sport.categoryId === 1 && sport.name?.includes("rivat")
        )
    );
};

export const swimmingFirstMonthCheck = (player: Player) => {
    if (!player.sports[0].discounts) return player;
    const timeDiscount = player.sports[0].discounts.find(
        (discount) => discount.id === 5
    );

    if (!timeDiscount)
        return {
            ...player,
            sports: player.sports.map((s) => {
                return calcSportPenalty(s);
            }),
        };
    const validTimeDiscount = discountDayTimeValidation(timeDiscount);
    if (!validTimeDiscount)
        return {
            ...player,
            sports: player.sports.map((s) => {
                return calcSportPenalty(s);
            }),
        };
    return {
        ...player,
        sports: player.sports.map((s) => {
            return calSportPrice(s);
        }),
    };
};

export const splitPrivateSwimming = (players: Player[]) => {
    let [swimmingPrivateList, otherSports] = divvyUp(players, (player) =>
        player.sports.find(
            (sport) => sport.categoryId === 1 && sport.name?.includes("rivat")
        )
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
