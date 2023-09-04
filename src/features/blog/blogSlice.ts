import { PayloadAction, createSlice } from "@reduxjs/toolkit";

interface IBlog {
  title: string;
  content: string;
  headerImage: string;
}

const initialState: IBlog = {
  title: "",
  content: "",
  headerImage: "",
};

const blogSlice = createSlice({
  name: "step",
  initialState,
  reducers: {
    setBlogData: (state, action: PayloadAction<IBlog>) => {
      state.title = action.payload.title;
      state.content = action.payload.content;
      state.headerImage = action.payload.headerImage;
    },

    resetBlogData: (state) => {
      state.title = "";
      state.content = "";
      state.headerImage = "";
    },
  },
});

export const { setBlogData, resetBlogData } = blogSlice.actions;

export default blogSlice.reducer;
