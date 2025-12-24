import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { useGetSelectFoodMealQuery } from '../../../features/FoodMeals/foodMealSliceApi';
import { PaginationInfo } from '../../../models/PaginationInfo';
import Pagination from '../../../components/Pagination';
import ConfirmInitialDetailsStage from './Components/ConfirmInitialDetailsStage';
import SelectIngredientsStage from './Components/SelectIngredientsStage';
import './FoodMealEditPage.css'

interface editFoodMealSubmission {
    id: string | undefined,
    name: string | undefined,
    description: string | undefined
    mealIngredients: usedIngredient[]
    lastSavedPosition: number | undefined
}

export interface usedIngredient {
    id: string
    name: string
    quantityUsed: number | undefined
    measuringMethod: string | undefined
}




export interface singleIngredient {
    id: string,
    name: string
}


function FoodMealEditPage() {

    const { id } = useParams();
    const [editFoodMealStage, setEditFoodMealStage] = useState<number>(1)
    const [editFormData, setEditFormData] = useState<editFoodMealSubmission>({ id: undefined, name: undefined, description: undefined, mealIngredients: [], lastSavedPosition: undefined })

    const { data, isError, isSuccess, error, isLoading } = useGetSelectFoodMealQuery({ id })


    useEffect(() => {
        if (isSuccess) {
            let copyData: editFoodMealSubmission = { ...data }
            copyData.lastSavedPosition = 2
            copyData.mealIngredients = [{ id: 'eed38', name: 'steak', quantityUsed: 8, measuringMethod: 'ounces' }]
            setEditFormData(data)

            setEditFoodMealStage(copyData.lastSavedPosition)
        }

    }, [data])


    const provideCurrentStage = () => {
        if (editFoodMealStage == 1) return <ConfirmInitialDetailsStage handleFormDataChange={handleFormDataChange} name={editFormData?.name} description={editFormData?.description} />
        else if (editFoodMealStage == 2) return <SelectIngredientsStage mealIngredients={editFormData.mealIngredients} handleAddingIngredient={handleAddingIngredient} handleRemovingIngredient={handleRemovingIngredient} />
        else if (editFoodMealStage == 3) return <div>stage 3</div>
    }


    function handleFormDataChange(event: React.ChangeEvent<HTMLSelectElement | HTMLInputElement | HTMLTextAreaElement>): void {
        const { name, value } = event.target;
        setEditFormData({ ...editFormData, [name]: value })
    }

    function handleAddingIngredient(ingredientToAdd: usedIngredient): void {
        let additionalIngredients = [...editFormData.mealIngredients, ingredientToAdd]
        setEditFormData({ ...editFormData, mealIngredients: additionalIngredients })
    }

    function handleRemovingIngredient(ingredientToRemove: usedIngredient): void {
        let ingredientsPostRemoval = [...editFormData.mealIngredients].filter(ingredient => ingredient.id != ingredientToRemove.id)
        setEditFormData({ ...editFormData, mealIngredients: ingredientsPostRemoval })
    }

    function handleSaveProgress() {
        console.log(editFormData)
    }


    return (
        <div>
            FoodMealEditPage
            <h1>                {editFoodMealStage}            </h1>

            {isSuccess ? provideCurrentStage() : isLoading ? <div></div> : <div>Error</div>}



            <button onClick={handleSaveProgress}>Save Progress</button>

            {<Pagination paginationInfo={new PaginationInfo(editFoodMealStage, 4, null)} onPageChange={setEditFoodMealStage} navigationNeeded={false} />}


        </div>
    )
}

export default FoodMealEditPage