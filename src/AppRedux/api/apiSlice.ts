import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import {keycloak} from '../../auth/keyCloak'

const rawBaseQuery=fetchBaseQuery({
    baseUrl:'http://localhost:5209',
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
    baseQuery:keycloakBaseQuery,
    tagTypes: [],
    endpoints: builder => ({})
})