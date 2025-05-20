import { createSlice, current } from "@reduxjs/toolkit";

const initialState = {
    chatUser: {},
}

const chatSlice = createSlice({
    name: 'chat',
    initialState,
    reducers: {
        saveUser: (state, action) => {
            state.chatUser = action.payload;
        },
        removeUser: (state) => {
            state.chatUser = {}
        }
    }
})

export const { saveUser, removeUser } = chatSlice.actions;

export const selectUser = (state) => state.chat.chatUser;

export default chatSlice.reducer;   