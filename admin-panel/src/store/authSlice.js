import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import API from "../API/api";   // Corrected path

// ── Login ──
export const login = createAsyncThunk(
  "auth/login",
  async ({ email, password }, thunkApi) => {
    try {
      const res = await API.post("/user/login", { email, password });
      localStorage.setItem("appData", JSON.stringify(res.data));
      return res.data;
    } catch (error) {
      const message =
        error.response?.data?.message || error.message || "Login failed";
      return thunkApi.rejectWithValue(message);
    }
  }
);

// ── Load token from localStorage ──
export const loadToken = createAsyncThunk("auth/loadToken", async () => {
  try {
    const raw = localStorage.getItem("appData");
    if (!raw) return null;
    return JSON.parse(raw)?.token || null;
  } catch {
    return null;
  }
});

// ── Get all bookings (admin) ──
export const getAllBookings = createAsyncThunk(
  "auth/getAllBookings",
  async (_, thunkApi) => {
    try {
      const token = thunkApi.getState().auth.token;
      const res = await API.get("/booking/get-all", {
        headers: { Authorization: token },
      });
      return res.data;
    } catch (error) {
      return thunkApi.rejectWithValue(
        error.response?.data?.message || error.message || "Error fetching bookings"
      );
    }
  }
);

// ── Get booking details by ID ──
export const getBookingDetails = createAsyncThunk(
  "auth/getBookingDetails",
  async (id, thunkApi) => {
    try {
      const token = thunkApi.getState().auth.token;
      const res = await API.get(`/booking/get-details/${id}`, {
        headers: { Authorization: token },
      });
      return res.data;
    } catch (error) {
      return thunkApi.rejectWithValue(
        error.response?.data?.message || error.message || "Error fetching booking"
      );
    }
  }
);

// ── Update booking status (admin) ──
export const updateBookingStatus = createAsyncThunk(
  "auth/updateBookingStatus",
  async ({ id, status }, thunkApi) => {
    try {
      const token = thunkApi.getState().auth.token;
      const res = await API.patch(
        `/booking/update-status/${id}`,
        { status },
        { headers: { Authorization: token } }
      );
      return res.data;
    } catch (error) {
      return thunkApi.rejectWithValue(
        error.response?.data?.message || error.message || "Error updating status"
      );
    }
  }
);

// ─────────── Initial state ───────────
const getInitialData = () => {
  try {
    const raw = localStorage.getItem("appData");
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
};

const init = getInitialData();

const authSlice = createSlice({
  name: "auth",
  initialState: {
    loading:  false,
    success:  false,
    user:     init?.user  || null,
    token:    init?.token || null,
    error:    null,
    bookings: [],
    bookingDetail: null,
  },

  reducers: {
    reset: (state) => {
      state.error   = null;
      state.success = false;
    },
    logout: (state) => {
      state.token   = null;
      state.user    = null;
      state.success = false;
      state.error   = null;
      state.loading = false;
      localStorage.removeItem("appData");
    },
  },

  extraReducers: (builder) => {
    builder
      // login
      .addCase(login.pending,    (state) => { state.loading = true;  state.error = null; state.success = false; })
      .addCase(login.fulfilled,  (state, action) => {
        state.loading = false;
        state.success = true;
        state.user    = action.payload.user;
        state.token   = action.payload.token;
      })
      .addCase(login.rejected,   (state, action) => { state.loading = false; state.error = action.payload || "Login failed"; })

      // loadToken
      .addCase(loadToken.fulfilled, (state, action) => { state.token = action.payload; })

      // getAllBookings
      .addCase(getAllBookings.pending,   (state) => { state.loading = true;  state.error = null; })
      .addCase(getAllBookings.fulfilled, (state, action) => {
        state.loading  = false;
        state.bookings = action.payload.booking || action.payload.bookings || [];
      })
      .addCase(getAllBookings.rejected,  (state, action) => { state.loading = false; state.error = action.payload; })

      // getBookingDetails
      .addCase(getBookingDetails.pending,   (state) => { state.loading = true;  state.error = null; })
      .addCase(getBookingDetails.fulfilled, (state, action) => {
        state.loading       = false;
        state.bookingDetail = action.payload.booking;
      })
      .addCase(getBookingDetails.rejected,  (state, action) => { state.loading = false; state.error = action.payload; })

      // updateBookingStatus
      .addCase(updateBookingStatus.pending,   (state) => { state.loading = true;  state.error = null; })
      .addCase(updateBookingStatus.fulfilled, (state, action) => {
        state.loading = false;
        state.success = true;
        // Update in list if present
        if (action.payload.booking) {
          state.bookings = state.bookings.map((b) =>
            b._id === action.payload.booking._id ? action.payload.booking : b
          );
        }
      })
      .addCase(updateBookingStatus.rejected,  (state, action) => { state.loading = false; state.error = action.payload; });
  },
});
export const getUserData = createAsyncThunk(
  "auth/getUserData",
  async (_, thunkApi) => {
    try {
      const token = thunkApi.getState().auth.token;

      const res = await API.get("/user/get-user", {
        headers: {
          Authorization: token,
        },
      });

      return res.data;
    } catch (error) {
      return thunkApi.rejectWithValue(
        error.response?.data?.message ||
          error.message ||
          "Error fetching user"
      );
    }
  }
);


export const { reset, logout } = authSlice.actions;
export default authSlice.reducer;