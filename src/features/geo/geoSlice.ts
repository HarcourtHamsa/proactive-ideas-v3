import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface GeoState {
  ip: string;
  country: string;
}

const initialState: GeoState = {
  ip: "",
  country: "",
};

const geoSlice = createSlice({
  name: "geo",
  initialState,
  reducers: {
    setGeoData: (state, action: PayloadAction<{ ip: string; country: string }>) => {
      state.ip = action.payload.ip;
      state.country = action.payload.country;
    },
  },
});

export const { setGeoData } = geoSlice.actions;

export default geoSlice.reducer;
