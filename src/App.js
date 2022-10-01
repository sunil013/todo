import React, { useEffect } from "react";
import { FaGithub } from "react-icons/fa";
import { v4 as uuid } from "uuid";
import { DragDropContext } from "react-beautiful-dnd";
import List from "./List";
import { useGlobalContext } from "./context";

const App = () => {
  const {
    inputRef,
    tasks,
    setTasks,
    editId,
    name,
    setName,
    filter,
    setFilter,
  } = useGlobalContext();

  const addTask = (e) => {
    e.preventDefault();
    if (!name) {
      alert("Invalid Task Name!");
    } else if (name) {
      setTasks(
        tasks.map((task) => {
          return task.id === editId ? { ...task, name: name } : task;
        })
      );
      setName("");
    } else {
      const newTask = {
        id: uuid().slice(0, 8),
        name: name,
        completed: false,
        color: "#009688",
      };
      setTasks([...tasks, newTask]);
      setName("");
    }
  };

  const filterTasks = (e) => {
    setFilter(e.target.dataset["filter"]);
  };

  const deleteAll = () => {
    setTasks([]);
  };

  useEffect(() => {
    inputRef.current.focus();
    localStorage.setItem("tasks", JSON.stringify(tasks));
  }, [inputRef, tasks]);

  const handleDragEnd = (param) => {
    const srcI = param.source.index;
    const desI = param.destination?.index;
    if (desI) {
      const reOrdered = [...tasks];
      reOrdered.splice(desI, 0, reOrdered.splice(srcI, 1)[0]);
      setTasks(reOrdered);
    }
  };

  const hideColorsContainer = (e) => {
    //   body.
    if (e.target.classList.contains("btn-colors")) return;
  };

  return (
    <>
      <div className="container" onClick={hideColorsContainer}>
        <form className="head" onSubmit={addTask}>
          <input
            type="text"
            ref={inputRef}
            placeholder="New Task"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
          <button type="submit">Add</button>
        </form>
        <div className="filter">
          <button
            data-filter="all"
            className={filter === "all" ? "active" : ""}
            onClick={filterTasks}
          >
            All
          </button>
          <button
            data-filter="completed"
            className={filter === "completed" ? "active" : ""}
            onClick={filterTasks}
          >
            Completed
          </button>
          <button
            data-filter="uncompleted"
            className={filter === "uncompleted" ? "active" : ""}
            onClick={filterTasks}
          >
            Uncompleted
          </button>
        </div>
        <DragDropContext onDragEnd={handleDragEnd}>
          {tasks.length > 0 ? (
            <List />
          ) : (
            <p className="no-tasks">Your list is clear!</p>
          )}
        </DragDropContext>
        {tasks.length > 2 && (
          <button
            className="btn-delete-all"
            onClick={deleteAll}
            title="Delete All Tasks (Completed and Uncompleted)!"
          >
            Clear All
          </button>
        )}
      </div>
      <div class="footer">
        <a
          href="https://github.com/sunil013"
          target="_blank"
          rel="noopener noreferrer"
        >
          <FaGithub className="github" />
        </a>
      </div>
    </>
  );
};

export default App;
