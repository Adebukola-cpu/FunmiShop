import { createSlice } from "@reduxjs/toolkit";


export const appSlice = createSlice({
    name: "appSlice",
    initialState: {
        fullName: "Guest",
        token: "",
        todo: [],
        id: ''
    },


    reducers: {
        updateName: (state, action) => {
            state.fullname = action.payload;
        },

        storeTodo: (state, action) => {
            state.todo.push(action.payload);
        },

        deleteTodo: (state, actions) => {
            state.todo = state.todo.filter((item) => item !== actions.payload);
            //state.todo.splice(actions.payload, 1);
            // console.log(state.todo);
        }
    }
})
export default appSlice.reducer;
export const { updateName, storeTodo, deleteTodo } = appSlice.actions;