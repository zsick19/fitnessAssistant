import { createSelector } from "@reduxjs/toolkit";
import { apiSlice } from "../../AppRedux/api/apiSlice";


interface AdminLevelInitializeResponse{
    foodGroups:{id:string,name:string}[],
    mealCategories:{id:string,name:string}[]
}

export const InitializationApiSlice = apiSlice.injectEndpoints({
    endpoints: builder => ({
        getAdminLevelInitialization: builder.query<AdminLevelInitializeResponse,void>({
            query: () => ({
                url: '/nutrition/initialize/admin',
            }),
            keepUnusedDataFor:60000
        })
    })
})

export const {
    useGetAdminLevelInitializationQuery
   } = InitializationApiSlice

const selectAdminInitializeResult=InitializationApiSlice.endpoints.getAdminLevelInitialization.select(undefined)


export const selectFoodGroups=createSelector(selectAdminInitializeResult,(result)=>{
    return {
        foodGroups:result.data?.foodGroups??[],
        isSuccess:result.isSuccess, isLoading:result.isLoading, isError:result.isError
}})

export const selectMealCategories=createSelector(selectAdminInitializeResult,(result)=>{
    return{
        data:result.data?.mealCategories??[],
        isSuccess:result.isSuccess, isLoading:result.isLoading, isError:result.isError
}})