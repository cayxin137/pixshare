import { configureStore } from '@reduxjs/toolkit'
import { persistStore, persistReducer } from 'redux-persist';
import storage from 'redux-persist/lib/storage';
import { combineReducers } from '@reduxjs/toolkit';
import userReducer from './slices/userSlice';
import homeReducer from './slices/homeSlice';
import pathReducer from './slices/pathSlice';
import chatReducer from './slices/chatSlice';

const persistConfig = {
    key: 'root',
    storage,
};

const rootReducer = combineReducers({
    userReducer,
    homeReducer,
    pathReducer,
    chatReducer
});


const persistedReducer = persistReducer(persistConfig, rootReducer);

const store = configureStore({
    reducer: persistedReducer
})

const persistor = persistStore(store);

export { store, persistor };