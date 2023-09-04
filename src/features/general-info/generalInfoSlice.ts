import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface Price {
  currency: string;
  country_code: string;
  price: string;
}

interface GeneralInfoState {
  headerImage: string;
  title: string;
  author: string;
  prices: Price[];
  category: string;
  description: string;
  summary: string;
  hasCertificate: boolean;
  objectives: string[];
}

const initialState: GeneralInfoState = {
  headerImage: "",
  title: "",
  author: "",
  prices: [
    { currency: "USD", country_code: "US", price: "" },
    { currency: "INR", country_code: "IND", price: "" },
    { currency: "NGN", country_code: "NGA", price: "" },
    { currency: "KES", country_code: "KEN", price: "" },
    { currency: "ZAR", country_code: "ZAF", price: "" },
    { currency: "GHS", country_code: "GHA", price: "" },
    { currency: "GBP", country_code: "GBR", price: "" },
  ],
  category: "",
  description: "",
  summary: "",
  hasCertificate: false,
  objectives: [],
};

const generalInfoSlice = createSlice({
  name: "generalInfo",
  initialState,
  reducers: {
    setGeneralInfoTitle: (state, action: PayloadAction<{ title: string }>) => {
      state.title = action.payload.title;
    },
    setGeneralInfoAuthor: (state, action: PayloadAction<{ author: string }>) => {
      state.author = action.payload.author;
    },
    setGeneralInfoPrice: (state, action: PayloadAction<{ prices: Price[] }>) => {
      state.prices = action.payload.prices;
    },
    setGeneralInfoCategory: (state, action: PayloadAction<{ category: string }>) => {
      state.category = action.payload.category;
    },
    setGeneralInfoDescription: (state, action: PayloadAction<{ description: string }>) => {
      state.description = action.payload.description;
    },
    setGeneralInfoSummary: (state, action: PayloadAction<{ summary: string }>) => {
      state.summary = action.payload.summary;
    },
    setGeneralInfoCertificate: (state, action: PayloadAction<{ hasCertificate: boolean }>) => {
      state.hasCertificate = action.payload.hasCertificate;
    },
    setGeneralInfoHeaderImage: (state, action: PayloadAction<{ headerImage: string }>) => {
      state.headerImage = action.payload.headerImage;
    },
    setGeneralInfoObjectives: (state, action: PayloadAction<{ objectives: string[] }>) => {
      state.objectives = action.payload.objectives;
    },
    resetGeneralInfoState: (state) => {
      return initialState; // Reset state by returning initialState
    },
  },
});

export const {
  setGeneralInfoTitle,
  setGeneralInfoSummary,
  setGeneralInfoDescription,
  setGeneralInfoHeaderImage,
  setGeneralInfoCertificate,
  resetGeneralInfoState,
  setGeneralInfoAuthor,
  setGeneralInfoPrice,
  setGeneralInfoCategory,
  setGeneralInfoObjectives,
} = generalInfoSlice.actions;

export default generalInfoSlice.reducer;
