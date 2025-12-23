import { apiSlice } from "../../AppRedux/api/apiSlice";


export interface FoodMealSummary{
    Id:string,
    name:string,
    Description:string,
    SubmitterName:string
}
interface FoodMealSummaryResponse{
    totalPages:number,
    data:FoodMealSummary[]
}

interface RawTestResponse{
    totalPages:number,
    Data:FoodMealSummary[]
}

export interface FoodMealSummaryRequest{
    pageNumber:Number,
    pageSize:Number,
    searchMealName:string|undefined
}

export const testApiSlice = apiSlice.injectEndpoints({
    endpoints: builder => ({
        connectionTest: builder.query<FoodMealSummaryResponse,FoodMealSummaryRequest>({
            query: (args) => ({
                url: '/nutrition/foodMeal',
                params:args
            }),
            // transformResponse:(response:RawTestResponse):FoodMealSummaryResponse=>{
            //     console.log(response)
            //     return {
            //         totalPages:response.totalPages,
            //         data:response.Data
            //     }
                
            // }
        }),
  
    })
})

export const {
    useConnectionTestQuery,
   } = testApiSlice