import { Penalty, RepetitionType } from "types";

export const penaltyTimeValid = (penalty: Penalty) => {
    if (!penalty) return false;
    const currentDay = new Date().getDate();
    const currentMonth = new Date().getMonth();
    let valid = false;
    if (penalty.startDay) {
        valid = penalty.startDay <= currentDay ? true : false;
    }
    if (penalty.endDay) {
        valid = penalty.endDay >= currentDay ? true : false;
    }
    if (penalty.startMonth) {
        valid = penalty.startMonth <= currentMonth ? true : false;
    }
    if (penalty.endMonth) {
        valid = penalty.endMonth >= currentMonth ? true : false;
    }
    return valid;
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
        switch (<RepetitionType>penalty.repeated) {
            case RepetitionType.DAILY: {
                const currentDay = new Date().getDate();
                const steps = currentDay + 1 - (penalty.startDay ?? currentDay);
                totalPenalty = penaltyStep(penalty, steps);
                break;
            }
            case RepetitionType.MONTHLY: {
                const currentMonth = new Date().getMonth();
                const steps =
                    currentMonth + 1 - (penalty.startMonth ?? currentMonth);
                totalPenalty = penaltyStep(penalty, steps);
                break;
            }
            default:
                break;
        }
    }

    return totalPenalty;
};
