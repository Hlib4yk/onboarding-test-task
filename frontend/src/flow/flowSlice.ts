import { createSlice } from '@reduxjs/toolkit'
import { createAppAsyncThunk } from '@/app/store/hooks'
import type { RootState } from '@/app/store/store'
import { findUnknownScreens } from '@/screens/registry'
import { analytics } from '@/shared/analytics/analytics'
import { ApiError } from '@/shared/api/http'
import { t } from '@/shared/i18n'
import { sessionReset } from '@/shared/store/sessionReset'
import { fetchFlow, type FlowData } from './api'

export interface FlowState {
  /** The flow fixed for this session. Persisted, so reloads and payment redirects keep it. */
  data: FlowData | null
  status: 'idle' | 'loading' | 'succeeded' | 'failed'
  /** Flow name of the last request (null = default). Lets the UI tell which request failed. */
  requestedName: string | null
  error: { code: string; message: string } | null
}

const initialState: FlowState = {
  data: null,
  status: 'idle',
  requestedName: null,
  error: null,
}

export const loadFlow = createAppAsyncThunk(
  'flow/load',
  // Errors are thrown (not rejectWithValue'd): RTK serialises ApiError's `code` and
  // `message` into action.error, and we need the code to recognise "flow_not_found".
  async (name: string | null, { getState, dispatch }) => {
    let flow: FlowData
    try {
      flow = await fetchFlow(name)
    } catch (error) {
      analytics.track({
        name: 'flow_failed',
        code: error instanceof ApiError ? error.code : 'unknown',
      })
      throw error
    }
    // Switching to another flow = a new session. Reset only AFTER the new flow loaded,
    // so a link with a typo in ?flow= doesn't wipe the user's progress.
    if (getState().flow.data) dispatch(sessionReset())
    analytics.track({
      name: 'flow_loaded',
      flow: flow.name,
      skippedScreens: findUnknownScreens(flow.screens),
    })
    return flow
  },
  {
    condition: (_, { getState }) => getState().flow.status !== 'loading',
  },
)

const flowSlice = createSlice({
  name: 'flow',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(loadFlow.pending, (state, action) => {
        state.status = 'loading'
        state.requestedName = action.meta.arg
        state.error = null
      })
      .addCase(loadFlow.fulfilled, (state, action) => {
        state.status = 'succeeded'
        state.data = action.payload
      })
      .addCase(loadFlow.rejected, (state, action) => {
        state.status = 'failed'
        state.error = {
          code: action.error.code ?? 'unknown',
          message: action.error.message ?? t.errors.unexpected,
        }
      })
      // Forget the flow, but keep the loading status: a reset can happen in the middle
      // of loadFlow (switching flows), and we must not look "idle" and trigger a second load.
      .addCase(sessionReset, (state) => {
        state.data = null
      })
  },
})

export const flowReducer = flowSlice.reducer

/** Restores the persisted flow: if we have it, it's already "loaded". */
export const rehydrateFlowState = (data: FlowData | null): FlowState => ({
  ...initialState,
  data,
  status: data ? 'succeeded' : 'idle',
  requestedName: data?.name ?? null,
})

export const selectFlowState = (state: RootState) => state.flow
