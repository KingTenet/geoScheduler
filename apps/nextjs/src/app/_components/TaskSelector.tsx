import React from "react";
import { Box, Button } from "@mui/material";

interface TaskSelectorProps {
  taskOptions: string[];
  selectedTasks: Record<string, boolean>;
  onToggleTask: (task: string) => void;
}

export function TaskSelector({ taskOptions, selectedTasks, onToggleTask }: TaskSelectorProps) {
  return (
    <Box sx={{ display: "flex", justifyContent: "space-between", flexWrap: "wrap", gap: 2, mb: 4 }}>
      {taskOptions.map((task) => (
        <Button
          key={task}
          variant={selectedTasks[task] ? "contained" : "outlined"}
          onClick={() => onToggleTask(task)}
          sx={{ minWidth: "100px" }}
        >
          {task}
        </Button>
      ))}
    </Box>
  );
}
