"use client";
import Todo from "@/components/Todo";
import { useAuth } from "@/contexts/authContext";
import { useState, useEffect } from "react";
import {
  addDoc,
  deleteDoc,
  updateDoc,
  getDocs,
  serverTimestamp,
  collection,
  doc,
} from "firebase/firestore";
import { db } from "@/lib/firebase";
import {
  Box,
  Typography,
  TextField,
  Button,
  CircularProgress,
  Paper,
  Container,
  Stack,
  Divider,
} from "@mui/material";
import { Add, Notifications } from "@mui/icons-material";
import { toast, Toaster } from "react-hot-toast";
import { useThemeContext } from "@/contexts/themeContext";
import { generateToken, initMessaging, listenForMessages } from "@/lib/fcm";
import { DateTimePicker } from "@mui/x-date-pickers/DateTimePicker";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";

const page = () => {
  const { user } = useAuth();
  const [todos, setTodos] = useState([]);
  const [newTodo, setNewTodo] = useState("");
  const [reminderTime, setReminderTime] = useState(null);
  const [loading, setLoading] = useState({
    fetchingTodos: false,
    addingTodo: false,
    deletingTodo: false,
    updatingTodo: false,
  });
  const { mode } = useThemeContext();

  const addTodo = async (e) => {
    e.preventDefault();
    if (!newTodo.trim()) {
      toast.error("Todo text cannot be empty");
      return;
    }

    setLoading({ ...loading, addingTodo: true });
    try {
      const docRef = await addDoc(collection(db, "tasks"), {
        text: newTodo,
        done: false,
        reminder: reminderTime || null,
        timestamp: serverTimestamp(),
      });

      setTodos([
        ...todos,
        {
          id: docRef.id,
          text: newTodo,
          done: false,
          reminder: reminderTime || null,
        },
      ]);

      setNewTodo("");
      setReminderTime(null);
      toast.success("Todo added successfully");
    } catch (error) {
      console.error("Error adding todo:", error);
      toast.error("Failed to add todo");
    } finally {
      setLoading({ ...loading, addingTodo: false });
    }
  };

  const deleteTodo = async (id) => {
    setLoading({ ...loading, deletingTodo: true });
    const previousTodos = todos;
    try {
      setTodos(todos.filter((todo) => todo.id !== id));
      await deleteDoc(doc(db, "tasks", id));
      toast.success("Todo deleted successfully");
    } catch (error) {
      setTodos(previousTodos);
      toast.error(error.message);
    } finally {
      setLoading({ ...loading, deletingTodo: false });
    }
  };

  const toggleTodo = async (id) => {
    setLoading({ ...loading, updatingTodo: true });
    const prevTodos = todos;
    try {
      setTodos(
        todos.map((todo) =>
          todo.id === id ? { ...todo, done: !todo.done } : todo
        )
      );
      await updateDoc(doc(db, "tasks", id), {
        done: !prevTodos.find((todo) => todo.id === id).done,
      });
    } catch (error) {
      setTodos(prevTodos);
      toast.error(error.message);
    } finally {
      setLoading({ ...loading, updatingTodo: false });
    }
  };

  const editTodo = async (id, editedTodo) => {
    setLoading({ ...loading, updatingTodo: true });
    try {
      await updateDoc(doc(db, "tasks", id), {
        text: editedTodo.text,
        reminder: editedTodo.reminder,
      });

      setTodos(
        todos.map((todo) =>
          todo.id === id
            ? { ...todo, text: editedTodo.text, reminder: editedTodo.reminder }
            : todo
        )
      );
      toast.success("Todo updated successfully");
    } catch (error) {
      toast.error(error.message);
    } finally {
      setLoading({ ...loading, updatingTodo: false });
    }
  };

  useEffect(() => {
    const fetchTodos = async () => {
      setLoading({ ...loading, fetchingTodos: true });
      try {
        const querySnapshot = await getDocs(collection(db, "tasks"));
        const data = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setTodos(data);
      } catch (error) {
        console.error("Error fetching todos:", error);
        toast.error("Failed to load todos");
      } finally {
        setLoading({ ...loading, fetchingTodos: false });
      }
    };

    fetchTodos();
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      const now = new Date();
      todos.forEach((todo) => {
        if (todo.reminder && new Date(todo.reminder) <= now) {
          toast(`Reminder: ${todo.text}`, {
            icon: <Notifications color="primary" />,
            duration: 10000,
          });
          // Remove the reminder after showing
          setTodos(
            todos.map((t) => (t.id === todo.id ? { ...t, reminder: null } : t))
          );
        }
      });
    }, 60000);

    return () => clearInterval(interval);
  }, [todos]);

  useEffect(() => {
    const setupFCM = async () => {
      const messaging = await initMessaging();
      if (messaging) {
        await generateToken(messaging);
        listenForMessages(messaging);
      }
    };

    setupFCM();
  }, []);

  return (
    <LocalizationProvider dateAdapter={AdapterDateFns}>
      <Container maxWidth="md" sx={{ py: 4 }}>
        <Box sx={{ mb: 4 }}>
          <Typography variant="h3" component="h1" gutterBottom>
            Todo App
          </Typography>
          {user && (
            <Typography variant="subtitle1" color="text.secondary">
              Welcome back, {user.displayName}
            </Typography>
          )}
        </Box>

        <Paper component="form" onSubmit={addTodo} sx={{ p: 3, mb: 4 }}>
          <Stack direction={{ xs: "column", sm: "row" }} spacing={2}>
            <TextField
              fullWidth
              variant="outlined"
              label="What needs to be done?"
              value={newTodo}
              onChange={(e) => setNewTodo(e.target.value)}
              disabled={loading.addingTodo}
            />
            <DateTimePicker
              label="Reminder"
              value={reminderTime}
              onChange={(newValue) => setReminderTime(newValue)}
              disablePast
              slotProps={{
                textField: {
                  fullWidth: true,
                },
              }}
            />

            <Button
              type="submit"
              variant="contained"
              color="primary"
              size="large"
              startIcon={<Add />}
              disabled={!newTodo.trim() || loading.addingTodo}
              sx={{ minWidth: 150 }}
            >
              {loading.addingTodo ? (
                <CircularProgress size={24} color="inherit" />
              ) : (
                "Add Todo"
              )}
            </Button>
          </Stack>
        </Paper>

        {loading.fetchingTodos ? (
          <Box sx={{ display: "flex", justifyContent: "center", py: 4 }}>
            <CircularProgress />
          </Box>
        ) : todos.length === 0 ? (
          <Paper sx={{ p: 3, textAlign: "center" }}>
            <Typography variant="body1" color="text.secondary">
              No todos yet. Add your first task!
            </Typography>
          </Paper>
        ) : (
          <Stack spacing={2} divider={<Divider />}>
            {todos.map((todo) => (
              <Todo
                key={todo.id}
                todo={todo}
                deleteTodo={deleteTodo}
                editTodo={editTodo}
                toggleTodo={toggleTodo}
                loading={loading}
              />
            ))}
          </Stack>
        )}

        <Toaster position="top-right" />
      </Container>
    </LocalizationProvider>
  );
};

export default page;
