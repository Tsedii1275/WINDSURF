import { configureStore } from "@reduxjs/toolkit";
import { setupListeners } from "@reduxjs/toolkit/query";
import { aauApi } from "../services/api";
import campusReducer from "./campusSlice";

export const store = configureStore({
    reducer: {
        [aauApi.reducerPath]: aauApi.reducer,
        campus: campusReducer,
    },
    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware().concat(aauApi.middleware),
});

setupListeners(store.dispatch);

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
