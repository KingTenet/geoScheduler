// ~/apps/nextjs/src/app/_components/TaskSelector.tsx
import { Label } from "@GeoScheduler/ui/label";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@GeoScheduler/ui/select";

interface TaskSelectorProps {
    selectedTask: string;
    onSelectTask: (task: string) => void;
}

export function TaskSelector({
    selectedTask,
    onSelectTask,
}: TaskSelectorProps) {
    const tasks = ["Work", "Study", "Exercise", "Meditation", "Custom"];

    return (
        <div className="space-y-2">
            <Label htmlFor="task">Select a task</Label>
            <Select value={selectedTask} onValueChange={onSelectTask}>
                <SelectTrigger id="task">
                    <SelectValue placeholder="Select a task" />
                </SelectTrigger>
                <SelectContent>
                    {tasks.map((task) => (
                        <SelectItem key={task} value={task}>
                            {task}
                        </SelectItem>
                    ))}
                </SelectContent>
            </Select>
        </div>
    );
}
