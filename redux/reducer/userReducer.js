import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    user: null,
    loading: true,
    theme:'light',
};

export const userReducer = createSlice({
    name: "userReducer",
    initialState,
    reducers: {
        userExist: (state, action) => {
            state.loading = false;
            state.user = action.payload;
        },
        userNotExist: (state, action) => {
            state.loading = false;
            state.user = null;
        },
        lightTheme: (state, action) => {
            state.theme = 'light';
        },
        darkTheme: (state, action) => {
            state.theme = 'dark';
        }
    }
});

// export const {userExist,userNotExist} = userReducer.actions
export const {userExist,userNotExist, lightTheme, darkTheme} = userReducer.actions