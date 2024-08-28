import type { Dayjs } from "dayjs";
import * as React from "react";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { MobileTimePicker } from "@mui/x-date-pickers/MobileTimePicker";
import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";

dayjs.extend(utc);

export default function TimeSelector({
    timeTitle,
    dispatchTime,
}: {
    timeTitle: string;
    dispatchTime: (time: number) => void;
}) {
    const [timeSinceMidnightMS, setValue] = React.useState<Dayjs | null>(
        dayjs.utc("1970-01-01T00:00"),
    );

    const [dialogIsOpen, updateDialogIsOpen] = React.useState(true);
    const onCloseHandler = () => {
        updateDialogIsOpen(false);
    };

    const onOpenHandler = () => {
        updateDialogIsOpen(true);
    };

    const onAcceptHandler = (time: Dayjs | null) => {
        if (!time) {
            return;
        }
        updateDialogIsOpen(false);
        dispatchTime(time.unix());
    };

    return (
        <LocalizationProvider dateAdapter={AdapterDayjs}>
            <MobileTimePicker
                open={dialogIsOpen}
                onClose={onCloseHandler}
                onOpen={onOpenHandler}
                timezone="UTC"
                onAccept={(time) => onAcceptHandler(time)}
                autoFocus={true}
                ampm={false}
                closeOnSelect={true}
                label={timeTitle}
                views={["hours", "minutes"]}
                value={timeSinceMidnightMS}
                onChange={(newValue) => setValue(newValue)}
            />
        </LocalizationProvider>
    );
}
