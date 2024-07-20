import { configureStore } from "@reduxjs/toolkit";
import newsReducer from "./NewSlice/NewSlice"; // Путь к вашему редуктору
import { useDispatch } from 'react-redux';

const store = configureStore({
    reducer: {
        news: newsReducer // Исправлено на newsReducer
    }
})

export default store;

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch
