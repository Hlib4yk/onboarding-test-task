import { createAsyncThunk } from '@reduxjs/toolkit'
import { useDispatch, useSelector } from 'react-redux'
import type { AppDispatch, RootState } from './store'

/** Pre-typed versions of the Redux hooks — use these instead of the plain ones. */
export const useAppDispatch = useDispatch.withTypes<AppDispatch>()
export const useAppSelector = useSelector.withTypes<RootState>()

/**
 * createAsyncThunk that already knows RootState and AppDispatch.
 * Convention: a thunk rejects with a user-facing message (`rejectWithValue(message)`).
 */
export const createAppAsyncThunk = createAsyncThunk.withTypes<{
  state: RootState
  dispatch: AppDispatch
  rejectValue: string
}>()
