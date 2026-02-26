import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  videos: [],
  page: 1,
  hasMore: true,
  loading: false,
  error: null,
};

const videoSlice = createSlice({
  name: "videos",
  initialState,
  reducers: {
    fetchVideosStart(state) {
      state.loading = true;
      state.error = null;
    },
    fetchVideosSuccess(state, action) {
      const { docs, hasNextPage, page } = action.payload;
      state.videos = page === 1 ? docs : [...state.videos, ...docs];
      state.hasMore = hasNextPage;
      state.loading = false;
      
    },
    fetchVideosFailure(state, action) {
      state.loading = false;
      state.error = action.payload;
    },
    incrementPage(state) {
      state.page += 1;
    },
    resetVideos(state) {
      state.videos = [];
      state.page = 1;
      state.hasMore = true;
      state.loading = false;
      state.error = null;
    },
  },
});

export const {
  fetchVideosStart,
  fetchVideosSuccess,
  fetchVideosFailure,
  incrementPage,
  resetVideos,
} = videoSlice.actions;

export default videoSlice.reducer;
