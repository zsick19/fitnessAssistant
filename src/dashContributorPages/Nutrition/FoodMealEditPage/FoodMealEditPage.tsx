import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { useGetSelectFoodMealQuery, useUpdateFoodMealMutation } from '../../../features/FoodMeals/foodMealSliceApi';
import { PaginationInfo } from '../../../models/PaginationInfo';
import Pagination from '../../../components/Pagination';
import ConfirmInitialDetailsStage from './Components/ConfirmInitialDetailsStage';
import SelectIngredientsStage from './Components/SelectIngredientsStage';
import './FoodMealEditPage.css'

import * as jsonpatch from 'fast-json-patch';
import { applyOperation } from 'fast-json-patch';
interface editFoodMealSubmission {
    id: string | undefined,
    name: string | undefined,
    description: string | undefined
    mealIngredients: usedIngredient[]
    mostRecentMealCreationStage: number | undefined
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
    const [editSavedMessage, setEditSavedMessage] = useState<string | undefined>(undefined);
    const [editFormData, setEditFormData] = useState<editFoodMealSubmission>({ id: undefined, name: undefined, description: undefined, mealIngredients: [], mostRecentMealCreationStage: undefined })

    const { data, isError, isSuccess, error, isLoading } = useGetSelectFoodMealQuery({ id })
    const [updateFoodMeal] = useUpdateFoodMealMutation()


    useEffect(() => {
        if (isSuccess) {
            setEditFormData(data)
            setEditFoodMealStage(data.mostRecentMealCreationStage)
        }
    }, [data])


    function provideCurrentStage() {
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

    async function handleSaveProgress() {
        if (id != undefined) {
            try {
                const patch = jsonpatch.compare(data, editFormData)
                if (patch.length > 0) await updateFoodMeal({ id, patchData: patch }).unwrap()
                setEditSavedMessage("Saved")
                setTimeout(() => {
                    setEditSavedMessage(undefined)
                }, 2000);
            } catch (error) {
                console.log(error)
            }
        }
    }


    return (
        <div>
            <h1>Food Meal Edit</h1>

            {isSuccess ? provideCurrentStage() : isLoading ? <div>Loading...</div> : <div>Error</div>}

            <button onClick={handleSaveProgress}>Save Progress</button>
            {editSavedMessage &&
                <p>Saved!</p>
            }

            {<Pagination paginationInfo={new PaginationInfo(editFoodMealStage, 4, null)} onPageChange={setEditFoodMealStage} navigationNeeded={false} />}
        </div>
    )
}

export default FoodMealEditPage