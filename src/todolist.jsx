import React, { useState, useEffect } from "react";
import backgroundImage from "./pics/magic.jpeg"; // ✅ import the background image

const TodoList = () => {
    const [todos, setTodos] = useState([]);
    const [newTodo, setNewTodo] = useState("");

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
        if (newTodo.trim() !== "") {
            const currentDate = new Date();
            const formattedDate = currentDate.toLocaleString();
            setTodos([
                ...todos,
                {
                    text: newTodo,
                    completed: false,
                    date: formattedDate,
                },
            ]);
            setNewTodo("");
        }
    };

    const handleToggleCompleted = (index) => {
        const updatedTodos = todos.map((todo, i) =>
            i === index ? { ...todo, completed: !todo.completed } : todo
        );
        setTodos(updatedTodos);
    };

    const handleDeleteTodo = (index) => {
        setTodos(todos.filter((_, i) => i !== index));
    };

    return (
        <div
            style={{
                padding: "20px",
                minHeight: "100vh",
                backgroundImage: `url(${backgroundImage})`,
                backgroundSize: "cover",
                backgroundPosition: "center",
                backgroundRepeat: "no-repeat",
            }}
        >
            <h2 style={{ color: "white", textShadow: "1px 1px 2px black" }}>Todo List</h2>
            <div>
                <input
                    type="text"
                    value={newTodo}
                    onChange={(e) => setNewTodo(e.target.value)}
                    placeholder="Enter a new task"
                    style={{ padding: "5px", width: "70%" }}
                />
                <button onClick={handleAddTodo} style={{ padding: "5px" }}>
                    Add
                </button>
            </div>
            <ul style={{ listStyle: "none", padding: 0, marginTop: "20px" }}>
                {todos.map((todo, index) => (
                    <li
                        key={index}
                        style={{
                            border: "1px solid #ccc",
                            borderRadius: "8px",
                            padding: "10px",
                            marginBottom: "10px",
                            background: "#f9f9f9",
                        }}
                    >
                        <div style={{ display: "flex", alignItems: "center" }}>
                            <input
                                type="checkbox"
                                checked={todo.completed}
                                onChange={() => handleToggleCompleted(index)}
                            />
                            <span
                                style={{
                                    textDecoration: todo.completed ? "line-through" : "none",
                                    marginLeft: "10px",
                                    flex: 1,
                                }}
                            >
                                {todo.text}
                            </span>
                            <button
                                onClick={() => handleDeleteTodo(index)}
                                style={{
                                    background: "red",
                                    color: "white",
                                    border: "none",
                                    padding: "5px 10px",
                                    cursor: "pointer",
                                    borderRadius: "4px",
                                    marginLeft: "10px",
                                }}
                            >
                                Delete
                            </button>
                        </div>
                        <div style={{ fontSize: "12px", color: "#555", marginTop: "5px" }}>
                            Added on: {todo.date}
                        </div>
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default TodoList;
