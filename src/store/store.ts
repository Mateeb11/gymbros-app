import { configureStore } from '@reduxjs/toolkit';
import authReducer from './slices/authSlice';
import exercisesReducer from './slices/exercisesSlice';
import groupsReducer from './slices/groupsSlice';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    exercises: exercisesReducer,
    groups: groupsReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
