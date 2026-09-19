import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    posts: [],
    currentPost: null

};

const PostSlice = createSlice({
    name: "post",
    initialState,
    reducers: {
        setPosts: (state, action) => {
            state.posts = action.payload;
        },
        setCurrentPost: (state, action) => {
            state.currentPost = action.payload;
        },
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

            state.currentPost = action.payload;
        }
    }
});

export const { setPosts, setCurrentPost, addPost, updatePost, removePost } = PostSlice.actions;
export default PostSlice.reducer;