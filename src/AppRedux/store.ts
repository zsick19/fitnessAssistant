import { configureStore } from "@reduxjs/toolkit";
import { apiSlice } from '../AppRedux/api/apiSlice'
import { setupListeners } from "@reduxjs/toolkit/query";

import testReducer from '../features/test/testSlice'
// import authReducer from '../features/auth/authSlice'



export const store = configureStore({
    reducer: {
        [apiSlice.reducerPath]: apiSlice.reducer,
        // auth:authReducer,
        test:testReducer
    },
    middleware: getDefaultMiddleware => getDefaultMiddleware().concat(apiSlice.middleware),
    devTools: true
})

setupListeners(store.dispatch)
