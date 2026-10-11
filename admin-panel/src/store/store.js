import { configureStore } from "@reduxjs/toolkit";

import carReducer from "./carSlice";
import authReducer from "./authSlice";
import bookingReducer from "./bookingSlice";

const store = configureStore({
  reducer: {
    cars: carReducer,
    auth: authReducer,
    bookings: bookingReducer,
  },
});

export default store;
