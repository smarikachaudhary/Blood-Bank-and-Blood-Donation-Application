import { configureStore } from "@reduxjs/toolkit";
import userRedux from "./authSlice";

const store = configureStore({
  reducer: {
    auth: userRedux.reducer,
  },
});

export default store;
