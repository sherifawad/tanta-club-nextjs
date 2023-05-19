/**
 * Model Queue
 *
 */
export type Queue = {
    id: number;
    code: string;
    status: QueueStatus;
};

/**
 * Model Sport
 *
 */
export type Sport = {
    id: number;
    name: string | null;
    title: string | null;
    code: string | null;
    note: string | null;
    price: number;
    hidden: boolean;
    createdAt: string;
    updatedAt: string;
    categoryId: number;
    penaltyId?: number | null;
    penalty?: Penalty | null;
    discounts?: (Partial<Omit<Discount, "id">> & { id: number }[]) | null;
};

/**
 * Model Category
 *
 */
export type Category = {
    id: number;
    name: string;
    title: string | null;
    note: string | null;
    hidden: boolean;
    createdAt: string;
    updatedAt: string;
};

/**
 * Model Discount
 *
 */
export type Discount = {
    id: number;
    name: string;
    title: string | null;
    note: string | null;
    type: DiscountType;
    step: number;
    minimum: number;
    Maximum: number;
    startDay: number | null;
    startMonth: number | null;
    endDay: number | null;
    endMonth: number | null;
    createdAt: string;
    updatedAt: string;
};

/**
 * Model Penalty
 *
 */
export type Penalty = {
    id: number;
    name: string;
    title: string | null;
    note: string | null;
    type: DiscountType;
    repeated: RepetitionType | null;
    start: number | null;
    end: number | null;
    step: number;
    minimum: number;
    Maximum: number;
    createdAt: string;
    updatedAt: string;
};
/**
 * Model User
 *
 */
export type User = {
    id: number;
    name: string;
    password: string;
    enabled: boolean;
    role: Role;
    createdAt: string;
    updatedAt: string;
};

/**
 * Enums
 */

// Based on
// https://github.com/microsoft/TypeScript/issues/3192#issuecomment-261720275

export enum Role {
    OWNER = "OWNER",
    ADMIN = "ADMIN",
    USER = "USER",
    CLIENT = "CLIENT",
}

export enum DiscountType {
    FIXED = "FIXED",
    PERCENTAGE = "PERCENTAGE",
}

export enum RepetitionType {
    DAILY = "DAILY",
    MONTHLY = "MONTHLY",
    YEARLY = "YEARLY",
}

export enum QueueStatus {
    PENDING = "PENDING",
    COMPLETED = "COMPLETED",
    MISSED = "MISSED",
    POSTPONE = "POSTPONE",
}

export interface PlayerSport extends Omit<Sport, "discounts"> {
    discounts?: Discount[] | null;
    penalty?: Penalty | null;
    totalPenalty?: number;
    totalDiscount?: number;
}

export interface Player {
    id: number;
    name: string;
    sports: PlayerSport[];
}

export type IReactSelectOption = { value: any; label: string };
