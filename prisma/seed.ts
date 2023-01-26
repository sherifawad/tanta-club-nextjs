import { PrismaClient } from "@prisma/client";

const client = new PrismaClient();
async function seed() {
	await client.category.deleteMany();
	await client.discount.deleteMany();
	await client.sport.deleteMany();

	const discounts = await client.discount.createMany({
		data: [
			{
				type: "PERCENTAGE",
				minimum: 10,
				Maximum: 20,
				step: 10,
				name: "brothersPercentage",
			},
			{
				type: "PERCENTAGE",
				minimum: 10,
				Maximum: 20,
				step: 10,
				name: "multiSportsPercentage",
			},
			{
				type: "FIXED",
				minimum: 25,
				Maximum: 50,
				step: 25,
				name: "brothersFixed",
			},
			{
				type: "FIXED",
				minimum: 25,
				Maximum: 50,
				step: 25,
				name: "multiSportsFixed",
			},
			{
				type: "PERCENTAGE",
				minimum: 10,
				Maximum: 10,
				step: 0,
				name: "firstWeek",
			},
			{
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
				name: "swimming",
			},
		],
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
