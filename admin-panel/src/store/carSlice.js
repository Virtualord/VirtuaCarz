import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import API from "../API/api";

// ==========================================
// Add Car
// ==========================================
export const addCar = createAsyncThunk(
  "car/addCar",
  async (formData, thunkApi) => {
    try {
      const token = thunkApi.getState().auth.token || JSON.parse(localStorage.getItem("appData") || "{}")?.token;

      const res = await API.post("/car/add-car", formData, {
        headers: token ? { Authorization: `Bearer ${token}` } : {},
      });

      return res.data;
    } catch (error) {
      const message =
        error.response?.data?.message ||
        error.message ||
        "Error adding car";

      return thunkApi.rejectWithValue(message);
    }
  }
);

// ==========================================
// Get All Cars
// ==========================================
export const getAllCars = createAsyncThunk(
  "car/getAllCars",
  async (_, thunkApi) => {
    try {
      const res = await API.get("/car/get-all");

      return res.data;
    } catch (error) {
      const message =
        error.response?.data?.message ||
        error.message ||
        "Error fetching cars";

      return thunkApi.rejectWithValue(message);
    }
  }
);

// ==========================================
// Get Car Details
// ==========================================
export const getCarDetails = createAsyncThunk(
  "car/getCarDetails",
  async (id, thunkApi) => {
    try {
      const res = await API.get(`/car/${id}`);

      return res.data;
    } catch (error) {
      const message =
        error.response?.data?.message ||
        error.message ||
        "Error fetching car details";

      return thunkApi.rejectWithValue(message);
    }
  }
);

// ==========================================
// Update Car
// ==========================================
export const updateCar = createAsyncThunk(
  "car/updateCar",
  async ({ id, formData }, thunkApi) => {
    try {
      const token = thunkApi.getState().auth.token || JSON.parse(localStorage.getItem("appData") || "{}")?.token;

      const res = await API.patch(`/car/update-car/${id}`, formData, {
        headers: token ? { Authorization: `Bearer ${token}` } : {},
      });

      return res.data;
    } catch (error) {
      const message =
        error.response?.data?.message ||
        error.message ||
        "Error updating car";

      return thunkApi.rejectWithValue(message);
    }
  }
);

// ==========================================
// Delete Car
// ==========================================
export const deleteCar = createAsyncThunk(
  "car/deleteCar",
  async (id, thunkApi) => {
    try {
      const token = thunkApi.getState().auth.token || JSON.parse(localStorage.getItem("appData") || "{}")?.token;

      await API.delete(`/car/delete-car/${id}`, {
        headers: token ? { Authorization: `Bearer ${token}` } : {},
      });

      return id;
    } catch (error) {
      const message =
        error.response?.data?.message ||
        error.message ||
        "Error deleting car";

      return thunkApi.rejectWithValue(message);
    }
  }
);

// ==========================================
// Initial State
// ==========================================
const initialState = {
  loading: false,
  success: false,
  cars: [],
  carDetail: null,
  error: null,
};

// ==========================================
// Car Slice
// ==========================================
const carSlice = createSlice({
  name: "car",

  initialState,

  reducers: {
    clearCarError: (state) => {
      state.error = null;
    },

    resetCarState: (state) => {
      state.loading = false;
      state.success = false;
      state.error = null;
    },
  },

  extraReducers: (builder) => {
    builder

      // ======================================
      // GET ALL CARS
      // ======================================
      .addCase(getAllCars.pending, (state) => {
        state.loading = true;
        state.error = null;
      })

      .addCase(getAllCars.fulfilled, (state, action) => {
        state.loading = false;
        state.error = null;

        state.cars =
          action.payload.car ||
          action.payload.cars ||
          [];
      })

      .addCase(getAllCars.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // ======================================
      // GET CAR DETAILS
      // ======================================
      .addCase(getCarDetails.pending, (state) => {
        state.loading = true;
        state.error = null;
      })

      .addCase(getCarDetails.fulfilled, (state, action) => {
        state.loading = false;
        state.error = null;

        state.carDetail = action.payload.car;
      })

      .addCase(getCarDetails.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // ======================================
      // ADD CAR
      // ======================================
      .addCase(addCar.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.success = false;
      })

      .addCase(addCar.fulfilled, (state, action) => {
        state.loading = false;
        state.error = null;
        state.success = true;

        if (action.payload.car) {
          state.cars.push(action.payload.car);
        }
      })

      .addCase(addCar.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        state.success = false;
      })

      // ======================================
      // UPDATE CAR
      // ======================================
      .addCase(updateCar.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.success = false;
      })

      .addCase(updateCar.fulfilled, (state, action) => {
        state.loading = false;
        state.error = null;
        state.success = true;

        if (action.payload.car) {
          state.cars = state.cars.map((car) =>
            car._id === action.payload.car._id
              ? action.payload.car
              : car
          );
        }
      })

      .addCase(updateCar.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        state.success = false;
      })

      // ======================================
      // DELETE CAR
      // ======================================
      .addCase(deleteCar.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.success = false;
      })

      .addCase(deleteCar.fulfilled, (state, action) => {
        state.loading = false;
        state.error = null;
        state.success = true;

        state.cars = state.cars.filter(
          (car) => car._id !== action.payload
        );
      })

      .addCase(deleteCar.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        state.success = false;
      });
  },
});

// ==========================================
// Actions
// ==========================================
export const {
  clearCarError,
  resetCarState,
} = carSlice.actions;

// ==========================================
// Reducer
// ==========================================
export default carSlice.reducer;