export type TimeEndTriggers = "time";
export type LocationEndTriggers = "leave_location" | "enter_location";
export type EndTriggers = LocationEndTriggers | TimeEndTriggers;
// State shape
export interface GeoTaskScheduleState {
    selectedTasks: Record<string, boolean>;
    selectStartTimeButtonClicked: boolean;
    startTime?: number;
    endTrigger?: EndTriggers;
    endTime?: number;
    endLocation?: string;
    commitmentPeriod?: number;
}

// Action types
export type GeoTaskScheduleAction =
    | { type: "TOGGLE_TASK"; task: string }
    | { type: "SET_START_TIME_BUTTON_CLICKED" }
    | { type: "SET_START_TIME"; time: number }
    | { type: "SET_END_TRIGGER"; trigger: "time" | "location" }
    | { type: "SET_END_TIME"; time: number }
    | { type: "SET_END_LOCATION"; location: string }
    | { type: "SET_COMMITMENT_PERIOD"; period: number }
    | { type: "RESET_STATE" };

// Initial state
export const initialState: GeoTaskScheduleState = {
    selectedTasks: {},
    selectStartTimeButtonClicked: false,
    startTime: undefined,
    endTrigger: undefined,
    endTime: undefined,
    endLocation: undefined,
    commitmentPeriod: undefined,
};

// Reducer function
export function geoTaskScheduleReducer(
    state: GeoTaskScheduleState,
    action: GeoTaskScheduleAction,
): GeoTaskScheduleState {
    switch (action.type) {
        case "TOGGLE_TASK":
            return {
                ...state,
                selectedTasks: {
                    ...state.selectedTasks,
                    [action.task]: !state.selectedTasks[action.task],
                },
            };
        case "SET_START_TIME_BUTTON_CLICKED":
            return { ...state, selectStartTimeButtonClicked: true };
        case "SET_START_TIME":
            return { ...state, startTime: action.time };
        case "SET_END_TRIGGER":
            return { ...state, endTrigger: action.trigger };
        case "SET_END_TIME":
            return { ...state, endTime: action.time };
        case "SET_END_LOCATION":
            return { ...state, endLocation: action.location };
        case "SET_COMMITMENT_PERIOD":
            return { ...state, commitmentPeriod: action.period };
        case "RESET_STATE":
            return initialState;
        default:
            return state;
    }
}
