import { apiSlice } from "../../AppRedux/api/apiSlice";

export const testApiSlice = apiSlice.injectEndpoints({
    endpoints: builder => ({
        connectionTest: builder.query({
            query: () => ({
                url: '/nutrition/foodMeal',
            }),
            transformResponse:(response)=>{
                console.log(response)
            }
        }),
  
    })
})

export const {
    useConnectionTestQuery,
   } = testApiSlice