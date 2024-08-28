import * as React from "react";
import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid";
import MuiInput from "@mui/material/Input";
import Slider from "@mui/material/Slider";
import { styled } from "@mui/material/styles";
import Typography from "@mui/material/Typography";

import {
    ExplodingHeadEmoji,
    FireEmoji,
    FlexBicepEmoji,
    HundredPointsEmoji,
    NerdFaceEmoji,
    RocketEmoji,
    ThumbsUpEmoji,
    UnicornEmoji,
    WeightLifterEmoji,
    YawnEmoji,
} from "./Emojis";

const Input = styled(MuiInput)`
    width: 42px;
`;

const marks = [
    {
        value: 0,
        label: "Nada",
    },
    {
        value: 1,
        label: "1 hour",
    },
    {
        value: 2,
        label: "2 hours",
    },
    {
        value: 3,
        label: "1 day",
    },
    {
        value: 4,
        label: "2 days",
    },
    {
        value: 5,
        label: "1 week",
    },
];

const MS_IN_MINUTE = 1000 * 60;
const MS_IN_HOUR = 1000 * 60 * 60;
const MS_IN_DAY = 1000 * 60 * 60 * 24;

const hours = (hours: number) => `${hours} hour${hours > 1 ? "s" : ""}`;

const minutes = (minutes: number) =>
    `${minutes} minute${minutes > 1 ? "s" : ""}`;

const days = (days: number) => `${days} day${days > 1 ? "s" : ""}`;

type SliderValueLiteral = {
    emoji: (props: any) => React.JSX.Element;
    literal: string;
    type: "literal";
};

type SliderValueTimeType = {
    elapsedTime: number;
    emoji: (props: any) => React.JSX.Element;
    type: "minutes" | "hours" | "days" | "weeks" | "months";
};

type SliderValueType = SliderValueLiteral | SliderValueTimeType;

const SLIDER_VALUES: SliderValueType[] = [
    {
        literal: "I can quit anytime... probably",
        emoji: YawnEmoji,
        type: "literal",
    },
    {
        elapsedTime: 30,
        emoji: ThumbsUpEmoji,
        type: "minutes",
    },
    {
        elapsedTime: 2,
        emoji: FlexBicepEmoji,
        type: "hours",
    },
    {
        elapsedTime: 1,
        emoji: WeightLifterEmoji,
        type: "days",
    },
    {
        elapsedTime: 3,
        emoji: FireEmoji,
        type: "days",
    },
    {
        elapsedTime: 1,
        emoji: RocketEmoji,
        type: "weeks",
    },
    {
        elapsedTime: 2,
        emoji: UnicornEmoji,
        type: "weeks",
    },
    {
        elapsedTime: 1,
        emoji: HundredPointsEmoji,
        type: "months",
    },
    {
        elapsedTime: 3,
        emoji: NerdFaceEmoji,
        type: "months",
    },
    {
        literal: "I'm in it for life!",
        emoji: ExplodingHeadEmoji,
        type: "literal",
    },
];

const makeLabels =
    (fn: (num: number) => string) =>
    (num: number | undefined): string =>
        num ? `Edit up to ${fn(num)} before active` : "";

const weeks = (weeks: number) => `${weeks} week${weeks > 1 ? "s" : ""}`;
const months = (months: number) => `${months} month${months > 1 ? "s" : ""}`;

const valueLabelFormat = (
    sliderValue: number,
): [string, (props: any) => React.JSX.Element] => {
    const sliderValueConfig = SLIDER_VALUES[sliderValue];
    if (!sliderValueConfig) {
        throw new Error("No slider config for value " + sliderValue);
    }

    if (sliderValueConfig.type === "literal") {
        return [sliderValueConfig.literal, sliderValueConfig.emoji];
    }

    const elapsedTime = sliderValueConfig.elapsedTime;

    function getLabel(config) {
        switch (config.type) {
            case "months":
                return makeLabels(months)(elapsedTime);
            case "weeks":
                return makeLabels(weeks)(elapsedTime);
            case "days":
                return makeLabels(days)(elapsedTime);
            case "hours":
                return makeLabels(hours)(elapsedTime);
            case "minutes":
                return makeLabels(minutes)(elapsedTime);
            default:
                throw new Error("Unexpected type");
        }
    }

    return [getLabel(sliderValueConfig), sliderValueConfig.emoji];
};

interface CommitmentSliderProps {
    onChange: (value: number) => void;
}

export default function CommitmentSlider({ onChange }: CommitmentSliderProps) {
    const [value, setValue] = React.useState<number>(0);

    const handleChange = (event: Event, newValue: number | number[]) => {
        if (typeof newValue === "number") {
            setValue(newValue);
            onChange(newValue);
        }
    };

    const [valueLabel, Emoji] = valueLabelFormat(value);

    return (
        <Box
            sx={{
                width: "calc(100% - 50px)",
                marginLeft: "15px",
                marginRight: "35px",
            }}
        >
            <Grid container spacing={4} sx={{ alignItems: "center" }}>
                <Grid item xs>
                    <Box sx={{ display: "flex" }}>
                        <Slider
                            value={value}
                            min={0}
                            step={1}
                            max={SLIDER_VALUES.length - 1}
                            onChange={handleChange}
                            valueLabelDisplay="off"
                            aria-labelledby="non-linear-slider"
                        />
                    </Box>
                </Grid>
            </Grid>
            <Box
                sx={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    marginTop: "50px",
                }}
            >
                <Typography
                    sx={{ fontSize: "x-large" }}
                    id="non-linear-slider"
                    gutterBottom
                >
                    {valueLabel}
                </Typography>
                <Emoji style={{ fontSize: "xxx-large" }} />
            </Box>
        </Box>
    );
}
