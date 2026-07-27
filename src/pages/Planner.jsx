import { useEffect, useMemo, useState } from "react";
import EditTaskModal from "../components/planner/EditTaskModal";
import PlannerHeader from "../components/planner/PlannerHeader";
import WeekTimeline from "../components/planner/WeekTimeline";
import TaskTimeline from "../components/planner/TaskTimeline";
import AddTaskModal from "../components/planner/AddTaskModal";
import TaskList from "../components/planner/TaskList";
import TaskSearch from "../components/planner/TaskSearch";
import TaskFilters from "../components/planner/TaskFilters";
import { useNavigate } from "react-router-dom";
import { useTimerContext } from "../context/TimerContext";
import {
  getTasks,
  createTask,
  updateTask,
  deleteTask,
} from "../services/plannerService";


function formatDate(date) {
  const year = date.getFullYear();

  const month = String(
    date.getMonth() + 1
  ).padStart(2, "0");

  const day = String(
    date.getDate()
  ).padStart(2, "0");

  return `${year}-${month}-${day}`;
}


export default function Planner() {

  const navigate = useNavigate();

  const timer = useTimerContext();

  const [selectedDate, setSelectedDate] =
    useState(new Date());

  const [showAddTask, setShowAddTask] =
    useState(false);

  const [editingTask, setEditingTask] = useState(null);

  const [tasks, setTasks] =
    useState([]);

  const [loading, setLoading] =
    useState(true);

  const [error, setError] =
    useState("");

  const [search, setSearch] =
    useState("");

  const [filter, setFilter] =
    useState("all");

  const [sort, setSort] =
    useState("time");


  useEffect(() => {
    async function loadTasks() {
      try {
        setLoading(true);
        setError("");

        const date =
          formatDate(selectedDate);

        const data =
          await getTasks(date);

        setTasks(data.tasks || []);
      } catch (err) {
        console.error(
          "Unable to load tasks:",
          err
        );

        setError(
          "Unable to load tasks."
        );
      } finally {
        setLoading(false);
      }
    }

    loadTasks();
  }, [selectedDate]);


  async function handleCreateTask(task) {
    try {
      setError("");

      const taskData = {
        title: task.title,
        description: task.description,

        date: formatDate(
          task.date
        ),

        start_time:
          task.time || null,

        duration:
          task.duration,

        priority:
          task.priority,

        category:
          task.category,
      };

      const createdTask =
        await createTask(taskData);

      setTasks((currentTasks) => [
        ...currentTasks,
        createdTask,
      ]);

      return true;
    } catch (err) {
      console.error(
        "Unable to create task:",
        err
      );

      setError(
        err.response?.data?.error ||
        "Unable to create task."
      );

      return false;
    }
  }


  async function handleToggleTask(task) {
    try {
      const updatedTask =
        await updateTask(
          task.id,
          {
            completed:
              !task.completed,
          }
        );

      setTasks((currentTasks) =>
        currentTasks.map(
          (currentTask) =>
            currentTask.id ===
              updatedTask.id
              ? updatedTask
              : currentTask
        )
      );
    } catch (err) {
      console.error(
        "Unable to update task:",
        err
      );

      setError(
        "Unable to update task."
      );
    }
  }


  async function handleDeleteTask(task) {
    try {
      await deleteTask(task.id);

      setTasks((currentTasks) =>
        currentTasks.filter(
          (currentTask) =>
            currentTask.id !==
            task.id
        )
      );
    } catch (err) {
      console.error(
        "Unable to delete task:",
        err
      );

      setError(
        "Unable to delete task."
      );
    }
  }


  function handleEditTask(task) {
    setEditingTask(task);
  }

  async function handleSaveTask(task) {
    try {
      setError("");

      const updatedTask = await updateTask(
        task.id,
        {
          title: task.title,
          description: task.description,
          start_time: task.time || null,
          duration: task.duration,
          priority: task.priority,
          category: task.category,
        }
      );

      setTasks((currentTasks) =>
        currentTasks.map((currentTask) =>
          currentTask.id === updatedTask.id
            ? updatedTask
            : currentTask
        )
      );

      setEditingTask(null);
    } catch (err) {
      console.error(
        "Unable to edit task:",
        err
      );

      setError(
        err.response?.data?.error ||
        "Unable to update task."
      );
    }
  }


  function handleStartFocus(task) {
    if (!task.duration) {
      setError(
        "This task does not have a focus duration."
      );
      return;
    }

    // Set timer duration from planner task
    timer.setCustomDuration(
      task.duration,
      false
    );

    // Remember which planner task
    // this focus session belongs to
    timer.selectTask(task);

    navigate("/timer");
  }


  const filteredTasks =
    useMemo(() => {
      let result = [...tasks];

      if (search.trim()) {
        const query =
          search
            .trim()
            .toLowerCase();

        result = result.filter(
          (task) =>
            task.title
              .toLowerCase()
              .includes(query) ||
            task.description
              ?.toLowerCase()
              .includes(query) ||
            task.category
              ?.toLowerCase()
              .includes(query)
        );
      }

      if (filter === "completed") {
        result = result.filter(
          (task) =>
            task.completed
        );
      }

      if (filter === "pending") {
        result = result.filter(
          (task) =>
            !task.completed
        );
      }

      if (filter === "high") {
        result = result.filter(
          (task) =>
            task.priority === "high"
        );
      }

      if (sort === "time") {
        result.sort(
          (a, b) =>
            (
              a.start_time ||
              "23:59"
            ).localeCompare(
              b.start_time ||
              "23:59"
            )
        );
      }

      if (sort === "priority") {
        const priorityOrder = {
          high: 1,
          medium: 2,
          low: 3,
        };

        result.sort(
          (a, b) =>
            priorityOrder[
            a.priority
            ] -
            priorityOrder[
            b.priority
            ]
        );
      }

      return result;
    }, [
      tasks,
      search,
      filter,
      sort,
    ]);


  return (
    <div className="mx-auto max-w-7xl px-8 py-10">

      <PlannerHeader
        onNewTask={() =>
          setShowAddTask(true)
        }
      />

      {error && (
        <div className="mt-5 rounded-xl border border-red-500/20 bg-red-500/10 px-4 py-3 text-sm text-red-400">
          {error}
        </div>
      )}

      <div className="mt-8">

        <WeekTimeline
          selectedDate={
            selectedDate
          }
          onSelectDate={
            setSelectedDate
          }
        />

        <div className="mt-8 flex items-center gap-3">

          <TaskSearch
            value={search}
            onChange={setSearch}
          />

          <TaskFilters
            filter={filter}
            sort={sort}
            onFilterChange={
              setFilter
            }
            onSortChange={
              setSort
            }
          />

        </div>

        <TaskTimeline
          selectedDate={
            selectedDate
          }
        >

          {loading ? (
            <div className="py-16 text-center text-sm text-zinc-500">
              Loading tasks...
            </div>
          ) : (
            <TaskList
              tasks={
                filteredTasks
              }
              onAddTask={() =>
                setShowAddTask(true)
              }
              onToggleTask={
                handleToggleTask
              }
              onEditTask={
                handleEditTask
              }
              onDeleteTask={
                handleDeleteTask
              }
              onStartFocus={
                handleStartFocus
              }
            />
          )}

        </TaskTimeline>

      </div>

      <AddTaskModal
        open={showAddTask}
        selectedDate={
          selectedDate
        }
        onClose={() =>
          setShowAddTask(false)
        }
        onCreate={
          handleCreateTask
        }
      />

      <EditTaskModal
        open={Boolean(editingTask)}
        task={editingTask}
        onClose={() => setEditingTask(null)}
        onSave={handleSaveTask}
      />

    </div>
  );
}