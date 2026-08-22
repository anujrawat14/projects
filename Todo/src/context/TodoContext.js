import React, { useContext, createContext } from "react";

export const TodoContext = createContext({

    todos: [
        {
            id: 1,
            todo: "todo message",
            completed: false,
        }
    ], //array of todo with objects

    addToDo: (todo) => { }, //new todo list add krna ka liya
    updateToDo: (id, todo) => { }, // is hum edit kr payenga to do ka msg
    deleteToDo: (id) => { },//delet krna ka liya todo ko
    toggleComplete: (id) => { }//agr task complete ho jaya toh todo ko completed dikhna ka liay
});

export const TodoContextProvider = TodoContext.Provider;

export const useTodo = () => {
    return useContext(TodoContext);
}