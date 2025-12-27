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

interface FoodMealUpdateRequest{
    id:string,
    patchData:any,    
}


export const foodMealApiSlice = apiSlice.injectEndpoints({
    endpoints: builder => ({
        getAllFoodMeals: builder.query<FoodMealSummaryResponse,FoodMealSummaryRequestMain>({
            query: (args) => ({
                url: '/nutrition/foodMeal',
                params:args
            }),
        }),
        getSelectFoodMeal:builder.query({
            query:(args)=>({
                url:`/nutrition/foodMeal/${args.id}`
            }),
            transformResponse:(response)=>{
                let mealIngredients=response.mealIngredients
                mealIngredients.forEach((rawIngredient: { name: any; rawIngredient: { name: any; }; }) => {rawIngredient.name=rawIngredient.rawIngredient.name});
                response.mealIngredients=mealIngredients
                return response                
            }
        }),
        createFoodMeal:builder.mutation<FoodMealCreatedResponse,FormData>({
            query:(args)=>({
                url:'/nutrition/foodMeal',
                method:'POST',
                body:args
            })
        }),
        updateFoodMeal:builder.mutation<void,FoodMealUpdateRequest>({
            query:({id,patchData})=>{
                const formData=new FormData()
                formData.append('patchDoc',JSON.stringify(patchData))
                // if (file) formData.append('avatar', file);
            return{
                url:`/nutrition/foodMeal/${id}`,
                method:'PATCH',
                body:formData
                }
            }
        })  
    })
})

export const {
    useGetAllFoodMealsQuery,
    useGetSelectFoodMealQuery,
    useCreateFoodMealMutation,
    useUpdateFoodMealMutation
   } = foodMealApiSlice