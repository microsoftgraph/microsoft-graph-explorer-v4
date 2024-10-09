import { createAsyncThunk, createSlice, PayloadAction} from '@reduxjs/toolkit';
import { ODATA_ABNF_CONSTRUCTION_RULES_ENDPOINT } from '../graph-constants';

const initialState = ''

export const getRulesText = createAsyncThunk(
  'odataAbnf/getRulesText',
  async (_, { rejectWithValue }) => {
    try {
      const response = await fetch(ODATA_ABNF_CONSTRUCTION_RULES_ENDPOINT);
      if (!response.ok) {
        throw new Error('Failed to fetch the OData ABNF construction rules');
      }
      return await response.text();
    } catch (error) {
      return rejectWithValue(ODATA_ABNF_CONSTRUCTION_RULES_ENDPOINT);
    }
  }
);

const odataAbnfSlice = createSlice({
  name: 'getRules',
  initialState,
  reducers: {
    getRules:(_state, action: PayloadAction<string>) => {
      return action.payload;
    }
  },
  extraReducers: (builder)=> {
    builder.addCase(getRulesText.fulfilled, (_state, action)=>{
      return action.payload;
    });
    builder.addCase(getRulesText.rejected, (_state, action)=>{
      return action.payload as string;
    })
  }
})

export const {getRules} = odataAbnfSlice.actions;
export default odataAbnfSlice.reducer;
