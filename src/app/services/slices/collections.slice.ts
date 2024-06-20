import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Collection, ResourcePath } from '../../../types/resources';
import { getUniquePaths } from '../reducers/collections-reducer.util';

const initialState: Collection[] = [];

const collections = createSlice({
  name: 'collections',
  initialState,
  reducers: {
    collectionCreateSuccess: (state, action: PayloadAction<Collection>) => {
      state.push(action.payload);
      return state
    },
    resourcepathsAddSuccess:(state, action: PayloadAction<ResourcePath[]>) => {
      const index = state.findIndex(collection => collection.isDefault);
      if (index > -1) {
        const paths: ResourcePath[] = getUniquePaths(state[index].paths, action.payload);
        state[index].paths.push(...paths)
      }
      return state
    },
    resourcepathsDeleteSuccess: (state, action: PayloadAction<ResourcePath[]>)=>{
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
      return state
    }
  }
})

export const {collectionCreateSuccess, resourcepathsAddSuccess, resourcepathsDeleteSuccess} = collections.actions

export default collections.reducer