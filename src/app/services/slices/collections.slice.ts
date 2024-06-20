import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Collection, ResourcePath } from '../../../types/resources';
import { getUniquePaths } from '../reducers/collections-reducer.util';

const initialState: Collection[] = [];

const collections = createSlice({
  name: 'collections',
  initialState,
  reducers: {
    collectionCreateSuccess: (state, action: PayloadAction<Collection[]>) =>state=action.payload,
    resourcepathsAddSuccess:(state, action: PayloadAction<Collection[]>) => {
      const index = state.findIndex(collection => collection.isDefault);
      if (index > -1) {
        const paths: ResourcePath[] = getUniquePaths(state[index].paths, action.payload[index].paths);
        state[index].paths = paths;
      }
      return state
    },
    resourcepathsDeleteSuccess: (state, action: PayloadAction<Collection[]>)=>{
      const index = state.findIndex(collection => collection.isDefault);
      if(index > -1) {
        const defaultResourcePaths = [...state[index].paths];
        // TODO: just delete for the default collection?
        action.payload.forEach((collection: Collection)=>{
          collection.paths.forEach((resourcePath: ResourcePath)=>{
            const delIndex = defaultResourcePaths.findIndex(p=>p.key === resourcePath.key)
            if (delIndex > -1) {
              defaultResourcePaths.splice(delIndex, 1)
            }
          })
        })
        state[index].paths = defaultResourcePaths;
      }
      return state
    }
  }
})

export const {collectionCreateSuccess, resourcepathsAddSuccess, resourcepathsDeleteSuccess} = collections.actions

export default collections.reducer