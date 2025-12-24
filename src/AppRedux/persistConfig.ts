import storage from "redux-persist/es/storage";

export const persistConfig={
    key:'root',
    storage,
    whiteList:['api']
}

const persistedReducer = persistReducer(persistConfig, rootReducer);
