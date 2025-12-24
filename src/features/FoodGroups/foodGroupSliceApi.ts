import { apiSlice } from "../../AppRedux/api/apiSlice";


export const foodGroupApiSlice = apiSlice.injectEndpoints({
    endpoints: builder => ({
        getAllFoodGroups: builder.query({
            query: () => ({
                url: '/nutrition/foodGroup',
            }),
            keepUnusedDataFor:60000
        })
    })
})

export const {
    useGetAllFoodGroupsQuery
   } = foodGroupApiSlice

