import { Penalty, RepetitionType } from "types";

export const penaltyTimeValid = (penalty: Penalty) => {
    if (!penalty) return false;
    const currentDay = new Date().getDate();
    const currentMonth = new Date().getMonth();
    const currentYear = new Date().getFullYear();
    let valid = false;
    if (penalty.repeated === RepetitionType.DAILY) {
        if (penalty.start) {
            valid = penalty.start <= currentDay ? true : false;
        }
        if (penalty.end) {
            valid = penalty.end >= currentDay ? true : false;
        }
    }
    if (penalty.repeated === RepetitionType.MONTHLY) {
        if (penalty.start) {
            valid = penalty.start <= currentMonth ? true : false;
        }
        if (penalty.end) {
            valid = penalty.end >= currentMonth ? true : false;
        }
    } else {
        if (penalty.start) {
            valid = penalty.start <= currentYear ? true : false;
        }
        if (penalty.end) {
            valid = penalty.end >= currentYear ? true : false;
        }
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
    console.log(
        "🚀 ~ file: penalityUtils.ts:50 ~ calcPenalty ~ applyPenalty:",
        applyPenalty
    );
    if (applyPenalty) {
        totalPenalty = penalty.minimum;
        switch (<RepetitionType>penalty.repeated) {
            case RepetitionType.DAILY: {
                const currentDay = new Date().getDate();
                const steps = currentDay + 1 - (penalty.start ?? currentDay);
                totalPenalty = penaltyStep(penalty, steps);
                break;
            }
            case RepetitionType.MONTHLY: {
                const currentMonth = new Date().getMonth();
                const steps =
                    currentMonth + 1 - (penalty.start ?? currentMonth);
                totalPenalty = penaltyStep(penalty, steps);
                break;
            }
            default:
                break;
        }
    }

    return totalPenalty;
};
