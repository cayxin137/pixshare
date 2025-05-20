import { createSlice, current } from "@reduxjs/toolkit";

const initialState = {
    path: null,
}

const pathSlice = createSlice({
    name: 'path',
    initialState,
    reducers: {
        pathDetect: (state, action) => {
            state.path = action.payload;
        },
    }
})

export const { pathDetect } = pathSlice.actions;

export const selectPath = (state) => state.path.path;

export default pathSlice.reducer;   