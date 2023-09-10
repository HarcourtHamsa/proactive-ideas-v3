import { PayloadAction, createSlice } from "@reduxjs/toolkit";

interface ISubSection {
  content: string;
}

const initialState: ISubSection = {
  content: "",
};

const subSectionSlice = createSlice({
  name: "sub-section",
  initialState,
  reducers: {
    setSubSection: (state, action: PayloadAction<ISubSection>) => {
      state.content = action.payload.content;
    },

    resetSubSection: (state) => {
      state.content = "";
    },
  },
});

export const { setSubSection, resetSubSection } = subSectionSlice.actions;

export default subSectionSlice.reducer;
