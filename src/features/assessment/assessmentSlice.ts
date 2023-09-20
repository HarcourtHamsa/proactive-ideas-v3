import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface GeoState {
    questions: [] | null;
}

const initialState: GeoState = {
    questions: null
};

const assessmentSlice = createSlice({
    name: "assessment",
    initialState,
    reducers: {
        addQuestion: (state, action: PayloadAction<{ questions: []; }>) => {
            if (state.questions){
                state.questions = state.questions.push(action.payload.questions)
            } else {
                state.questions = [...action.payload.questions]
                
            }
        },


        resetQuestions: (state) => {
             state.questions = null
        },

        
    },
});

export const { addQuestion, resetQuestions } = assessmentSlice.actions;

export default assessmentSlice.reducer;
