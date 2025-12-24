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


interface FoodMealCreatedResponse{
    id:string,
    name:string,
    description:string,
    mealCategoryId:string,
    submittedPhotos:string[]
}


export interface FoodMealSummaryRequestMain{
    pageNumber:Number,
    pageSize:Number,
    searchMealName:string|undefined,
    searchByGuid:boolean|undefined
}



export const foodMealApiSlice = apiSlice.injectEndpoints({
    endpoints: builder => ({
        getAllFoodMeals: builder.query<FoodMealSummaryResponse,FoodMealSummaryRequestMain>({
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
        getSelectFoodMeal:builder.query({
            query:(args)=>({
                url:`/nutrition/foodMeal/${args.id}`
            })
        }),
        createFoodMeal:builder.mutation<FoodMealCreatedResponse,FormData>({
            query:(args)=>({
                url:'/nutrition/foodMeal',
                method:'POST',
                body:args
            })
        })  
    })
})

export const {
    useGetAllFoodMealsQuery,
    useGetSelectFoodMealQuery,
    useCreateFoodMealMutation
   } = foodMealApiSlice