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
				title: "خصم تعدد إخوة",
				minimum: 10,
				Maximum: 20,
				step: 10,
				name: "brothersPercentage",
			},
			{
				id: 2,
				type: "PERCENTAGE",
				title: "خصم تعددالعاب",
				minimum: 10,
				Maximum: 20,
				step: 10,
				name: "multiSportsPercentage",
			},
			{
				id: 3,
				type: "FIXED",
				title: "خصم تعدد إخوة",
				minimum: 25,
				Maximum: 50,
				step: 25,
				name: "brothersFixed",
			},
			{
				id: 4,
				type: "FIXED",
				title: "خصم تعددالعاب",
				minimum: 25,
				Maximum: 50,
				step: 25,
				name: "multiSportsFixed",
			},
			{
				id: 5,
				type: "PERCENTAGE",
				title: "خصم دفع مبكر",
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
				title: "خصم تعدد إخوة",
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
				title: "سباحة",
			},
			{
				id: 2,
				name: "footBall",
				title: "كرة قدم",
			},
			{
				id: 3,
				name: "basket",
				title: "كرة سلة",
			},
			{
				id: 4,
				name: "handBall",
				title: "كرة يد",
			},
			{
				id: 5,
				name: "volleyBall",
				title: "كرة طائرة",
			},
			{
				id: 6,
				name: "taekwondo",
				title: "تايكوندو",
			},
			{
				id: 7,
				name: "judo",
				title: "جودو",
			},
			{
				id: 8,
				name: "pingPong",
				title: "تنس طاولة",
			},
			{
				id: 9,
				name: "art",
				title: "طلائع",
			},
			{
				id: 10,
				name: "snooker",
				title: "بلياردو",
			},
			{
				id: 11,
				name: "modernPentathlon",
				title: "خماسي حديث",
			},
			{
				id: 12,
				name: "boxing",
				title: "ملاكمة",
			},
			{
				id: 13,
				name: "tennis",
				title: "نتس أرضي",
			},
			{
				id: 14,
				name: "squash",
				title: "اسكواش",
			},
			{
				id: 15,
				name: "gymnastics",
				title: "جمباز",
			},
			{
				id: 16,
				name: "gymnasium",
				title: "جيم",
			},
			{
				id: 17,
				name: "athletics",
				title: "ألعاب قوى",
			},
			{
				id: 18,
				name: "fitness",
				title: "فتنس تراك",
			},
			{
				id: 19,
				name: "karate",
				title: "كاراتيه",
			},
			{
				id: 20,
				name: "fencing",
				title: "سلاح",
			},
		],
	});

	await client.sport.create({
		data: {
			name: "footBallAcademy",
			title: "أكاديمية كرة قدم",
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
			title: "كرة قدم مميزة",
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
			title: "سلة",
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
			title: "كرة يد",
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
			title: "كرة طائرة",
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
			name: "taekwondoMonthly",
			title: "تايكوندو شهري",
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
			title: "تايكوندو خاص",
			price: 200,
			categoryId: 6,
		},
	});

	await client.sport.create({
		data: {
			name: "judo",
			title: "جودو",
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
			title: "تنس طاولة شهري",
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
			title: "إيجار تنس طاولة",
			price: 25,
			categoryId: 8,
		},
	});

	await client.sport.create({
		data: {
			name: "art",
			title: "طلائع",
			price: 50,
			categoryId: 9,
		},
	});

	await client.sport.create({
		data: {
			name: "snooker",
			title: "بلياردو شهري",
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
			title: "إيجار بلياردو",
			price: 40,
			categoryId: 10,
		},
	});

	await client.sport.create({
		data: {
			name: "modernPentathlonLaser",
			title: "خماسي ليزر رن",
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
			title: "خماسي ثنائي",
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
			title: "خماسي ثلاثي",
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
			title: "خماسي مدارس",
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
			title: "خماسي ماسترز",
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
			title: "ملاكمة مبتدئين",
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
			title: "ملاكمة هواه",
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
			title: "ملاكمة براعم",
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
			title: "ملاكمة فريق",
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
			title: "ملاكمة خاص",
			price: 350,
			categoryId: 12,
		},
	});

	await client.sport.create({
		data: {
			name: "tennisSchools",
			title: "تنس أرضي مدارس",
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
			title: "تنس أرضي فريق",
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
			title: "تنس أرضي إيجار صباحي",
			price: 50,
			categoryId: 13,
		},
	});

	await client.sport.create({
		data: {
			name: "tennisRentNight",
			title: "تنس أرضي إيجار مسائي",
			price: 125,
			categoryId: 13,
		},
	});

	await client.sport.create({
		data: {
			name: "tennisPrivateSingleMorning",
			title: "تنس أرضي خاص فردي صباحي",
			price: 75,
			categoryId: 13,
		},
	});

	await client.sport.create({
		data: {
			name: "tennisPrivateSingleNight",
			title: "تنس أرضي خاص فردي مسائي",
			price: 100,
			categoryId: 13,
		},
	});

	await client.sport.create({
		data: {
			name: "tennisPrivateDoubleMorning",
			title: "تنس أرضي خاص زوجي صباحي",
			price: 90,
			categoryId: 13,
		},
	});

	await client.sport.create({
		data: {
			name: "tennisPrivateDoubleNight",
			title: "تنس أرضي خاص زوجي مسائي",
			price: 150,
			categoryId: 13,
		},
	});

	await client.sport.create({
		data: {
			name: "tennisPrivateTripleMorning",
			title: "تنس أرضي خاص ثلاثي صباحي",
			price: 125,
			categoryId: 13,
		},
	});

	await client.sport.create({
		data: {
			name: "tennisPrivateTripleNight",
			title: "تنس أرضي خاص ثلاثي مسائي",
			price: 175,
			categoryId: 13,
		},
	});

	await client.sport.create({
		data: {
			name: "squashBeginners",
			title: "اسكواش مبتدئين",
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
			title: "اسكواش هواه",
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
			title: "اسكواش براعم",
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
			name: "squashTeam",
			title: "اسكواش فريق",
			price: 550,
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
			title: "اسكواش خاص",
			price: 110,
			categoryId: 14,
		},
	});

	await client.sport.create({
		data: {
			name: "squashRentMember",
			title: "اسكواش إيجار عضو",
			price: 110,
			categoryId: 14,
		},
	});

	await client.sport.create({
		data: {
			name: "squashRentTeam",
			title: "اسكواش إيجار فريق",
			price: 60,
			categoryId: 14,
		},
	});

	await client.sport.create({
		data: {
			name: "gymnasticsGeneralTeam",
			title: "جمباز عام فريق",
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
			title: "جمباز عام خاص",
			price: 125,
			categoryId: 15,
		},
	});

	await client.sport.create({
		data: {
			name: "gymnasticsArtisticAcademy",
			title: "جمباز فني أكاديمية",
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
			title: "جمباز فني 6 سنوات",
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
			title: "جمباز فني 7-9 سنوات",
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
			title: "جمباز فني 10 سنوات",
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
			title: "جمباز فني 11-13 سنوات",
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
			title: "جمباز فني درجة 1-2",
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
			title: "جمباز فني حاص",
			price: 75,
			categoryId: 15,
		},
	});

	await client.sport.create({
		data: {
			name: "gymnasticsAerobicPrep",
			title: "جمباز ايروبك تجهيزي",
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
			title: "جمباز ايروبك 7-9 سنوات",
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
			title: "جمباز ايروبك 10-11 سنوات",
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
			title: "جمباز ايروبك 13 فيما أعلى",
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
			title: "جمباز ايروبك خاص",
			price: 75,
			categoryId: 15,
		},
	});

	await client.sport.create({
		data: {
			name: "gymnasticsRhythmic_10_Years",
			title: "جمباز إيقاعي 10 سنوات",
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
			title: "جيم شهري",
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
			title: "جيم حصة واحدة",
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
			title: "جيم خاص فردي",
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
			title: "جيم خاص زوجي",
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
			title: "جيم خاص ثلاثي",
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
			title: "جيم حصة مساج",
			price: 125,
			categoryId: 16,
		},
	});

	await client.sport.create({
		data: {
			name: "gymnasium_3_Months",
			title: "جيم ثلاث أشهر",
			price: 650,
			categoryId: 16,
		},
	});

	await client.sport.create({
		data: {
			name: "gymnasium_6_Months",
			title: "جيم ستة أشهر",
			price: 1300,
			categoryId: 16,
		},
	});

	await client.sport.create({
		data: {
			name: "gymnasiumFriendsMonthly",
			title: "جيم أصدقاء شهري",
			price: 1150,
			categoryId: 16,
		},
	});

	await client.sport.create({
		data: {
			name: "athleticsMonthly",
			title: "ألعاب قوى شهري",
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
			title: "ألعاب قوى خاص",
			price: 125,
			categoryId: 17,
		},
	});

	await client.sport.create({
		data: {
			name: "fitnessMonthly",
			title: "فتنس تراك شهري",
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
			title: "فتنس تراك خاص",
			price: 125,
			categoryId: 18,
		},
	});

	await client.sport.create({
		data: {
			name: "fitnessPrivateGroup",
			title: "فتنس تراك خاص مجموعة",
			price: 500,
			categoryId: 18,
		},
	});

	await client.sport.create({
		data: {
			name: "karateSchools",
			title: "كاراتيه مدارس",
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
			title: "كاراتيه براعم",
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
			title: "كاراتيه ناشئين",
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
			title: "كاراتيه اختبار",
			price: 250,
			categoryId: 19,
		},
	});

	await client.sport.create({
		data: {
			name: "karatePrivate_2-4_Group",
			title: "كاراتيه خاص مجموعة 2-4",
			price: 550,
			categoryId: 19,
		},
	});

	await client.sport.create({
		data: {
			name: "karatePrivate_6-8_Group",
			title: "كاراتيه خاص مجموعة 6-8",
			price: 450,
			categoryId: 19,
		},
	});

	await client.sport.create({
		data: {
			name: "fencingElite",
			title: "سلاح نخبة",
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
			title: "سلاح مميز",
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
			title: "سلاح مبتدئين",
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
			title: "سلاح لياقة",
			price: 250,
			categoryId: 20,
		},
	});

	await client.sport.create({
		data: {
			name: "fencingOlympicLesson",
			title: "سلاح درس أوليمبي",
			price: 200,
			categoryId: 20,
		},
	});

	await client.sport.create({
		data: {
			name: "fencingInternationalLesson",
			title: "سلاح درس دولي",
			price: 150,
			categoryId: 20,
		},
	});

	await client.sport.create({
		data: {
			name: "fencingLocalLesson",
			title: "سلاح درس محلي",
			price: 100,
			categoryId: 20,
		},
	});

	await client.sport.create({
		data: {
			name: "fencingOneDayCamping",
			title: "سلاح معسكر",
			price: 300,
			categoryId: 20,
		},
	});

	await client.sport.create({
		data: {
			name: "fencingAdditionalLevel",
			title: "سلاح مستوى إضافي",
			price: 500,
			categoryId: 20,
		},
	});

	await client.sport.create({
		data: {
			name: "fencingUnit",
			title: "سلاح وحدة تدريبية",
			price: 150,
			categoryId: 20,
		},
	});

	await client.sport.create({
		data: {
			name: "swimmingSchools",
			title: "سباحة مدارس",
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
			title: " سباحة مدارس مميزة",
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
			title: "سباحة تجهيزي",
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
			title: "سباحة فريق",
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
			title: "سباحة ممارسة",
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
			title: "سباحة تعليم كبار",
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
			title: "سباحة فترة حرة",
			price: 30,
			categoryId: 1,
		},
	});

	await client.sport.create({
		data: {
			name: "swimmingPrivate_24",
			title: "سباحة خاص 24 حصة",
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
			title: "سباحة خاص 12 حصة",
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
			title: "سباحة خاص 8 حصص",
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
			title: "سباحة خاص 4 حصص",
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
			title: "سباحة خاص مجموعة 12 حصة",
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
			title: "سباحة خاص مجموعة 8 حصص",
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
