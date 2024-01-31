import { configureStore, combineReducers } from "@reduxjs/toolkit";
import userReducer from "./user/userSlice";

import { persistReducer, persistStore } from "redux-persist";
import storage from "redux-persist/lib/storage";

const rootReducer = combineReducers({
  user: userReducer,
});

const persistOptions = {
  key: "root",
  storage,
  version: 1,
};

const persistedReducer = persistReducer(persistOptions, rootReducer);

export const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({ serializableCheck: false }),
});

export const persistor = persistStore(store);