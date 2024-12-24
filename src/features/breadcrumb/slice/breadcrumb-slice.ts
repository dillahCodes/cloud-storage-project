import { RootState } from "@/store/store";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";

const initialState: BreadcrumbState = {
  items: [],
  status: "idle",
};

export const breadcrumbSlice = createSlice({
  name: "breadcrumb",
  initialState,
  reducers: {
    addBreadcrumbItemWithIndex: (state, action: PayloadAction<AddBreadcrumbWithIndex>) => {
      const validIndex = action.payload.index > 0 || action.payload.index < state.items.length;
      if (validIndex) state.items[action.payload.index] = action.payload.item;
    },
    setStatusBreadcrumb: (state, action: PayloadAction<BreadcrumbItemFetchStatus>) => {
      state.status = action.payload;
    },
    setFirstIndexBreadcrumbItem: (state, action: PayloadAction<FirstIndexBreadcrumbItem>) => {
      const isItemExist = state.items.some((item) => item.key === action.payload.key);
      if (!isItemExist) state.items = [action.payload as FirstIndexBreadcrumbItem, ...(state.items.slice(1) as BreadcrumbItem[])];
    },
    addBreadcrumbItem: (state, action: PayloadAction<BreadcrumbItem>) => {
      const isItemExist = state.items.some((item) => item.key === action.payload.key);
      if (!isItemExist) {
        state.items = [state.items[0] as FirstIndexBreadcrumbItem, ...(state.items.slice(1) as BreadcrumbItem[]), action.payload];
      }
    },
    addBreadcrumbItems: (state, action: PayloadAction<BreadcrumbItem[]>) => {
      const newItems = action.payload.filter((newItem) => !state.items.some((existingItem) => existingItem.key === newItem.key));

      if (newItems.length > 0) {
        state.items = [state.items[0] as FirstIndexBreadcrumbItem, ...(state.items.slice(1) as BreadcrumbItem[]), ...newItems];
      }
    },

    deleteUnusedBreadcrumbItems: (state, action: PayloadAction<BreadcrumbItem["key"]>) => {
      const indexToKeep = state.items.findIndex((item) => item.key === action.payload);

      if (indexToKeep !== -1) {
        state.items = [state.items[0] as FirstIndexBreadcrumbItem, ...(state.items.slice(1, indexToKeep + 1) as BreadcrumbItem[])];
      }
    },

    deleteBreadcrumbItemsByKey: (state, action: PayloadAction<BreadcrumbItem["key"]>) => {
      const filteredItems = state.items.filter((item) => item.key !== action.payload);
      state.items = [filteredItems[0] as FirstIndexBreadcrumbItem, ...(filteredItems.slice(1) as BreadcrumbItem[])];
    },

    resetBreadcrumb: (state) => {
      state.items = [];
      state.status = "idle";
    },
  },
});

export const {
  setFirstIndexBreadcrumbItem,
  addBreadcrumbItem,
  addBreadcrumbItems,
  setStatusBreadcrumb,
  deleteUnusedBreadcrumbItems,
  resetBreadcrumb,
  addBreadcrumbItemWithIndex,
  deleteBreadcrumbItemsByKey,
} = breadcrumbSlice.actions;
export const breadcrumbSelector = (state: RootState) => state.breadcrumb;
