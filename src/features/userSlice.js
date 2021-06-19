import { createSlice } from "@reduxjs/toolkit";

export const userSlice = createSlice({
  name: "user",
  initialState: {
    user: null,
    balance: null,
    guestBalance: null,
  },
  reducers: {
    login: (state, action) => {
      state.user = action.payload;
      try {
        localStorage.setItem("user", JSON.stringify(action.payload));
      } catch (e) {
        console.log("userslice login error " + e);
      }
    },

    setBalanceAmount: (state, action) => {
      state.balance = action.payload;
      try {
        localStorage.setItem("balance", action.payload);
      } catch (e) {}
    },
    setGuestBalanceAmount: (state, action) => {
      state.guestBalance = action.payload;
      try {
        localStorage.setItem("guestBalance", action.payload);
      } catch (e) {}
    },

    logout: (state) => {
      state.user = null;
      localStorage.setItem("user", "");
    },
  },
});

export const {
  login,
  setUser,
  setBalanceAmount,
  setGuestBalanceAmount,
  logout,
} = userSlice.actions;

export const selectUser = (state) => state.user.user;
export const selectBalance = (state) => state.user.balance;
export const selectGuestBalance = (state) => state.user.guestBalance;

export default userSlice.reducer;
