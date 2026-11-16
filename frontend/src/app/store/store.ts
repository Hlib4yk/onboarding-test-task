import { combineReducers, configureStore } from '@reduxjs/toolkit'
import { paymentReducer } from '@/features/payment/paymentSlice'
import { plansReducer } from '@/features/plans/plansSlice'
import { profileReducer } from '@/features/profile/profileSlice'
import { quizReducer } from '@/features/quiz/quizSlice'
import { flowReducer } from '@/flow/flowSlice'
import { loadPersistedState, persistStore } from './persistence'

const rootReducer = combineReducers({
  flow: flowReducer,
  profile: profileReducer,
  quiz: quizReducer,
  plans: plansReducer,
  payment: paymentReducer,
})

export type RootState = ReturnType<typeof rootReducer>

export const store = configureStore({
  reducer: rootReducer,
  preloadedState: loadPersistedState(),
})

persistStore(store)

export type AppDispatch = typeof store.dispatch
