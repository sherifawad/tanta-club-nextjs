import type { Handler, HandlerEvent, HandlerContext } from "@netlify/functions";
import { categoriesRepo } from "lib/categories-repo";
import { Category } from "types";
import { promises as fs } from "fs";

const handler: Handler = async (
    event: HandlerEvent,
    context: HandlerContext
) => {
    try {
        // const newCategory = await categoriesRepo.create({
        //     title: Math.random().toString(),
        //     name: Math.random().toString(),
        //     hidden: false,
        // } as Category);
        const quotes = [
            "I find your lack of faith disturbing.",
            "Do. Or do not. There is no try.",
            "A long time ago in a galaxy far, far away...",
        ];

        const randomQuote = quotes[Math.floor(Math.random() * quotes.length)];
        const jsonData = await fs.readFile("./categories.json", "utf8");
        const response = JSON.stringify({ categories: jsonData });

        return {
            statusCode: 200,
            body: response,
            headers: {
                "Content-Type": "application/json; charset=utf-8",
                // "Access-Control-Allow-Origin": "*",
            },
        };
    } catch (error) {
        const response = JSON.stringify({ error: error });

        return {
            statusCode: 500,
            body: response,
            headers: {
                "Content-Type": "application/json; charset=utf-8",
                // "Access-Control-Allow-Origin": "*",
            },
        };
    }
};

export { handler };
