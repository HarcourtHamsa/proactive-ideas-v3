import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";

interface SubSection {
  id: string;
  title: string;
  content: string;
}

interface Section {
  id: string;
  title: string;
  sub_sections: SubSection[];
}

interface SectionsState {
  sections: Section[];
}

const initialState: SectionsState = {
  sections: [],
};

const sectionSlice = createSlice({
  name: "sections",
  initialState,
  reducers: {
    addSection: (state, action: PayloadAction<Section>) => {
      state.sections = [...state.sections, action.payload];
    },

    setSection: (state, action: PayloadAction<any>) => {
      state.sections = action.payload;
    },



    setSectionTitle: (state, action: PayloadAction<{ id: string; title: string }>) => {
      state.sections = state.sections.map((s) => {
        if (s.id === action.payload.id) {
          return { ...s, title: action.payload.title };
        }
        return s;
      });
    },

    addSubSection: (state, action: PayloadAction<{ id: string; title: string; content: string; subSectionId: string }>) => {
      state.sections = state.sections.map((s) => {
        if (s.id === action.payload.id) {
          return {
            ...s,
            sub_sections: [
              ...(s.sub_sections || []),
              {
                title: action.payload.title,
                content: action.payload.content,
                id: action.payload.subSectionId,
              },
            ],
          };
        }
        return s;
      });
    },

    editSubSection: (state, action: PayloadAction<{ id: string; subSectionId: string; title: string; content: string }>) => {
      state.sections = state.sections.map((s) => {
        if (s.id === action.payload.id) {
          return {
            ...s,
            sub_sections: s.sub_sections.map((ss) => {
              if (ss.id === action.payload.subSectionId) {
                return { ...ss, title: action.payload.title, content: action.payload.content };
              }
              return ss;
            }),
          };
        }
        return s;
      });
    },

    removeSection: (state, action: PayloadAction<{ title: string }>) => {
      state.sections = state.sections.filter((s) => s.title !== action.payload.title);
    },

    resetState: (state) => {
      state.sections = [];
    },
  },
});

export const {
  addSection,
  removeSection,
  resetState,
  addSubSection,
  editSubSection,
  setSectionTitle,
  setSection
} = sectionSlice.actions;

export default sectionSlice.reducer;
