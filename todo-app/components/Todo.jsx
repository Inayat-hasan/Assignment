"use client";
import {
  Box,
  TextField,
  Button,
  Checkbox,
  IconButton,
  Typography,
  Stack,
  Chip,
  Paper,
  CircularProgress,
} from "@mui/material";
import { useState } from "react";
import { Delete, Edit, Save, Notifications, Close } from "@mui/icons-material";
import { toast } from "react-hot-toast";
import { useThemeContext } from "@/contexts/themeContext";
import { DateTimePicker } from "@mui/x-date-pickers/DateTimePicker";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";

const Todo = ({ todo, toggleTodo, deleteTodo, editTodo, loading }) => {
  const [editedTodo, setEditedTodo] = useState({
    text: todo.text,
    reminder: todo.reminder ? new Date(todo.reminder) : null,
  });
  const [isEditing, setIsEditing] = useState(false);
  const { mode } = useThemeContext();

  const handleEditClick = () => {
    setIsEditing(true);
    setEditedTodo({
      text: todo.text,
      reminder: todo.reminder ? new Date(todo.reminder) : null,
    });
  };

  const handleSave = async () => {
    if (!editedTodo.text.trim()) {
      toast.error("Todo text cannot be empty");
      return;
    }

    await editTodo(todo.id, {
      text: editedTodo.text,
      reminder: editedTodo.reminder,
    });
    setIsEditing(false);
  };

  const handleCancelEdit = () => {
    setIsEditing(false);
  };

  return (
    <LocalizationProvider dateAdapter={AdapterDateFns}>
      <Paper
        elevation={2}
        sx={{
          p: 2,
          display: "flex",
          alignItems: "center",
          gap: 2,
          opacity: todo.done ? 0.8 : 1,
          transition: "all 0.2s ease",
        }}
      >
        <Checkbox
          checked={todo.done}
          onChange={() => toggleTodo(todo.id)}
          disabled={loading.updatingTodo || isEditing}
          color="primary"
        />

        <Box sx={{ flexGrow: 1 }}>
          {isEditing ? (
            <>
              <TextField
                fullWidth
                variant="standard"
                value={editedTodo.text}
                onChange={(e) =>
                  setEditedTodo({ ...editedTodo, text: e.target.value })
                }
                sx={{ mb: 2 }}
              />
              <DateTimePicker
                label="Reminder"
                value={editedTodo.reminder}
                onChange={(newValue) =>
                  setEditedTodo({ ...editedTodo, reminder: newValue })
                }
                disablePast
                slotProps={{
                  textField: {
                    fullWidth: true,
                    variant: "standard",
                  },
                }}
              />
            </>
          ) : (
            <>
              <Typography
                variant="body1"
                sx={{
                  textDecoration: todo.done ? "line-through" : "none",
                  color: todo.done ? "text.disabled" : "text.primary",
                }}
              >
                {todo.text}
              </Typography>
              {todo.reminder && (
                <Chip
                  icon={<Notifications fontSize="small" />}
                  label={new Date(todo.reminder).toLocaleString()}
                  size="small"
                  color="primary"
                  variant="outlined"
                  sx={{ mt: 1 }}
                />
              )}
            </>
          )}
        </Box>

        <Stack direction="row" spacing={1}>
          {isEditing ? (
            <>
              <IconButton
                onClick={handleSave}
                color="primary"
                disabled={loading.updatingTodo}
              >
                <Save />
              </IconButton>
              <IconButton onClick={handleCancelEdit} color="secondary">
                <Close />
              </IconButton>
            </>
          ) : (
            <>
              <IconButton
                onClick={handleEditClick}
                color="primary"
                disabled={loading.updatingTodo || loading.deletingTodo}
              >
                <Edit />
              </IconButton>
              <IconButton
                onClick={() => deleteTodo(todo.id)}
                color="error"
                disabled={loading.deletingTodo}
              >
                {loading.deletingTodo ? (
                  <CircularProgress size={24} />
                ) : (
                  <Delete />
                )}
              </IconButton>
            </>
          )}
        </Stack>
      </Paper>
    </LocalizationProvider>
  );
};

export default Todo;
