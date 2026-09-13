import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    posts: []
};

const PostSlice = createSlice({
    name: "post",
    initialState,
    reducers: {
        addPost: (state, action) => {
            state.posts.push(action.payload);
        },
        removePost: (state, action) => {
            state.posts = state.posts.filter((post) => post.$id != action.payload);
        },
        updatePost: (state, action) => {
            const index = state.posts.findIndex(
                (post) => post.$id === action.payload.$id
            );

            if (index !== -1) {
                state.posts[index] = action.payload;
            }
        }
    }
});

export const { addPost, updatePost, removePost } = PostSlice.actions;
export default PostSlice.reducer;