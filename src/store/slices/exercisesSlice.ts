import { createSlice, type PayloadAction } from '@reduxjs/toolkit';

export interface Exercise {
  id: string;
  user_id: string;
  date: string;
  exercise_name: string;
  type: 'machine' | 'free';
  weight: number;
  weight_unit: 'kg' | 'lbs';
  sets: number;
  reps: number[];
  notes?: string;
  created_at: string;
}

interface ExercisesState {
  exercises: Exercise[];
  isLoading: boolean;
  error: string | null;
  filters: {
    dateRange?: { start: string; end: string };
    exerciseName?: string;
    exerciseType?: 'machine' | 'free';
  };
}

const initialState: ExercisesState = {
  exercises: [],
  isLoading: false,
  error: null,
  filters: {},
};

const exercisesSlice = createSlice({
  name: 'exercises',
  initialState,
  reducers: {
    setExercises: (state, action: PayloadAction<Exercise[]>) => {
      state.exercises = action.payload;
      state.isLoading = false;
      state.error = null;
    },
    addExercise: (state, action: PayloadAction<Exercise>) => {
      state.exercises.unshift(action.payload);
    },
    updateExercise: (state, action: PayloadAction<Exercise>) => {
      const index = state.exercises.findIndex(ex => ex.id === action.payload.id);
      if (index !== -1) {
        state.exercises[index] = action.payload;
      }
    },
    deleteExercise: (state, action: PayloadAction<string>) => {
      state.exercises = state.exercises.filter(ex => ex.id !== action.payload);
    },
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.isLoading = action.payload;
    },
    setError: (state, action: PayloadAction<string>) => {
      state.error = action.payload;
      state.isLoading = false;
    },
    setFilters: (state, action: PayloadAction<ExercisesState['filters']>) => {
      state.filters = action.payload;
    },
  },
});

export const {
  setExercises,
  addExercise,
  updateExercise,
  deleteExercise,
  setLoading,
  setError,
  setFilters,
} = exercisesSlice.actions;

export default exercisesSlice.reducer;
