import { Category } from "@prisma/client";
import axios from "axios";

type GetCategoriesResponse = {
	data: Category[];
};

export async function getCategories() {
	try {
		// 👇️ const data: GetCategoriesResponse
		const { data, status } = await axios.get<GetCategoriesResponse>(
			`${process?.env?.VERCEL_URL ?? "http://localhost:3000"}/api/categories`,
			{
				headers: {
					Accept: "application/json",
				},
			}
		);

		console.log(JSON.stringify(data, null, 4));

		// 👇️ "response status is: 200"
		console.log("response status is: ", status);

		return data;
	} catch (error) {
		if (axios.isAxiosError(error)) {
			console.log("error message: ", error.message);
			return error.message;
		} else {
			console.log("unexpected error: ", error);
			return "An unexpected error occurred";
		}
	}
}
