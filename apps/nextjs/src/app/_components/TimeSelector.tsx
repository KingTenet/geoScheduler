import * as React from "react";
import CloseIcon from "@mui/icons-material/Close";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import IconButton from "@mui/material/IconButton";
import { styled } from "@mui/material/styles";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { MobileTimePicker } from "@mui/x-date-pickers/MobileTimePicker";
import dayjs, { Dayjs } from "dayjs";
import utc from "dayjs/plugin/utc";
import { JsxEmit } from "typescript";

dayjs.extend(utc);

const BootstrapDialog = styled(Dialog)(({ theme }) => ({
    "& .MuiDialogContent-root": {
        padding: theme.spacing(2),
    },
    "& .MuiDialogActions-root": {
        padding: theme.spacing(1),
    },
}));

export default function TimeSelector({
    timeTitle = "Start time",
    dispatchTime,
}: {
    timeTitle: string;
    dispatchTime: (time: number) => void;
}) {
    const [timeSinceMidnightMS, setValue] = React.useState<Dayjs | null>(
        dayjs.utc("1970-01-01T10:12"),
    );

    const [dialogIsOpen, updateDialogIsOpen] = React.useState(true);
    const onCloseHandler = () => {
        updateDialogIsOpen(false);
    };

    const onOpenHandler = () => {
        updateDialogIsOpen(true);
    };

    const onAcceptHandler = (time: number) => {
        updateDialogIsOpen(false);
        dispatchTime(time);
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

function CustomDialog({ openButtonTitle = "Open time selector" }) {
    const [open, setOpen] = React.useState(false);

    const [value, setValue] = React.useState<Dayjs | null>(
        dayjs("1970-01-01T10:12", "UTC"),
    );

    const handleClickOpen = () => {
        setOpen(true);
    };
    const handleClose = () => {
        dispatchTime(value);
        setOpen(false);
    };

    return (
        <React.Fragment>
            <Button variant="outlined" onClick={handleClickOpen}>
                {openButtonTitle}
            </Button>
            <BootstrapDialog
                onClose={handleClose}
                aria-labelledby="customized-dialog-title"
                open={open}
            >
                <DialogTitle sx={{ m: 0, p: 2 }} id="customized-dialog-title">
                    Modal title
                </DialogTitle>
                <IconButton
                    aria-label="close"
                    onClick={handleClose}
                    sx={(theme) => ({
                        position: "absolute",
                        right: 8,
                        top: 8,
                        color: theme.palette.grey[500],
                    })}
                >
                    <CloseIcon />
                </IconButton>
                <DialogContent dividers></DialogContent>
                <DialogActions>
                    <Button autoFocus onClick={handleClose}>
                        Submit
                    </Button>
                </DialogActions>
            </BootstrapDialog>
        </React.Fragment>
    );
}
