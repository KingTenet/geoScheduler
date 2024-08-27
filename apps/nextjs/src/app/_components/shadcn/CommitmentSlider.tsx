// ~/apps/nextjs/src/app/_components/CommitmentPeriod.tsx
import { Input } from "@GeoScheduler/ui/input";
import { Label } from "@GeoScheduler/ui/label";

interface CommitmentPeriodProps {
    commitmentPeriod: number;
    onSetCommitmentPeriod: (days: number) => void;
}

export default function CommitmentSlider({
    commitmentPeriod,
    onSetCommitmentPeriod,
}: CommitmentPeriodProps) {
    return (
        <div className="space-y-2">
            <Label htmlFor="commitment">Commitment Period (days)</Label>
            <Input
                id="commitment"
                type="number"
                min="0"
                value={commitmentPeriod}
                onChange={(e) =>
                    onSetCommitmentPeriod(parseInt(e.target.value, 10))
                }
            />
        </div>
    );
}
