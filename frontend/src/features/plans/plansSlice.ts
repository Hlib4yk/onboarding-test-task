import { createSlice } from '@reduxjs/toolkit'
import { createAppAsyncThunk } from '@/app/store/hooks'
import type { RootState } from '@/app/store/store'
import { getErrorMessage } from '@/shared/api/http'
import { fetchPlans, type Plan } from './api'

/** Plans catalogue from the backend. Not persisted: it is cheap to fetch and may change. */
export interface PlansState {
  items: Plan[]
  status: 'idle' | 'loading' | 'succeeded' | 'failed'
  error: string | null
}

const initialState: PlansState = { items: [], status: 'idle', error: null }

export const loadPlans = createAppAsyncThunk(
  'plans/load',
  async (_, { rejectWithValue }) => {
    try {
      return await fetchPlans()
    } catch (error) {
      return rejectWithValue(getErrorMessage(error))
    }
  },
  {
    // Don't refetch if we already have plans or a request is in flight (StrictMode, remounts).
    condition: (_, { getState }) => {
      const { status } = getState().plans
      return status !== 'loading' && status !== 'succeeded'
    },
  },
)

const plansSlice = createSlice({
  name: 'plans',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(loadPlans.pending, (state) => {
        state.status = 'loading'
        state.error = null
      })
      .addCase(loadPlans.fulfilled, (state, action) => {
        state.status = 'succeeded'
        state.items = action.payload
      })
      .addCase(loadPlans.rejected, (state, action) => {
        state.status = 'failed'
        state.error = action.payload ?? getErrorMessage(action.error)
      })
  },
})

export const plansReducer = plansSlice.reducer

export const selectPlans = (state: RootState) => state.plans.items
export const selectPlansStatus = (state: RootState) => state.plans.status
export const selectPlansError = (state: RootState) => state.plans.error
export const selectPlanById = (state: RootState, id: string | null) =>
  state.plans.items.find((plan) => plan.id === id)
