import React, { useState, useEffect } from "react";

const TodoList = () => {
    const [todos, setTodos] = useState([]);
    const [newTodo, setNewTodo] = useState("");

    // Load todos from localStorage on initial render
    useEffect(() => {
        const storedTodos = JSON.parse(localStorage.getItem("todos"));
        if (storedTodos) {
            setTodos(storedTodos);
        }
    }, []);

    // Save todos to localStorage whenever they change
    useEffect(() => {
        localStorage.setItem("todos", JSON.stringify(todos));
    }, [todos]);

    const handleAddTodo = () => {
        if (newTodo.trim() !== "") {
            setTodos([...todos, { text: newTodo, completed: false }]);
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
        <div style={{ padding: "20px" }}>
            <h2>Todo List</h2>
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
            <ul style={{ listStyle: "none", padding: 0 }}>
                {todos.map((todo, index) => (
                    <li key={index} style={{ margin: "10px 0" }}>
                        <input
                            type="checkbox"
                            checked={todo.completed}
                            onChange={() => handleToggleCompleted(index)}
                        />
                        <span
                            style={{
                                textDecoration: todo.completed ? "line-through" : "none",
                                marginLeft: "10px",
                            }}
                        >
                            {todo.text}
                        </span>
                        <button
                            onClick={() => handleDeleteTodo(index)}
                            style={{
                                marginLeft: "10px",
                                background: "red",
                                color: "white",
                                border: "none",
                                padding: "2px 5px",
                                cursor: "pointer",
                            }}
                        >
                            Delete
                        </button>
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default TodoList;
