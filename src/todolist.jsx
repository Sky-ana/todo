import React, { useState, useEffect } from "react";
import backgroundImage from "./pics/magic.jpeg";

const TodoList = () => {
    const [todos, setTodos] = useState([]);
    const [showModal, setShowModal] = useState(false);
    const [newTitle, setNewTitle] = useState("");
    const [newDescription, setNewDescription] = useState("");
    const [newDueDate, setNewDueDate] = useState("");
    const [expandedIndex, setExpandedIndex] = useState(null);

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
                        fontWeight: "bold",
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

            {/* Modal */}
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
                            width: newDescription.length > 100 ? "400px" : "300px",
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
                    const isExpanded = expandedIndex === index;

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
                                overflowWrap: "break-word",
                            }}
                        >
                            <div
                                style={{ display: "flex", alignItems: "center", justifyContent: "space-between", cursor: "pointer" }}
                                onClick={() => setExpandedIndex(isExpanded ? null : index)}
                            >
                                <div style={{ display: "flex", alignItems: "center", flex: 1 }}>
                                    <input
                                        type="checkbox"
                                        checked={todo.completed}
                                        onChange={(e) => {
                                            e.stopPropagation();
                                            handleToggleCompleted(index);
                                        }}
                                    />
                                    <span
                                        style={{
                                            textDecoration: todo.completed ? "line-through" : "none",
                                            marginLeft: "10px",
                                            fontWeight: "bold",
                                            wordBreak: "break-word",
                                        }}
                                    >
                                        {todo.title}
                                    </span>
                                </div>
                                <div
                                    style={{
                                        fontSize: "12px",
                                        fontWeight: "bold",
                                        marginLeft: "10px",
                                        textAlign: "right",
                                        color: todo.completed && todo.completedOn
                                            ? "#28a745"
                                            : daysLeft < 0
                                            ? "red"
                                            : "#333",
                                    }}
                                >
                                    {todo.completed && todo.completedOn
                                        ? `Completed: ${todo.completedOn}`
                                        : todo.dueDate
                                        ? daysLeft < 0
                                            ? `Overdue by ${Math.abs(daysLeft)} day(s)`
                                            : `${daysLeft} day(s) left`
                                        : ""}
                                </div>
                                <button
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        handleDeleteTodo(index);
                                    }}
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

                            {isExpanded && (
                                <>
                                    {todo.description && (
                                        <div style={{ marginTop: "5px", fontStyle: "italic" }}>
                                            {todo.description}
                                        </div>
                                    )}
                                    <div style={{ fontSize: "12px", color: "#555", marginTop: "5px" }}>
                                        Added on: {todo.date}
                                    </div>
                                    {todo.dueDate && (
                                        <div style={{ fontSize: "12px", color: "#555" }}>
                                            Due date: {todo.dueDate}
                                        </div>
                                    )}
                                </>
                            )}
                        </li>
                    );
                })}
            </ul>
        </div>
    );
};

export default TodoList;
