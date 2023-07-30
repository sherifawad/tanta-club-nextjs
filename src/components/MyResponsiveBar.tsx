// install (please try to align the version of installed @nivo packages)
// yarn add @nivo/bar
import type { BarDatum, ComputedDatum } from "@nivo/bar";
import { BarData } from "types";

import dynamic from "next/dynamic";

const ResponsiveBar = dynamic(
    () => import("@nivo/bar").then((m) => m.ResponsiveBar),
    { ssr: false }
);

// make sure parent container have a defined height when using
// responsive component, otherwise height will be 0 and
// no chart will be rendered.
// website examples showcase many properties,
// you'll often use just a few of them.

type ResponsiveBarProps = {
    data: BarData[];
    keys: string[];
    indexBy: string;
    ariaLabel: string;
};

interface IE {
    id: string;
    formattedValue: string;
    indexValue: string;
}

const MyResponsiveBar = ({
    data,
    keys,
    indexBy,
    ariaLabel,
}: ResponsiveBarProps) => {
    console.log("🚀 ~ file: MyResponsiveBar.tsx:38 ~ ariaLabel:", ariaLabel);
    console.log("🚀 ~ file: MyResponsiveBar.tsx:38 ~ indexBy:", indexBy);
    console.log("🚀 ~ file: MyResponsiveBar.tsx:38 ~ keys:", keys);
    console.log("🚀 ~ file: MyResponsiveBar.tsx:38 ~ data:", data);

    return (
        <ResponsiveBar
            data={data}
            keys={keys}
            indexBy={indexBy}
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
            ariaLabel={ariaLabel}
            barAriaLabel={(e: ComputedDatum<BarDatum>) =>
                e.id +
                ": " +
                e.formattedValue +
                ` in ${indexBy}: ` +
                e.indexValue
            }
        />
    );
};

export default MyResponsiveBar;
