import { PrismaClient } from "@prisma/client";

const client = new PrismaClient();
async function seed() {
	await client.sport.deleteMany();
	await client.category.deleteMany();
	await client.discount.deleteMany();
	await client.penalty.deleteMany();

	const penalities = await client.penalty.createMany({
		data: [
			{
				id: 1,
				type: "FIXED",
				minimum: 5,
				Maximum: 25,
				step: 5,
				name: "swimmingDelayPenalty",
				repeated: "MONTHLY",
				startDay: 11,
			},
		],
	});

	const discounts = await client.discount.createMany({
		data: [
			{
				id: 1,
				type: "PERCENTAGE",
				minimum: 10,
				Maximum: 20,
				step: 10,
				name: "brothersPercentage",
			},
			{
				id: 2,
				type: "PERCENTAGE",
				minimum: 10,
				Maximum: 20,
				step: 10,
				name: "multiSportsPercentage",
			},
			{
				id: 3,
				type: "FIXED",
				minimum: 25,
				Maximum: 50,
				step: 25,
				name: "brothersFixed",
			},
			{
				id: 4,
				type: "FIXED",
				minimum: 25,
				Maximum: 50,
				step: 25,
				name: "multiSportsFixed",
			},
			{
				id: 5,
				type: "PERCENTAGE",
				minimum: 10,
				Maximum: 10,
				step: 0,
				name: "firstDays",
				startDay: 1,
				endDay: 5,
			},
			{
				id: 6,
				type: "PERCENTAGE",
				minimum: 20,
				Maximum: 20,
				step: 0,
				name: "brothersSwimmingPercentage",
			},
		],
	});

	const categories = await client.category.createMany({
		data: [
			{
				id: 1,
				name: "swimming",
			},
			{
				id: 2,
				name: "footBall",
			},
			{
				id: 3,
				name: "basket",
			},
			{
				id: 4,
				name: "handBall",
			},
			{
				id: 5,
				name: "volleyBall",
			},
			{
				id: 6,
				name: "taekwondo",
			},
			{
				id: 7,
				name: "judo",
			},
			{
				id: 8,
				name: "pingPong",
			},
			{
				id: 9,
				name: "art",
			},
			{
				id: 10,
				name: "snooker",
			},
			{
				id: 11,
				name: "modernPentathlon",
			},
			{
				id: 12,
				name: "boxing",
			},
			{
				id: 13,
				name: "tennis",
			},
			{
				id: 14,
				name: "squash",
			},
			{
				id: 15,
				name: "gymnastics",
			},
			{
				id: 16,
				name: "gymnasium",
			},
			{
				id: 17,
				name: "athletics",
			},
			{
				id: 18,
				name: "fitness",
			},
			{
				id: 19,
				name: "karate",
			},
			{
				id: 20,
				name: "fencing",
			},
		],
	});

	await client.sport.create({
		data: {
			name: "footBallAcademy",
			price: 200,
			categoryId: 2,
			DiscountOptions: {
				connect: [
					{
						id: 1,
					},
					{
						id: 2,
					},
				],
			},
		},
	});

	await client.sport.create({
		data: {
			name: "footBallSpecial",
			price: 300,
			categoryId: 2,
			DiscountOptions: {
				connect: [
					{
						id: 1,
					},
					{
						id: 2,
					},
				],
			},
		},
	});

	await client.sport.create({
		data: {
			name: "basketBall",
			price: 300,
			categoryId: 3,
			DiscountOptions: {
				connect: [
					{
						id: 1,
					},
					{
						id: 2,
					},
					{
						id: 5,
					},
				],
			},
		},
	});

	await client.sport.create({
		data: {
			name: "handBall",
			price: 300,
			categoryId: 4,
			DiscountOptions: {
				connect: [
					{
						id: 1,
					},
					{
						id: 2,
					},
					{
						id: 5,
					},
				],
			},
		},
	});

	await client.sport.create({
		data: {
			name: "volleyBall",
			price: 300,
			categoryId: 5,
			DiscountOptions: {
				connect: [
					{
						id: 1,
					},
					{
						id: 2,
					},
					{
						id: 5,
					},
				],
			},
		},
	});

	await client.sport.create({
		data: {
			name: "taekwondo",
			price: 300,
			categoryId: 6,
			DiscountOptions: {
				connect: [
					{
						id: 1,
					},
					{
						id: 2,
					},
				],
			},
		},
	});

	await client.sport.create({
		data: {
			name: "taekwondoPrivate",
			price: 200,
			categoryId: 6,
		},
	});

	await client.sport.create({
		data: {
			name: "judo",
			price: 300,
			categoryId: 7,
			DiscountOptions: {
				connect: [
					{
						id: 1,
					},
					{
						id: 2,
					},
				],
			},
		},
	});

	await client.sport.create({
		data: {
			name: "pingPongMonthly",
			price: 350,
			categoryId: 8,
			DiscountOptions: {
				connect: [
					{
						id: 1,
					},
					{
						id: 2,
					},
				],
			},
		},
	});

	await client.sport.create({
		data: {
			name: "pingPongRent",
			price: 25,
			categoryId: 8,
		},
	});

	await client.sport.create({
		data: {
			name: "art",
			price: 50,
			categoryId: 9,
		},
	});

	await client.sport.create({
		data: {
			name: "snooker",
			price: 350,
			categoryId: 10,
			DiscountOptions: {
				connect: [
					{
						id: 1,
					},
					{
						id: 2,
					},
				],
			},
		},
	});

	await client.sport.create({
		data: {
			name: "snookerRent",
			price: 40,
			categoryId: 10,
		},
	});

	await client.sport.create({
		data: {
			name: "modernPentathlonLaser",
			price: 350,
			categoryId: 11,
			DiscountOptions: {
				connect: [
					{
						id: 1,
					},
					{
						id: 2,
					},
				],
			},
		},
	});

	await client.sport.create({
		data: {
			name: "modernPentathlonDouble",
			price: 400,
			categoryId: 11,
			DiscountOptions: {
				connect: [
					{
						id: 1,
					},
					{
						id: 2,
					},
				],
			},
		},
	});

	await client.sport.create({
		data: {
			name: "modernPentathlonTriple",
			price: 450,
			categoryId: 11,
			DiscountOptions: {
				connect: [
					{
						id: 1,
					},
					{
						id: 2,
					},
				],
			},
		},
	});

	await client.sport.create({
		data: {
			name: "modernPentathlonSchools",
			price: 350,
			categoryId: 11,
			DiscountOptions: {
				connect: [
					{
						id: 1,
					},
					{
						id: 2,
					},
				],
			},
		},
	});

	await client.sport.create({
		data: {
			name: "modernPentathlonMaster",
			price: 450,
			categoryId: 11,
			DiscountOptions: {
				connect: [
					{
						id: 1,
					},
					{
						id: 2,
					},
				],
			},
		},
	});

	await client.sport.create({
		data: {
			name: "boxingBeginners",
			price: 250,
			categoryId: 12,
			DiscountOptions: {
				connect: [
					{
						id: 1,
					},
					{
						id: 2,
					},
				],
			},
		},
	});

	await client.sport.create({
		data: {
			name: "boxingAmateur",
			price: 250,
			categoryId: 12,
			DiscountOptions: {
				connect: [
					{
						id: 1,
					},
					{
						id: 2,
					},
				],
			},
		},
	});

	await client.sport.create({
		data: {
			name: "boxingBuds",
			price: 200,
			categoryId: 12,
			DiscountOptions: {
				connect: [
					{
						id: 1,
					},
					{
						id: 2,
					},
				],
			},
		},
	});

	await client.sport.create({
		data: {
			name: "boxingTeam",
			price: 200,
			categoryId: 12,
			DiscountOptions: {
				connect: [
					{
						id: 1,
					},
					{
						id: 2,
					},
				],
			},
		},
	});

	await client.sport.create({
		data: {
			name: "boxingPrivate",
			price: 350,
			categoryId: 12,
		},
	});

	await client.sport.create({
		data: {
			name: "tennisSchools",
			price: 350,
			categoryId: 13,
			DiscountOptions: {
				connect: [
					{
						id: 1,
					},
					{
						id: 2,
					},
				],
			},
		},
	});

	await client.sport.create({
		data: {
			name: "tennisTeam",
			price: 500,
			categoryId: 13,
			DiscountOptions: {
				connect: [
					{
						id: 1,
					},
					{
						id: 2,
					},
				],
			},
		},
	});

	await client.sport.create({
		data: {
			name: "tennisRentMorning",
			price: 50,
			categoryId: 13,
		},
	});

	await client.sport.create({
		data: {
			name: "tennisRentNight",
			price: 125,
			categoryId: 13,
		},
	});

	await client.sport.create({
		data: {
			name: "tennisPrivateSingleMorning",
			price: 75,
			categoryId: 13,
		},
	});

	await client.sport.create({
		data: {
			name: "tennisPrivateSingleNight",
			price: 100,
			categoryId: 13,
		},
	});

	await client.sport.create({
		data: {
			name: "tennisPrivateDoubleMorning",
			price: 90,
			categoryId: 13,
		},
	});

	await client.sport.create({
		data: {
			name: "tennisPrivateDoubleNight",
			price: 150,
			categoryId: 13,
		},
	});

	await client.sport.create({
		data: {
			name: "tennisPrivateTripleMorning",
			price: 125,
			categoryId: 13,
		},
	});

	await client.sport.create({
		data: {
			name: "tennisPrivateTripleNight",
			price: 175,
			categoryId: 13,
		},
	});

	await client.sport.create({
		data: {
			name: "squashBeginners",
			price: 500,
			categoryId: 14,
			DiscountOptions: {
				connect: [
					{
						id: 1,
					},
					{
						id: 2,
					},
				],
			},
		},
	});

	await client.sport.create({
		data: {
			name: "squashAmateurs",
			price: 650,
			categoryId: 14,
			DiscountOptions: {
				connect: [
					{
						id: 1,
					},
					{
						id: 2,
					},
				],
			},
		},
	});

	await client.sport.create({
		data: {
			name: "squashBuds",
			price: 650,
			categoryId: 14,
			DiscountOptions: {
				connect: [
					{
						id: 1,
					},
					{
						id: 2,
					},
				],
			},
		},
	});

	await client.sport.create({
		data: {
			name: "squashPrivate",
			price: 110,
			categoryId: 14,
		},
	});

	await client.sport.create({
		data: {
			name: "squashRentMember",
			price: 110,
			categoryId: 14,
		},
	});

	await client.sport.create({
		data: {
			name: "squashRentTeam",
			price: 60,
			categoryId: 14,
		},
	});

	await client.sport.create({
		data: {
			name: "gymnasticsGeneralTeam",
			price: 400,
			categoryId: 15,
			DiscountOptions: {
				connect: [
					{
						id: 1,
					},
					{
						id: 2,
					},
				],
			},
		},
	});

	await client.sport.create({
		data: {
			name: "gymnasticsGeneralPrivate",
			price: 125,
			categoryId: 15,
		},
	});

	await client.sport.create({
		data: {
			name: "gymnasticsArtisticAcademy",
			price: 400,
			categoryId: 15,
			DiscountOptions: {
				connect: [
					{
						id: 1,
					},
					{
						id: 2,
					},
				],
			},
		},
	});

	await client.sport.create({
		data: {
			name: "gymnasticsArtistic_6_years",
			price: 450,
			categoryId: 15,
			DiscountOptions: {
				connect: [
					{
						id: 1,
					},
					{
						id: 2,
					},
				],
			},
		},
	});

	await client.sport.create({
		data: {
			name: "gymnasticsArtistic_7-9_Years",
			price: 500,
			categoryId: 15,
			DiscountOptions: {
				connect: [
					{
						id: 1,
					},
					{
						id: 2,
					},
				],
			},
		},
	});

	await client.sport.create({
		data: {
			name: "gymnasticsArtistic_10_Years",
			price: 600,
			categoryId: 15,
			DiscountOptions: {
				connect: [
					{
						id: 1,
					},
					{
						id: 2,
					},
				],
			},
		},
	});

	await client.sport.create({
		data: {
			name: "gymnasticsArtistic_11-13_Years",
			price: 900,
			categoryId: 15,
			DiscountOptions: {
				connect: [
					{
						id: 1,
					},
					{
						id: 2,
					},
				],
			},
		},
	});

	await client.sport.create({
		data: {
			name: "gymnasticsArtistic_1-2_Grade",
			price: 1000,
			categoryId: 15,
			DiscountOptions: {
				connect: [
					{
						id: 1,
					},
					{
						id: 2,
					},
				],
			},
		},
	});

	await client.sport.create({
		data: {
			name: "gymnasticsArtisticPrivate",
			price: 75,
			categoryId: 15,
		},
	});

	await client.sport.create({
		data: {
			name: "gymnasticsAerobicPrep",
			price: 600,
			categoryId: 15,
			DiscountOptions: {
				connect: [
					{
						id: 1,
					},
					{
						id: 2,
					},
				],
			},
		},
	});

	await client.sport.create({
		data: {
			name: "gymnasticsAerobic_7-9_Years",
			price: 850,
			categoryId: 15,
			DiscountOptions: {
				connect: [
					{
						id: 1,
					},
					{
						id: 2,
					},
				],
			},
		},
	});

	await client.sport.create({
		data: {
			name: "gymnasticsAerobic_10-11_Years",
			price: 900,
			categoryId: 15,
			DiscountOptions: {
				connect: [
					{
						id: 1,
					},
					{
						id: 2,
					},
				],
			},
		},
	});

	await client.sport.create({
		data: {
			name: "gymnasticsAerobic_atLeast13_Years",
			price: 950,
			categoryId: 15,
			DiscountOptions: {
				connect: [
					{
						id: 1,
					},
					{
						id: 2,
					},
				],
			},
		},
	});

	await client.sport.create({
		data: {
			name: "gymnasticsAerobicPrivate",
			price: 75,
			categoryId: 15,
		},
	});

	await client.sport.create({
		data: {
			name: "gymnastics",
			price: 350,
			categoryId: 15,
			DiscountOptions: {
				connect: [
					{
						id: 1,
					},
					{
						id: 2,
					},
				],
			},
		},
	});

	await client.sport.create({
		data: {
			name: "gymnasticsRhythmic_10_Years",
			price: 1750,
			categoryId: 15,
			DiscountOptions: {
				connect: [
					{
						id: 1,
					},
					{
						id: 2,
					},
				],
			},
		},
	});

	await client.sport.create({
		data: {
			name: "gymnasiumMonthly",
			price: 250,
			categoryId: 16,
			DiscountOptions: {
				connect: [
					{
						id: 1,
					},
					{
						id: 2,
					},
				],
			},
		},
	});

	await client.sport.create({
		data: {
			name: "gymnasiumOneSession",
			price: 30,
			categoryId: 16,
			DiscountOptions: {
				connect: [
					{
						id: 1,
					},
					{
						id: 2,
					},
				],
			},
		},
	});

	await client.sport.create({
		data: {
			name: "gymnasiumSinglePrivate",
			price: 700,
			categoryId: 16,
			DiscountOptions: {
				connect: [
					{
						id: 1,
					},
					{
						id: 2,
					},
				],
			},
		},
	});

	await client.sport.create({
		data: {
			name: "gymnasiumDoublePrivate",
			price: 1000,
			categoryId: 16,
			DiscountOptions: {
				connect: [
					{
						id: 1,
					},
					{
						id: 2,
					},
				],
			},
		},
	});

	await client.sport.create({
		data: {
			name: "gymnasiumTriplePrivate",
			price: 1500,
			categoryId: 16,
			DiscountOptions: {
				connect: [
					{
						id: 1,
					},
					{
						id: 2,
					},
				],
			},
		},
	});

	await client.sport.create({
		data: {
			name: "gymnasiumMassageSession",
			price: 125,
			categoryId: 16,
		},
	});

	await client.sport.create({
		data: {
			name: "gymnasium_3_Months",
			price: 650,
			categoryId: 16,
		},
	});

	await client.sport.create({
		data: {
			name: "gymnasium_6_Months",
			price: 1300,
			categoryId: 16,
		},
	});

	await client.sport.create({
		data: {
			name: "gymnasiumFriendsMonthly",
			price: 1150,
			categoryId: 16,
		},
	});

	await client.sport.create({
		data: {
			name: "athleticsMonthly",
			price: 300,
			categoryId: 17,
			DiscountOptions: {
				connect: [
					{
						id: 1,
					},
					{
						id: 2,
					},
				],
			},
		},
	});

	await client.sport.create({
		data: {
			name: "athleticsPrivate",
			price: 125,
			categoryId: 17,
		},
	});

	await client.sport.create({
		data: {
			name: "fitnessMonthly",
			price: 300,
			categoryId: 18,
			DiscountOptions: {
				connect: [
					{
						id: 1,
					},
					{
						id: 2,
					},
				],
			},
		},
	});

	await client.sport.create({
		data: {
			name: "fitnessPrivate",
			price: 125,
			categoryId: 18,
		},
	});

	await client.sport.create({
		data: {
			name: "fitnessPrivateGroup",
			price: 500,
			categoryId: 18,
		},
	});

	await client.sport.create({
		data: {
			name: "karateSchools",
			price: 300,
			categoryId: 19,
			DiscountOptions: {
				connect: [
					{
						id: 1,
					},
					{
						id: 2,
					},
				],
			},
		},
	});

	await client.sport.create({
		data: {
			name: "karateBuds",
			price: 250,
			categoryId: 19,
			DiscountOptions: {
				connect: [
					{
						id: 1,
					},
					{
						id: 2,
					},
				],
			},
		},
	});

	await client.sport.create({
		data: {
			name: "karateYouth",
			price: 200,
			categoryId: 19,
			DiscountOptions: {
				connect: [
					{
						id: 1,
					},
					{
						id: 2,
					},
				],
			},
		},
	});

	await client.sport.create({
		data: {
			name: "karateExam",
			price: 250,
			categoryId: 19,
		},
	});

	await client.sport.create({
		data: {
			name: "karatePrivate_2-4_Group",
			price: 550,
			categoryId: 19,
		},
	});

	await client.sport.create({
		data: {
			name: "karatePrivate_6-8_Group",
			price: 450,
			categoryId: 19,
		},
	});

	await client.sport.create({
		data: {
			name: "fencingElite",
			price: 1200,
			categoryId: 20,
			DiscountOptions: {
				connect: [
					{
						id: 1,
					},
					{
						id: 2,
					},
				],
			},
		},
	});

	await client.sport.create({
		data: {
			name: "fencingSpecial",
			price: 850,
			categoryId: 20,
			DiscountOptions: {
				connect: [
					{
						id: 1,
					},
					{
						id: 2,
					},
				],
			},
		},
	});

	await client.sport.create({
		data: {
			name: "fencingBeginners",
			price: 500,
			categoryId: 20,
			DiscountOptions: {
				connect: [
					{
						id: 1,
					},
					{
						id: 2,
					},
				],
			},
		},
	});

	await client.sport.create({
		data: {
			name: "fencingFitness",
			price: 250,
			categoryId: 20,
		},
	});

	await client.sport.create({
		data: {
			name: "fencingOlympicLesson",
			price: 200,
			categoryId: 20,
		},
	});

	await client.sport.create({
		data: {
			name: "fencingInternationalLesson",
			price: 150,
			categoryId: 20,
		},
	});

	await client.sport.create({
		data: {
			name: "fencingLocalLesson",
			price: 100,
			categoryId: 20,
		},
	});

	await client.sport.create({
		data: {
			name: "fencingOneDayCamping",
			price: 300,
			categoryId: 20,
		},
	});

	await client.sport.create({
		data: {
			name: "fencingAdditionalLevel",
			price: 500,
			categoryId: 20,
		},
	});

	await client.sport.create({
		data: {
			name: "fencingUnit",
			price: 150,
			categoryId: 20,
		},
	});

	await client.sport.create({
		data: {
			name: "swimmingSchools",
			price: 325,
			categoryId: 1,
			penaltyId: 1,
			DiscountOptions: {
				connect: [
					{
						id: 3,
					},
					{
						id: 4,
					},
				],
			},
		},
	});

	await client.sport.create({
		data: {
			name: "swimmingSpecialSchools",
			price: 450,
			categoryId: 1,
			penaltyId: 1,
			DiscountOptions: {
				connect: [
					{
						id: 3,
					},
					{
						id: 4,
					},
				],
			},
		},
	});

	await client.sport.create({
		data: {
			name: "swimmingPrep",
			price: 300,
			categoryId: 1,
			penaltyId: 1,
			DiscountOptions: {
				connect: [
					{
						id: 1,
					},
					{
						id: 2,
					},
				],
			},
		},
	});

	await client.sport.create({
		data: {
			name: "swimmingTeam",
			price: 200,
			categoryId: 1,
			penaltyId: 1,
			DiscountOptions: {
				connect: [
					{
						id: 1,
					},
					{
						id: 2,
					},
				],
			},
		},
	});

	await client.sport.create({
		data: {
			name: "swimmingPracticing",
			price: 300,
			categoryId: 1,
			penaltyId: 1,
			DiscountOptions: {
				connect: [
					{
						id: 1,
					},
					{
						id: 2,
					},
				],
			},
		},
	});

	await client.sport.create({
		data: {
			name: "swimmingSeniorEducation",
			price: 550,
			categoryId: 1,
			DiscountOptions: {
				connect: [
					{
						id: 1,
					},
					{
						id: 2,
					},
				],
			},
		},
	});

	await client.sport.create({
		data: {
			name: "swimmingFree",
			price: 30,
			categoryId: 1,
		},
	});

	await client.sport.create({
		data: {
			name: "swimmingPrivate_24",
			price: 1000,
			categoryId: 1,
			DiscountOptions: {
				connect: [
					{
						id: 5,
					},
					{
						id: 6,
					},
				],
			},
		},
	});

	await client.sport.create({
		data: {
			name: "swimmingPrivate_12",
			price: 600,
			categoryId: 1,
			DiscountOptions: {
				connect: [
					{
						id: 5,
					},
					{
						id: 6,
					},
				],
			},
		},
	});

	await client.sport.create({
		data: {
			name: "swimmingPrivate_8",
			price: 450,
			categoryId: 1,
			DiscountOptions: {
				connect: [
					{
						id: 5,
					},
					{
						id: 6,
					},
				],
			},
		},
	});

	await client.sport.create({
		data: {
			name: "swimmingPrivate_4",
			price: 250,
			categoryId: 1,
			DiscountOptions: {
				connect: [
					{
						id: 5,
					},
					{
						id: 6,
					},
				],
			},
		},
	});

	await client.sport.create({
		data: {
			name: "swimmingPrivate_12_Group",
			price: 1800,
			categoryId: 1,
			DiscountOptions: {
				connect: [
					{
						id: 5,
					},
				],
			},
		},
	});

	await client.sport.create({
		data: {
			name: "swimmingPrivate_8_Group",
			price: 1500,
			categoryId: 1,
			DiscountOptions: {
				connect: [
					{
						id: 5,
					},
				],
			},
		},
	});
}

seed()
	.catch((e) => {
		console.error(e);
		process.exit(1);
	})
	.finally(async () => {
		await client.$disconnect();
	});
