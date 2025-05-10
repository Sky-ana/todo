import React, { useState, useEffect } from "react";
import backgroundImage from "./pics/magic.jpeg";

const TodoList = () => {
    const [todos, setTodos] = useState([]);
    const [showModal, setShowModal] = useState(false);
    const [newTitle, setNewTitle] = useState("");
    const [newDescription, setNewDescription] = useState("");
    const [newDueDate, setNewDueDate] = useState("");
    const [expandedTasks, setExpandedTasks] = useState([]);

    useEffect(() => {
        const storedTodos = JSON.parse(localStorage.getItem("todos"));
        if (storedTodos) {
            setTodos(storedTodos);
        }
    }, []);

    useEffect(() => {
        localStorage.setItem("todos", JSON.stringify(todos));
    }, [todos]);

    const handleAddTodo = () => {
        if (newTitle.trim() !== "" || newDescription.trim() !== "") {
            const currentDate = new Date().toLocaleString();
            setTodos([
                ...todos,
                {
                    title: newTitle,
                    description: newDescription,
                    dueDate: newDueDate,
                    completed: false,
                    date: currentDate,
                },
            ]);
            setNewTitle("");
            setNewDescription("");
            setNewDueDate("");
            setShowModal(false);
        }
    };

    const handleToggleCompleted = (index) => {
        const updatedTodos = todos.map((todo, i) => {
            if (i === index) {
                const isNowCompleted = !todo.completed;
                return {
                    ...todo,
                    completed: isNowCompleted,
                    completedOn: isNowCompleted ? new Date().toLocaleString() : undefined,
                };
            }
            return todo;
        });
        setTodos(updatedTodos);
    };

    const handleDeleteTodo = (index) => {
        setTodos(todos.filter((_, i) => i !== index));
    };

    const toggleDescription = (index) => {
        setExpandedTasks((prev) =>
            prev.includes(index)
                ? prev.filter((i) => i !== index)
                : [...prev, index]
        );
    };

    const calculateDaysLeft = (dueDateStr) => {
        if (!dueDateStr) return null;
        const now = new Date();
        const dueDate = new Date(dueDateStr + "T23:59:59");
        const diffTime = dueDate - now;
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
        return diffDays;
    };

    return (
        <div
            style={{
                minHeight: "100vh",
                padding: "20px",
                backgroundImage: `url(${backgroundImage})`,
                backgroundSize: "cover",
                backgroundPosition: "center",
                backgroundRepeat: "no-repeat",
                backgroundAttachment: "fixed",
            }}
        >
            <h2 style={{ color: "white", textShadow: "1px 1px 2px black", display: "flex", alignItems: "center", gap: "10px" }}>
                Todo List
                <span
                    style={{
                        background: "rgba(255, 255, 255, 0.7)",
                        padding: "4px 10px",
                        borderRadius: "8px",
                        fontSize: "16px",
                        color: "#333",
                    }}
                >
                    {todos.length}
                </span>
            </h2>

            <div style={{ textAlign: "right", marginBottom: "10px" }}>
                <button
                    onClick={() => setShowModal(true)}
                    style={{
                        padding: "10px 15px",
                        fontSize: "16px",
                        backgroundColor: "#0066cc",
                        color: "white",
                        border: "none",
                        borderRadius: "5px",
                        cursor: "pointer",
                    }}
                >
                    Add Task
                </button>
            </div>

            {showModal && (
                <div
                    style={{
                        position: "fixed",
                        top: 0,
                        left: 0,
                        width: "100vw",
                        height: "100vh",
                        backgroundColor: "rgba(0, 0, 0, 0.5)",
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                        zIndex: 1000,
                    }}
                >
                    <div
                        style={{
                            backgroundColor: "white",
                            borderRadius: "10px",
                            padding: "20px",
                            width: "300px",
                            boxShadow: "0 0 10px rgba(0,0,0,0.3)",
                        }}
                    >
                        <h3>Add New Task</h3>
                        <input
                            type="text"
                            placeholder="Title"
                            value={newTitle}
                            onChange={(e) => setNewTitle(e.target.value)}
                            style={{ width: "100%", marginBottom: "10px", padding: "5px" }}
                        />
                        <textarea
                            placeholder="Description"
                            value={newDescription}
                            onChange={(e) => setNewDescription(e.target.value)}
                            style={{ width: "100%", marginBottom: "10px", padding: "5px" }}
                            rows={Math.max(3, newDescription.split("\n").length)}
                        />
                        <input
                            type="date"
                            value={newDueDate}
                            onChange={(e) => setNewDueDate(e.target.value)}
                            style={{ width: "100%", marginBottom: "10px", padding: "5px" }}
                        />
                        <div style={{ display: "flex", justifyContent: "space-between" }}>
                            <button
                                onClick={() => {
                                    setShowModal(false);
                                    setNewTitle("");
                                    setNewDescription("");
                                    setNewDueDate("");
                                }}
                                style={{
                                    backgroundColor: "#aaa",
                                    color: "white",
                                    border: "none",
                                    padding: "5px 10px",
                                    borderRadius: "5px",
                                }}
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleAddTodo}
                                style={{
                                    backgroundColor: "#28a745",
                                    color: "white",
                                    border: "none",
                                    padding: "5px 10px",
                                    borderRadius: "5px",
                                }}
                            >
                                Confirm
                            </button>
                        </div>
                    </div>
                </div>
            )}

            <ul style={{ listStyle: "none", padding: 0, marginTop: "20px" }}>
                {todos.map((todo, index) => {
                    const daysLeft = calculateDaysLeft(todo.dueDate);
                    return (
                        <li
                            key={index}
                            style={{
                                border: "1px solid #ccc",
                                borderRadius: "8px",
                                padding: "10px",
                                marginBottom: "10px",
                                background: "rgba(255, 255, 255, 0.7)",
                                backdropFilter: "blur(4px)",
                                wordWrap: "break-word",
                                overflowWrap: "break-word",
                            }}
                        >
                            <div style={{ display: "flex", alignItems: "center" }}>
                                <input
                                    type="checkbox"
                                    checked={todo.completed}
                                    onChange={() => handleToggleCompleted(index)}
                                />
                                <div
                                    onClick={() => toggleDescription(index)}
                                    style={{
                                        marginLeft: "10px",
                                        flex: 1,
                                        cursor: "pointer",
                                        wordWrap: "break-word",
                                    }}
                                >
                                    <div
                                        style={{
                                            fontWeight: "bold",
                                            textDecoration: todo.completed ? "line-through" : "none",
                                        }}
                                    >
                                        {todo.title}
                                    </div>
                                    <div style={{ fontSize: "12px", color: "#333" }}>
                                        Date Added: {todo.date}
                                    </div>
                                    {todo.dueDate && (
                                        <div style={{ fontSize: "12px", color: "#333" }}>
                                            Due Date: {todo.dueDate}
                                        </div>
                                    )}
                                </div>
                                <div style={{ fontSize: "12px", fontWeight: "bold", marginLeft: "10px", textAlign: "right" }}>
                                    {todo.completed && todo.completedOn
                                        ? `Completed: ${todo.completedOn}`
                                        : todo.dueDate
                                        ? daysLeft < 0
                                            ? `Overdue by ${Math.abs(daysLeft)}d`
                                            : `${daysLeft}d left`
                                        : ""}
                                </div>
                                <button
                                    onClick={() => handleDeleteTodo(index)}
                                    style={{
                                        background: "transparent",
                                        color: "red",
                                        border: "none",
                                        fontSize: "20px",
                                        fontWeight: "bold",
                                        cursor: "pointer",
                                        marginLeft: "10px",
                                    }}
                                >
                                    ×
                                </button>
                            </div>
                            {expandedTasks.includes(index) && todo.description && (
                                <div style={{ marginTop: "8px", fontStyle: "italic" }}>{todo.description}</div>
                            )}
                        </li>
                    );
                })}
            </ul>
        </div>
    );
};

export default TodoList;
