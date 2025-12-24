import { apiSlice } from "../../AppRedux/api/apiSlice";

export interface RawIngredientSummary{
    id:string,
    name:string,
    calories:number,
    unitOfMeasurement:string,
    baseLineMeasurement:string,
    foodGroup:string,
    protein:number
}
interface RawIngredientSummaryResponse{
    totalPages:number,
    rawIngredients:RawIngredientSummary[]
}


export interface RawIngredientSummaryPageRequest{
    pageNumber:number,
    pageSize:number,
    searchName:string|undefined
    searchCategory:string|undefined
}


export const rawIngredientApiSlice = apiSlice.injectEndpoints({
    endpoints: builder => ({
        getAllRawIngredients: builder.query<RawIngredientSummaryResponse,RawIngredientSummaryPageRequest>({
            query: (args) => ({
                url: '/nutrition/ingredients',
                params:{...args}
            }),
        })
    })
})

export const {
    useGetAllRawIngredientsQuery
   } = rawIngredientApiSlice