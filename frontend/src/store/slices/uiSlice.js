import { createSlice } from '@reduxjs/toolkit'

const initialState = {
  sidebarOpen: false,
  searchQuery: '',
  filters: {
    category: '',
    minPrice: '',
    maxPrice: '',
    minRating: '',
    sortBy: 'createdAt',
    sortOrder: 'desc'
  },
  pagination: {
    currentPage: 1,
    totalPages: 1,
    totalItems: 0
  }
}

const uiSlice = createSlice({
  name: 'ui',
  initialState,
  reducers: {
    toggleSidebar: (state) => {
      state.sidebarOpen = !state.sidebarOpen
    },
    setSidebarOpen: (state, action) => {
      state.sidebarOpen = action.payload
    },
    setSearchQuery: (state, action) => {
      state.searchQuery = action.payload
    },
    setFilters: (state, action) => {
      state.filters = { ...state.filters, ...action.payload }
    },
    clearFilters: (state) => {
      state.filters = {
        category: '',
        minPrice: '',
        maxPrice: '',
        minRating: '',
        sortBy: 'createdAt',
        sortOrder: 'desc'
      }
    },
    setPagination: (state, action) => {
      state.pagination = { ...state.pagination, ...action.payload }
    },
    resetUI: (state) => {
      return initialState
    }
  }
})

export const {
  toggleSidebar,
  setSidebarOpen,
  setSearchQuery,
  setFilters,
  clearFilters,
  setPagination,
  resetUI
} = uiSlice.actions

export default uiSlice.reducer
