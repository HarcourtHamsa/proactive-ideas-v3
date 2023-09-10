import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./features/auth/authSlice";
import formStepReducer from "./features/form-step/formStepSlice";
import sectionReducer from "./features/sections/sectionsSlice";
import blogReducer from "./features/blog/blogSlice";
import subSectionReducer from "./features/sub-section/subSectionSlice";
import generalInfoReducer from "./features/general-info/generalInfoSlice";
import geoDataReducer from "./features/geo/geoSlice";
import {
  persistReducer,
  persistStore,
  FLUSH,
  PAUSE,
  PERSIST,
  PURGE,
  REGISTER,
  REHYDRATE
} from 'redux-persist';
import storage from './lib/storage';
// import thunk from 'redux-thunk';
import { apiSlice } from "./features/apiSlice";

const persistConfig = {
  key: "root",
  storage,
};

const persistedAuthReducer = persistReducer(persistConfig, authReducer);
const persistedFormStepReducer = persistReducer(persistConfig, formStepReducer);
const persistedSectionReducer = persistReducer(persistConfig, sectionReducer);
const persistedBlogReducer = persistReducer(persistConfig, blogReducer);
const persistedSubSectionReducer = persistReducer(persistConfig, subSectionReducer);
const persistedGeneralInfoReducer = persistReducer(persistConfig, generalInfoReducer);
const persistedGeoDataReducer = persistReducer(persistConfig, geoDataReducer);



export const store = configureStore({
  reducer: {
    generalInfo: persistedGeneralInfoReducer,
    auth: persistedAuthReducer,
    step: persistedFormStepReducer,
    section: persistedSectionReducer,
    geo: persistedGeoDataReducer,
    blog: persistedBlogReducer,
    subSection: persistedSubSectionReducer,
    [apiSlice.reducerPath]: apiSlice.reducer
  },
  devTools: process.env.NODE_ENV !== "production",
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER]
      }
    }).concat([
      apiSlice.middleware,
    ]),
});


// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>;
// Inferred type: {posts: PostsState, comments: CommentsState, users: UsersState}
export type AppDispatch = typeof store.dispatch;

export const persistor = persistStore(store)