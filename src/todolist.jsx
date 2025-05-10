import React, { useState, useEffect, useRef } from "react";
import backgroundImage from "./pics/magic.jpeg";
import "./todolist.css";

const TodoList = () => {
  // Load from localStorage
  const [todos, setTodos] = useState(() => {
    const saved = localStorage.getItem("todos");
    return saved ? JSON.parse(saved) : [];
  });

  // Modal state for adding
  const [showModal, setShowModal] = useState(false);
  const [newTitle, setNewTitle] = useState("");
  const [newDescription, setNewDescription] = useState("");
  const [newDueDate, setNewDueDate] = useState("");
  const [modalHeight, setModalHeight] = useState(200);

  // Edit state
  const [editingIndex, setEditingIndex] = useState(null);
  const [editingTitle, setEditingTitle] = useState("");
  const [editingDescription, setEditingDescription] = useState("");
  const [editingDueDate, setEditingDueDate] = useState("");
  const editTitleRef = useRef(null);
  const editDescriptionRef = useRef(null);

  // Persist to localStorage
  useEffect(() => {
    localStorage.setItem("todos", JSON.stringify(todos));
  }, [todos]);

  // Days left calculation
  const calculateDaysLeft = (dueDate) => {
    if (!dueDate) return null;
    const today = new Date();
    const due = new Date(dueDate);
    const diffTime = due - today;
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  };

  // Add new todo
  const handleAddTodo = () => {
    if (!newTitle.trim()) {
      alert("Title cannot be empty");
      return;
    }
    const todayStr = new Date().toISOString().split("T")[0];
    const newTodo = {
      title: newTitle.trim(),
      description: newDescription.trim(),
      completed: false,
      date: todayStr,
      dueDate: newDueDate || null,
      showDescription: false,
      completedOn: null,
    };
    setTodos((prev) => [...prev, newTodo]);
    setShowModal(false);
    setNewTitle("");
    setNewDescription("");
    setNewDueDate("");
    setModalHeight(200);
  };

  // Delete
  const handleDeleteTodo = (index) => {
    setTodos((prev) => prev.filter((_, i) => i !== index));
    if (editingIndex === index) setEditingIndex(null);
  };

  // Toggle completed
  const handleToggleCompleted = (index) => {
    setTodos((prev) =>
      prev.map((todo, i) =>
        i === index
          ? {
              ...todo,
              completed: !todo.completed,
              completedOn: !todo.completed ? new Date().toISOString().split("T")[0] : null,
            }
          : todo
      )
    );
  };

  // Toggle description
  const toggleDescription = (index) => {
    setTodos((prev) =>
      prev.map((todo, i) =>
        i === index ? { ...todo, showDescription: !todo.showDescription } : todo
      )
    );
  };

  // Modal textarea height
  const handleDescriptionChange = (e) => {
    setNewDescription(e.target.value);
    const lines = e.target.value.split("\n").length;
    setModalHeight(200 + lines * 20);
  };

  // Start editing
  const startEditTask = (index) => {
    setEditingIndex(index);
    setEditingTitle(todos[index].title);
    setEditingDescription(todos[index].description);
    setEditingDueDate(todos[index].dueDate || "");
    setTimeout(() => {
      if (editTitleRef.current) editTitleRef.current.focus();
    }, 100);
  };

  // Save edit on blur
  const saveEditOnBlur = (index) => {
    setTimeout(() => {
      if (
        document.activeElement !== editTitleRef.current &&
        document.activeElement !== editDescriptionRef.current
      ) {
        const updatedTodos = [...todos];
        updatedTodos[index] = {
          ...updatedTodos[index],
          title: editingTitle,
          description: editingDescription,
          dueDate: editingDueDate,
        };
        setTodos(updatedTodos);
        setEditingIndex(null);
      }
    }, 100);
  };

  // Inline due date edit
  const handleEditDueDate = (e) => setEditingDueDate(e.target.value);

  // Display title
  const getDisplayTitle = (todo) => {
    if (todo.title.length > 15) {
      return todo.title.slice(0, 15) + "...";
    }
    return todo.title;
  };

  // Separate tasks
  const incompleteTodos = todos.filter((t) => !t.completed);
  const completedTodos = todos.filter((t) => t.completed);

  return (
    <div
      className="todo-bg"
      style={{
        backgroundImage: `url(${backgroundImage})`,
      }}
    >
      <div className="todo-container">
        <div className="todo-header-row">
          <h2 className="todo-header">
            To do List
            <span className="todo-count">{incompleteTodos.length}</span>
          </h2>
        </div>

        <div className="todo-add-row">
          <button onClick={() => setShowModal(true)} className="todo-add-btn">
            Add Task
          </button>
        </div>

        {showModal && (
          <div className="todo-modal-backdrop">
            <div className="todo-modal">
              <h3>Add New Task</h3>
              <input
                type="text"
                placeholder="Title"
                value={newTitle}
                onChange={(e) => setNewTitle(e.target.value)}
                className="todo-input"
              />
              <textarea
                placeholder="Description"
                value={newDescription}
                onChange={handleDescriptionChange}
                className="todo-textarea"
              />
              <input
              type="date"
              value={newDueDate}
              onChange={(e) => setNewDueDate(e.target.value)}
              className="edit-input no-border"
            />
              <div className="todo-modal-btn-row">
                <button
                  onClick={() => {
                    setShowModal(false);
                    setNewTitle("");
                    setNewDescription("");
                    setNewDueDate("");
                  }}
                  className="todo-cancel-btn"
                >
                  Cancel
                </button>
                <button onClick={handleAddTodo} className="todo-confirm-btn">
                  Confirm
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Incomplete Tasks */}
        <ul className="todo-list">
          {incompleteTodos.map((todo, index) => {
            const originalIndex = todos.indexOf(todo);
            const daysLeft = calculateDaysLeft(todo.dueDate);
            return (
              <li
                key={originalIndex}
                className={`todo-item column ${editingIndex === originalIndex ? "editing" : ""}`}
              >
                <input
                  type="checkbox"
                  checked={todo.completed}
                  onChange={() => handleToggleCompleted(originalIndex)}
                  style={{ marginRight: "10px", marginTop: "7px" }}
                  disabled={editingIndex === originalIndex}
                />

                {editingIndex === originalIndex ? (
                  <div className="edit-section">
                    <input
                      ref={editTitleRef}
                      type="text"
                      value={editingTitle}
                      onChange={(e) => setEditingTitle(e.target.value)}
                      onBlur={() => saveEditOnBlur(originalIndex)}
                      className="edit-input no-border"
                      placeholder="Edit title"
                      autoFocus
                    />
                    <textarea
                      ref={editDescriptionRef}
                      value={editingDescription}
                      onChange={(e) => setEditingDescription(e.target.value)}
                      onBlur={() => saveEditOnBlur(originalIndex)}
                      className="edit-input no-border no-resize"
                      rows="2"
                      placeholder="Edit description"
                    />
                    <input
                      type="date"
                      value={editingDueDate}
                      onChange={handleEditDueDate}
                      onBlur={() => saveEditOnBlur(originalIndex)}
                      className="edit-input no-border"
                    />
                  </div>
                ) : (
                  <>
                    <div
                      onClick={() => startEditTask(originalIndex)}
                      className={`task-text-group${todo.completed ? " completed-task" : ""}`}
                      style={{ flex: 1 }}
                    >
                      <strong>{getDisplayTitle(todo)}</strong>
                      <p className="task-desc">{todo.description}</p>
                      <div className="todo-meta">Added on: {todo.date}</div>
                      <div className="todo-meta">
                        {todo.dueDate ? `Due: ${todo.dueDate}` : "No due date"}
                      </div>
                    </div>
                    <div className="todo-status-row">
                      <span
                        className={`todo-status${
                          todo.completed
                            ? " completed"
                            : daysLeft < 0
                            ? " overdue"
                            : " pending"
                        }`}
                      >
                        {todo.completed
                          ? "Completed"
                          : daysLeft < 0
                          ? `Overdue by ${Math.abs(daysLeft)} day(s)`
                          : daysLeft !== null
                          ? `${daysLeft} day(s) left`
                          : "No due date"}
                      </span>
                      <button
                        onClick={() => handleDeleteTodo(originalIndex)}
                        className="todo-delete-btn"
                        aria-label="Delete task"
                        title="Delete task"
                      >
                        ×
                      </button>
                    </div>
                  </>
                )}
              </li>
            );
          })}
        </ul>

        {/* Completed Tasks */}
        {completedTodos.length > 0 && (
          <>
            <h2 className="complete-task">
              Completed Tasks
            </h2>
            <ul className="todo-list">
              {completedTodos.map((todo, index) => {
                const originalIndex = todos.indexOf(todo);
                return (
                  <li
                    key={originalIndex}
                    className={`todo-item column ${editingIndex === originalIndex ? "editing" : ""}`}
                  >
                    <input
                      type="checkbox"
                      checked={todo.completed}
                      onChange={() => handleToggleCompleted(originalIndex)}
                      style={{ marginRight: "10px", marginTop: "7px" }}
                      disabled={editingIndex === originalIndex}
                    />

                    {editingIndex === originalIndex ? (
                      <div className="edit-section">
                        <input
                          ref={editTitleRef}
                          type="text"
                          value={editingTitle}
                          onChange={(e) => setEditingTitle(e.target.value)}
                          onBlur={() => saveEditOnBlur(originalIndex)}
                          className="edit-input no-border"
                          placeholder="Edit title"
                          autoFocus
                        />
                        <textarea
                          ref={editDescriptionRef}
                          value={editingDescription}
                          onChange={(e) => setEditingDescription(e.target.value)}
                          onBlur={() => saveEditOnBlur(originalIndex)}
                          className="edit-input no-border no-resize"
                          rows="2"
                          placeholder="Edit description"
                        />
                        <input
                          type="date"
                          value={editingDueDate}
                          onChange={handleEditDueDate}
                          onBlur={() => saveEditOnBlur(originalIndex)}
                          className="edit-input no-border"
                        />
                      </div>
                    ) : (
                      <>
                        <div
                          onClick={() => startEditTask(originalIndex)}
                          className={`task-text-group${todo.completed ? " completed-task" : ""}`}
                          style={{ flex: 1 }}
                        >
                          <strong>{getDisplayTitle(todo)}</strong>
                          <p className="task-desc">{todo.description}</p>
                          <div className="todo-meta">Added on: {todo.date}</div>
                          <div className="todo-meta">
                            {todo.completed && todo.completedOn
                              ? `Completed on: ${todo.completedOn}`
                              : todo.dueDate
                              ? `Due: ${todo.dueDate}`
                              : null}
                          </div>
                        </div>
                        <button
                          onClick={() => handleDeleteTodo(originalIndex)}
                          className="todo-delete-btn"
                          aria-label="Delete task"
                          title="Delete task"
                        >
                          ×
                        </button>
                      </>
                    )}
                  </li>
                );
              })}
            </ul>
          </>
        )}
      </div>
    </div>
  );
};

export default TodoList;
