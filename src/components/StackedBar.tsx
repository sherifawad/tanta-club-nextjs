import { ResponsiveBar } from "@nivo/bar";

interface Props {
    labels: string[];
    label: string;
    legendTitle?: string;
    values: number[];
}

const StackedBar = () => {
    const dataToDisplay = {
        labels: ["بدون خصم", "خصم 10%", "خصم 20%", "خصومات آخرى"],
        datasets: [
            {
                label: "4 حصص",
                data: [
                    private_type1?.noDiscount_total,
                    private_type1?.discount_1_total,
                    private_type1?.discount_2_total,
                    private_type1?.discount_other_total,
                ],
                backgroundColor: "rgba(101, 10, 66, 1)",
            },
            {
                label: "8 حصص",
                data: [
                    private_type2?.noDiscount_total,
                    private_type2?.discount_1_total,
                    private_type2?.discount_2_total,
                    private_type2?.discount_other_total,
                ],
                backgroundColor: "rgba(251, 110, 245, 1)",
            },
            {
                label: "12 حصة",
                data: [
                    private_type3?.noDiscount_total,
                    private_type3?.discount_1_total,
                    private_type3?.discount_2_total,
                    private_type3?.discount_other_total,
                ],
                backgroundColor: "rgba(43, 215, 243, 1)",
            },
            {
                label: "24 حصة",
                data: [
                    private_type4?.noDiscount_total,
                    private_type4?.discount_1_total,
                    private_type4?.discount_2_total,
                    private_type4?.discount_other_total,
                ],
                backgroundColor: "rgba(31, 139, 116, 1)",
            },
            {
                label: "مجموعة 8",
                data: [
                    private_type5?.noDiscount_total,
                    private_type5?.discount_1_total,
                    private_type5?.discount_2_total,
                    private_type5?.discount_other_total,
                ],
                backgroundColor: "rgba(12, 255, 136, 1)",
            },
            {
                label: "مجموعة 12",
                data: [
                    private_type6?.noDiscount_total,
                    private_type6?.discount_1_total,
                    private_type6?.discount_2_total,
                    private_type6?.discount_other_total,
                ],
                backgroundColor: "rgba(242, 255, 10, 1)",
            },
        ],
    };

    return (
        <>
            <div className="w-full relative lg:h-[70vh] h-[50vh] m-auto p-4 border rounded-lg bg-white">
                <ResponsiveBar
                    data={[]}
                    keys={[
                        "hot dog",
                        "burger",
                        "sandwich",
                        "kebab",
                        "fries",
                        "donut",
                    ]}
                    indexBy="country"
                    margin={{ top: 50, right: 130, bottom: 50, left: 60 }}
                    padding={0.3}
                    groupMode="grouped"
                    valueScale={{ type: "linear" }}
                    indexScale={{ type: "band", round: true }}
                    colors={{ scheme: "nivo" }}
                    defs={[
                        {
                            id: "dots",
                            type: "patternDots",
                            background: "inherit",
                            color: "#38bcb2",
                            size: 4,
                            padding: 1,
                            stagger: true,
                        },
                        {
                            id: "lines",
                            type: "patternLines",
                            background: "inherit",
                            color: "#eed312",
                            rotation: -45,
                            lineWidth: 6,
                            spacing: 10,
                        },
                    ]}
                    fill={[
                        {
                            match: {
                                id: "fries",
                            },
                            id: "dots",
                        },
                        {
                            match: {
                                id: "sandwich",
                            },
                            id: "lines",
                        },
                    ]}
                    borderColor={{
                        from: "color",
                        modifiers: [["darker", 1.6]],
                    }}
                    axisTop={null}
                    axisRight={null}
                    axisBottom={{
                        tickSize: 5,
                        tickPadding: 5,
                        tickRotation: 0,
                        legend: "country",
                        legendPosition: "middle",
                        legendOffset: 32,
                    }}
                    axisLeft={{
                        tickSize: 5,
                        tickPadding: 5,
                        tickRotation: 0,
                        legend: "food",
                        legendPosition: "middle",
                        legendOffset: -40,
                    }}
                    labelSkipWidth={12}
                    labelSkipHeight={12}
                    labelTextColor={{
                        from: "color",
                        modifiers: [["darker", 1.6]],
                    }}
                    legends={[
                        {
                            dataFrom: "keys",
                            anchor: "bottom-right",
                            direction: "column",
                            justify: false,
                            translateX: 120,
                            translateY: 0,
                            itemsSpacing: 2,
                            itemWidth: 100,
                            itemHeight: 20,
                            itemDirection: "left-to-right",
                            itemOpacity: 0.85,
                            symbolSize: 20,
                            effects: [
                                {
                                    on: "hover",
                                    style: {
                                        itemOpacity: 1,
                                    },
                                },
                            ],
                        },
                    ]}
                    role="application"
                    ariaLabel="Nivo bar chart demo"
                    barAriaLabel={(e) =>
                        e.id +
                        ": " +
                        e.formattedValue +
                        " in country: " +
                        e.indexValue
                    }
                />
            </div>
        </>
    );
};

export default StackedBar;
