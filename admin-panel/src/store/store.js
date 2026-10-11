import { configureStore } from "@reduxjs/toolkit";

import carReducer from "./carSlice";
import authReducer from "./authSlice";

const store = configureStore({
  reducer: {
    cars: carReducer,
    auth: authReducer,
  },
});

export default store;
