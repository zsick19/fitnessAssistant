import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import {keycloak} from '../../auth/keyCloak'
import { REHYDRATE } from "redux-persist";

const rawBaseQuery=fetchBaseQuery({
    baseUrl: import.meta.env.VITE_BACKEND_API_URL,
    prepareHeaders:(headers,{getState})=>{
        if(keycloak.authenticated && keycloak.token){
            headers.set('Authorization', `Bearer ${keycloak.token}`)
        }
        return headers;
    }
})


const keycloakBaseQuery=async(args:any,api:any,extraOptions:any)=>{
try {
    const minValidity=30;
    await keycloak.updateToken(minValidity);
} catch (error) {
    console.log('Failed to refresh token', error)
    keycloak.logout()
    return {error:{status:401, data:'Unauthorized - Token Refresh Failed'}}
}
return rawBaseQuery(args,api,extraOptions);
}


export const apiSlice = createApi({
    reducerPath:'myApi',
    baseQuery:keycloakBaseQuery,
    // extractRehydrationInfo(action: any, {reducerPath}: any){
    //     if(action.type===REHYDRATE){
    //         return action.payload?.[reducerPath as keyof typeof action.payload]
    //     }
    // },
    tagTypes: [],
    endpoints: builder => ({})
})