import { createSlice } from "@reduxjs/toolkit";
import {
  registerUser,
  loginUser,
  logoutUser,
  fetchCurrentUser,
  updateAccountDetails,
  updateAvatar,
  updateCoverImage,
} from "./auth.Thunks";

const initialState = {
  user: null,
  isAuthenticated: false,
  isLoading: false,
  error: null,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    clearAuthError: (state) => {
      state.error = null;
    },

    updateUserAvatar: (state, action) => {
      if (state.user) {
        state.user.avatar = action.payload;
      }
    },

    updateUserCoverImage: (state, action) => {
      if (state.user) {
        state.user.coverImage = action.payload;
      }
    },

    updateUserAccount: (state, action) => {
      if (state.user) {
        state.user = {
          ...state.user,
          ...action.payload,
        };
      }
    },
  },
  extraReducers: (builder) => {
    builder
      /* ===== REGISTER ===== */
      .addCase(registerUser.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(registerUser.fulfilled, (state, action) => {
        state.isLoading = false;
        state.user = action.payload.data;
        state.isAuthenticated = true;
      })
      .addCase(registerUser.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })

      /* ===== LOGIN ===== */
      .addCase(loginUser.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.isLoading = false;
        state.user = action.payload.data;
        state.isAuthenticated = true;
      })
      .addCase(loginUser.rejected, (state, action) => {
        // console.log("payload",action.payload)
        state.isLoading = false;
        state.error = action.payload;
      })

      /* ===== CURRENT USER ===== */
      .addCase(fetchCurrentUser.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(fetchCurrentUser.fulfilled, (state, action) => {
        state.isLoading = false;
        state.user = action.payload.data;
        state.isAuthenticated = true;
      })
      .addCase(fetchCurrentUser.rejected, (state) => {
        state.isLoading = false;
        state.user = null;
        state.isAuthenticated = false;
      })

      /* ===== LOGOUT ===== */
      .addCase(logoutUser.fulfilled, (state) => {
        state.user = null;
        state.isAuthenticated = false;
      })
      /* ===== update ===== */
      .addCase(updateAccountDetails.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(updateAccountDetails.fulfilled, (state, action) => {
        state.isLoading = false;
        //console.log("action", action.payload);
        state.user = action.payload.data;
        state.error = null;
      })
      .addCase(updateAccountDetails.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })
      .addCase(updateAvatar.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(updateAvatar.fulfilled, (state) => {
        state.isLoading = false;
      })
      .addCase(updateAvatar.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })

      .addCase(updateCoverImage.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(updateCoverImage.fulfilled, (state) => {
        state.isLoading = false;
      })
      .addCase(updateCoverImage.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      });
  },
});

export const {
  clearAuthError,
  updateUserAvatar,
  updateUserCoverImage,
  updateUserAccount,
} = authSlice.actions;
export default authSlice.reducer;
