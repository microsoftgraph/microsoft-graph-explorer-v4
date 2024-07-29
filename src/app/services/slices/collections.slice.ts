import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Collection, ResourcePath } from '../../../types/resources';

const initialState: Collection[] = [];

const collections = createSlice({
  name: 'collections',
  initialState,
  reducers: {
    createCollection: (state, action: PayloadAction<Collection>) => {
      state.push(action.payload);
      return state
    },
    addResourcePaths:(state, action: PayloadAction<ResourcePath[]>) => {
      const index = state.findIndex(collection => collection.isDefault);
      if (index > -1) {
        state[index].paths.push(...action.payload)
      }
    },
    removeResourcePaths: (state, action: PayloadAction<ResourcePath[]>)=>{
      const index = state.findIndex(collection => collection.isDefault);
      if(index > -1) {
        const defaultResourcePaths = [...state[index].paths];
        action.payload.forEach((resourcePath: ResourcePath)=>{
          const delIndex = defaultResourcePaths.findIndex(p=>p.key === resourcePath.key)
          if (delIndex > -1) {
            defaultResourcePaths.splice(delIndex, 1)
          }
        })
        state[index].paths = defaultResourcePaths;
      }
    }
  }
})

export const {createCollection, addResourcePaths, removeResourcePaths} = collections.actions

export default collections.reducer