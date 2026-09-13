import { configureStore } from "@reduxjs/toolkit";

import AuthSlice from "./AuthSlice";
import PostSlice from "./PostSlice";

const Store = configureStore({

    reducer: {
        auth: AuthSlice,
        post: PostSlice
    }

});

export default Store;