import React, { useState, useEffect } from "react";
import backgroundImage from "./pics/magic.jpeg";

const TodoList = () => {
    const [todos, setTodos] = useState([]);
    const [showModal, setShowModal] = useState(false);
    const [newTitle, setNewTitle] = useState("");
    const [newDescription, setNewDescription] = useState("");
    const [newDueDate, setNewDueDate] = useState("");
    const [modalHeight, setModalHeight] = useState(300);

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
                    showDescription: false,
                    completedOn: null,
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
                    completedOn: isNowCompleted ? new Date().toLocaleString() : null,
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
        setTodos(todos.map((todo, i) =>
            i === index ? { ...todo, showDescription: !todo.showDescription } : todo
        ));
    };

    const handleDescriptionChange = (e) => {
        setNewDescription(e.target.value);
        setModalHeight(e.target.scrollHeight + 200);
    };

    const calculateDaysLeft = (dueDateStr) => {
        if (!dueDateStr) return null;
        const now = new Date();
        const dueDate = new Date(dueDateStr + "T23:59:59");
        const diffTime = dueDate - now;
        return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    };

    const getDisplayTitle = (todo) => {
        return todo.showDescription ? todo.title : (todo.title.length <= 10 ? todo.title : `${todo.title.slice(0, 5)}...`);
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
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <h2 style={{ color: "white", textShadow: "1px 1px 2px black", display: "flex", alignItems: "center", gap: "10px" }}>
                    Todo List
                    <span style={{
                        padding: "5px 10px",
                        background: "rgba(255, 255, 255, 0.7)",
                        borderRadius: "8px",
                        backdropFilter: "blur(4px)",
                        boxShadow: "0 2px 4px rgba(0,0,0,0.2)",
                        fontSize: "16px",
                        color: "#333"
                    }}>
                        {todos.length}
                    </span>
                </h2>
            </div>

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
                <div style={{
                    position: "fixed",
                    top: 0, left: 0,
                    width: "100vw", height: "100vh",
                    backgroundColor: "rgba(0, 0, 0, 0.5)",
                    display: "flex", justifyContent: "center", alignItems: "center",
                    zIndex: 1000,
                }}>
                    <div style={{
                        backgroundColor: "white",
                        borderRadius: "10px",
                        padding: "20px",
                        width: "300px",
                        boxShadow: "0 0 10px rgba(0,0,0,0.3)",
                        height: `${modalHeight}px`,
                        overflow: "hidden",
                        transition: "height 0.2s ease",
                    }}>
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
                            onChange={handleDescriptionChange}
                            style={{
                                width: "100%",
                                marginBottom: "10px",
                                padding: "5px",
                                minHeight: "50px",
                                resize: "none",
                            }}
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
                                cursor: "pointer",
                            }}
                            onClick={() => toggleDescription(index)}
                        >
                            <div
                                style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}
                                onClick={(e) => e.stopPropagation()}
                            >
                                <div style={{ display: "flex", alignItems: "center", flex: 1 }}>
                                    <input
                                        type="checkbox"
                                        checked={todo.completed}
                                        onChange={() => handleToggleCompleted(index)}
                                        onClick={(e) => e.stopPropagation()}
                                    />
                                    <span
                                        style={{
                                            textDecoration: todo.completed ? "line-through" : "none",
                                            marginLeft: "10px",
                                            fontWeight: "bold",
                                            whiteSpace: "nowrap",
                                            overflow: "hidden",
                                            textOverflow: "ellipsis",
                                            maxWidth: "120px",
                                        }}
                                        title={todo.title}
                                    >
                                        {getDisplayTitle(todo)}
                                    </span>
                                </div>
                                <div style={{ display: "flex", alignItems: "center" }}>
                                    <span style={{
                                        fontSize: "12px",
                                        color: todo.completed ? "#2e7d32" : (daysLeft < 0 ? "red" : "#333"),
                                        fontWeight: "bold",
                                        marginRight: "10px",
                                        whiteSpace: "nowrap",
                                    }}>
                                        {todo.completed
                                            ? "Completed"
                                            : daysLeft < 0
                                                ? `Overdue by ${Math.abs(daysLeft)} day(s)`
                                                : `${daysLeft} day(s) left`}
                                    </span>
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
                                            marginLeft: "5px",
                                        }}
                                    >
                                        ×
                                    </button>
                                </div>
                            </div>

                            {todo.showDescription && (
                                <div style={{
                                    marginTop: "5px",
                                    fontStyle: "italic",
                                    wordWrap: "break-word",
                                }}>
                                    {todo.description}
                                </div>
                            )}

                            <div style={{ fontSize: "12px", color: "#555", marginTop: "5px" }}>
                                Added on: {todo.date}
                            </div>
                            <div style={{ fontSize: "12px", color: "#555" }}>
                                {todo.completed && todo.completedOn
                                    ? `Completed on: ${todo.completedOn}`
                                    : todo.dueDate
                                        ? `Due date: ${todo.dueDate}`
                                        : null}
                            </div>
                        </li>
                    );
                })}
            </ul>
        </div>
    );
};

export default TodoList;
