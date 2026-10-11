import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import API from "../API/api";

// The server returns { booking: [...] } for the list and { booking: {...} }
// for an individual booking.
const getErrorMessage = (error, fallback) =>
  error.response?.data?.message || error.message || fallback;

export const getAllBookings = createAsyncThunk(
  "booking/getAllBookings",
  async (_, { rejectWithValue }) => {
    try {
      const response = await API.get("/booking/get-all");
      return response.data;
    } catch (error) {
      return rejectWithValue(getErrorMessage(error, "Unable to fetch bookings"));
    }
  }
);

export const getBookingDetails = createAsyncThunk(
  "booking/getBookingDetails",
  async (id, { rejectWithValue }) => {
    try {
      const response = await API.get(`/booking/get-details/${id}`);
      return response.data;
    } catch (error) {
      return rejectWithValue(getErrorMessage(error, "Unable to fetch booking details"));
    }
  }
);

export const updateBookingStatus = createAsyncThunk(
  "booking/updateBookingStatus",
  async ({ id, status }, { rejectWithValue }) => {
    try {
      const response = await API.patch(`/booking/update-status/${id}`, { status });
      return response.data;
    } catch (error) {
      return rejectWithValue(getErrorMessage(error, "Unable to update booking status"));
    }
  }
);

const initialState = {
  bookings: [],
  bookingDetail: null,
  loading: false,
  updating: false,
  success: false,
  error: null,
};

const bookingSlice = createSlice({
  name: "booking",
  initialState,
  reducers: {
    clearBookingError: (state) => {
      state.error = null;
    },
    resetBookingState: (state) => {
      state.loading = false;
      state.updating = false;
      state.success = false;
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(getAllBookings.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getAllBookings.fulfilled, (state, action) => {
        state.loading = false;
        state.bookings = action.payload.booking || action.payload.bookings || [];
      })
      .addCase(getAllBookings.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || action.error.message;
      })
      .addCase(getBookingDetails.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getBookingDetails.fulfilled, (state, action) => {
        state.loading = false;
        state.bookingDetail = action.payload.booking || null;
      })
      .addCase(getBookingDetails.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || action.error.message;
      })
      .addCase(updateBookingStatus.pending, (state) => {
        state.updating = true;
        state.success = false;
        state.error = null;
      })
      .addCase(updateBookingStatus.fulfilled, (state, action) => {
        state.updating = false;
        state.success = true;

        // The API may return the previous document; the submitted status is
        // authoritative for the UI after the successful response.
        const { id, status } = action.meta.arg;
        state.bookings = state.bookings.map((booking) =>
          booking._id === id ? { ...booking, status } : booking
        );
        if (state.bookingDetail?.id === id || state.bookingDetail?._id === id) {
          state.bookingDetail.status = status;
        }
      })
      .addCase(updateBookingStatus.rejected, (state, action) => {
        state.updating = false;
        state.success = false;
        state.error = action.payload || action.error.message;
      });
  },
});

export const { clearBookingError, resetBookingState } = bookingSlice.actions;
export default bookingSlice.reducer;
