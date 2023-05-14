import { Discount, DiscountType } from "types";

export const discountDayTimeValidation = (discount: Discount | undefined) => {
    if (!discount) return false;
    const currentDay = new Date().getDate();
    const currentMonth = new Date().getMonth();
    let valid = false;
    if (discount.startDay) {
        valid = discount.startDay <= currentDay ? true : false;
    }
    if (discount.endDay) {
        valid = discount.endDay >= currentDay ? true : false;
    }
    if (discount.startMonth) {
        valid = discount.startMonth <= currentMonth ? true : false;
    }
    if (discount.endMonth) {
        valid = discount.endMonth >= currentMonth ? true : false;
    }
    return valid;
};

export const discountStep = (discount: Discount, step: number) => {
    let totalDiscount = discount.minimum;

    for (let index = 0; index <= step; index++) {
        if (totalDiscount === discount.Maximum) break;
        totalDiscount += step * discount.step;
    }
    return totalDiscount;
};

export const calByDiscountType = (
    discount: Discount | undefined,
    price: number,
    step: number = 0
) => {
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
