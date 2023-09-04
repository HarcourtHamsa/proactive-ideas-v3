import { createSlice } from "@reduxjs/toolkit";

interface IFormStep {
    step: number;
}

const initialState: IFormStep = {
    step: 0,
};

const formStepSlice = createSlice({
    name: "step",
    initialState,
    reducers: {
        incrementStep: (state) => {
            state.step = 1;
        },

        decrementStep: (state) => {
            state.step = 0;
        },

        resetStep: (state) => {
            state.step = 0;
        },
    },
});

export const { incrementStep, decrementStep, resetStep } = formStepSlice.actions;

export default formStepSlice.reducer;
