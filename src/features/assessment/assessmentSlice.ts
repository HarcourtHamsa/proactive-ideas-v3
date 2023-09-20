import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface AssessmentState {
    questions: any[] | null;
}

const initialState: AssessmentState = {
    questions: null,
};

const assessmentSlice = createSlice({
    name: "assessment",
    initialState,
    reducers: {
        addQuestion: (state, action: PayloadAction<{ questions: any[] }>) => {
            state.questions = state.questions
                ? [...state.questions, ...action.payload.questions]
                : [...action.payload.questions];
        },

        resetQuestions: (state) => {
            state.questions = null;
        },
    },
});

export const { addQuestion, resetQuestions } = assessmentSlice.actions;

export default assessmentSlice.reducer;
