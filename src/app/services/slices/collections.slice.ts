import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Collection, ResourcePath } from '../../../types/resources';

interface CollectionsState {
  collections: Collection[];
  saved: boolean;
}

const initialState: CollectionsState = {
  collections: [],
  saved: false
};

const collections = createSlice({
  name: 'collections',
  initialState,
  reducers: {
    createCollection: (state, action: PayloadAction<Collection>) => {
      state.collections.push(action.payload);
      state.saved = false;
    },
    addResourcePaths: (state, action: PayloadAction<ResourcePath[]>) => {
      const index = state.collections.findIndex(collection => collection.isDefault);
      if (index > -1) {
        const existingPaths = state.collections[index].paths;
        const existingKeys = new Set(existingPaths.map(path => path.key));
        const pathsToAdd = action.payload.filter(
          newPath => !existingKeys.has(newPath.key)
        );

        if (pathsToAdd.length > 0) {
          state.collections[index].paths.push(...pathsToAdd);
          state.saved = false;
        }
      }
    },
    updateResourcePaths: (state, action: PayloadAction<ResourcePath[]>) => {
      const collectionIndex = state.collections.findIndex(k => k.isDefault);
      if (collectionIndex > -1) {
        state.collections[collectionIndex] = {
          ...state.collections[collectionIndex],
          paths: action.payload
        };
        state.saved = true;
      }
    },
    removeResourcePaths: (state, action: PayloadAction<ResourcePath[]>) => {
      const index = state.collections.findIndex(collection => collection.isDefault);
      if (index > -1) {
        const defaultResourcePaths = [...state.collections[index].paths];
        action.payload.forEach((resourcePath: ResourcePath) => {
          const delIndex = defaultResourcePaths.findIndex(p => p.key === resourcePath.key);
          if (delIndex > -1) {
            defaultResourcePaths.splice(delIndex, 1);
          }
        });
        state.collections[index].paths = defaultResourcePaths;
        state.saved = false;
      }
    },
    resetSaveState: (state) => {
      state.saved = false;
    }
  }
});

export const
  { createCollection,
    addResourcePaths,
    updateResourcePaths,
    removeResourcePaths,
    resetSaveState } = collections.actions;

export default collections.reducer;
