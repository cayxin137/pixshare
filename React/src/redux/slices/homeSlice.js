import { createSlice, current } from "@reduxjs/toolkit";

const initialState = {
    homeLocation: null,
}

const homeSlice = createSlice({
    name: 'home',
    initialState,
    reducers: {
        locationDetect: (state, action) => {
            state.homeLocation = action.payload;
        },
    }
})

export const { locationDetect } = homeSlice.actions;

export const selectLocation = (state) => state.home.homeLocation;

export default homeSlice.reducer;   