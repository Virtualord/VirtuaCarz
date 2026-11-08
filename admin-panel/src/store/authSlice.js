import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import API from "../API/api";   // Corrected path

// ── Login ──
export const login = createAsyncThunk(
  "auth/login",
  async ({ email, password }, thunkApi) => {
    try {
      const res = await API.post("/user/login", { email, password });

      if (!res.data?.user?.isAdmin) {
        localStorage.removeItem("appData");
        return thunkApi.rejectWithValue(
          "This account does not have administrator access."
        );
      }

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

// ── Refresh signed-in user ──
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
      .addCase(login.rejected,   (state, action) => {
        state.loading = false;
        state.user    = null;
        state.token   = null;
        state.error   = action.payload || "Login failed";
      })

      // loadToken
      .addCase(loadToken.fulfilled, (state, action) => { state.token = action.payload; })

      // refresh user
      .addCase(getUserData.fulfilled, (state, action) => {
        const user = action.payload?.user ?? action.payload;
        if (!user) return;

        state.user = user;

        try {
          const raw = localStorage.getItem("appData");
          const appData = raw ? JSON.parse(raw) : {};
          localStorage.setItem("appData", JSON.stringify({ ...appData, user }));
        } catch {
          // Ignore malformed local storage; the login flow will replace it.
        }
      })

  },
});

export const { reset, logout } = authSlice.actions;
export default authSlice.reducer;
