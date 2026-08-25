import { createSlice, nanoid } from "@reduxjs/toolkit";

// createSlice :- Redux state ka ek slice create karne ke liye use hota hai
// Slice ke andar initial state aur reducers define karte hain

// nanoid :- har naye todo ke liye unique id generate karne ke liye use hota hai


// Step 1: Initial state declare karte hain
// Isme todos ki starting/current structure define hoti hai

const initialState = {
    todos: [{ id: 1, text: "hello" }]
}


// Step 2: createSlice se todo slice create karte hain

export const todoSlice = createSlice({

    // Slice ka name hai "todo"
    name: 'todo',

    // Slice ki initial state
    initialState,

    // Reducers define karte hain
    // Reducers state ko update/change karne ka kaam karte hain\

    reducers: {

        // Naya todo add karne ke liye reducer
        addTodo: (state, action) => {

            // Naya todo object create kar rahe hain
            const todo = {

                // Har todo ke liye unique id
                id: nanoid(),

                // Component se dispatch kiya gaya data action.payload me aata hai
                text: action.payload
            }

            // Current todos array me naya todo add kar rahe hain
            // Redux Toolkit Immer use karta hai, isliye yahan push() use kar sakte hain
            state.todos.push(todo)
        },


        // Todo remove karne ke liye reducer
        removeTodo: (state, action) => {

            // action.payload me todo ki id aati hai
            // Jis todo ki id payload ke equal hai usko remove kar dete hain
            state.todos = state.todos.filter(
                (elem) => elem.id !== action.payload
            )
        },

        //payload sa humara pass ek id ayega or uska msg jo update krn hai
        updateTodo: (state, action) => {
            state.todos = state.todos.map((elem) =>
                // Jis todo ki id action.payload.id ke equal hogi,
                // us todo ka text update kar denge
                elem.id === action.payload.id
                    ? { ...elem, text: action.payload.text }//id same rhegi bas text chnage ho jayega
                    : elem
            )
        }

    }

})

// Last step: jo actions components me chahiye unko export karte hain
export const { addTodo, removeTodo, updateTodo } = todoSlice.actions

// Slice ka reducer export karte hain,
// jise baad me Redux store me add karenge
export default todoSlice.reducer