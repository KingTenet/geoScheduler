// ~/apps/nextjs/src/app/_components/EndTrigger.tsx
import { Input } from "@GeoScheduler/ui/input";
import { Label } from "@GeoScheduler/ui/label";
import { RadioGroup, RadioGroupItem } from "@GeoScheduler/ui/radio-group";

import { TimeSelector } from "./TimeSelector";

interface EndTriggerProps {
    endTrigger: "time" | "location";
    onSelectEndTrigger: (trigger: "time" | "location") => void;
    endTime: string;
    onSelectEndTime: (time: string) => void;
    endLocation: string;
    onSelectEndLocation: (location: string) => void;
}

export function EndTrigger({
    endTrigger,
    onSelectEndTrigger,
    endTime,
    onSelectEndTime,
    endLocation,
    onSelectEndLocation,
}: EndTriggerProps) {
    return (
        <div className="space-y-4">
            <Label>End Trigger</Label>
            <RadioGroup
                value={endTrigger}
                onValueChange={onSelectEndTrigger as (value: string) => void}
            >
                <div className="flex items-center space-x-2">
                    <RadioGroupItem value="time" id="time" />
                    <Label htmlFor="time">End Time</Label>
                </div>
                <div className="flex items-center space-x-2">
                    <RadioGroupItem value="location" id="location" />
                    <Label htmlFor="location">End Location</Label>
                </div>
            </RadioGroup>
            {endTrigger === "time" && (
                <TimeSelector
                    label="End Time"
                    selectedTime={endTime}
                    onSelectTime={onSelectEndTime}
                />
            )}
            {endTrigger === "location" && (
                <Input
                    type="text"
                    value={endLocation}
                    onChange={(e) => onSelectEndLocation(e.target.value)}
                    placeholder="Enter end location"
                />
            )}
        </div>
    );
}
