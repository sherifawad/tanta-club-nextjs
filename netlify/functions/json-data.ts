exports.handler = async (event: any, context: any) => {
    const quotes = [
        "I find your lack of faith disturbing.",
        "Do. Or do not. There is no try.",
        "A long time ago in a galaxy far, far away...",
    ];

    const randomQuote = quotes[Math.floor(Math.random() * quotes.length)];

    const response = JSON.stringify({ quote: randomQuote });

    return {
        statusCode: 200,
        body: response,
        headers: {
            "Content-Type": "application/json; charset=utf-8",
            "Access-Control-Allow-Origin": "*",
        },
    };
};
