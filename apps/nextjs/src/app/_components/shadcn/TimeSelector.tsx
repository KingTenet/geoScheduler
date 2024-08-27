// ~/apps/nextjs/src/app/_components/TimeSelector.tsx
import { Input } from "@GeoScheduler/ui/input";
import { Label } from "@GeoScheduler/ui/label";

interface TimeSelectorProps {
    label: string;
    selectedTime: string;
    onSelectTime: (time: string) => void;
}

export function TimeSelector({
    label,
    selectedTime,
    onSelectTime,
}: TimeSelectorProps) {
    return (
        <div className="space-y-2">
            <Label htmlFor="time">{label}</Label>
            <Input
                id="time"
                type="time"
                value={selectedTime}
                onChange={(e) => onSelectTime(e.target.value)}
            />
        </div>
    );
}


