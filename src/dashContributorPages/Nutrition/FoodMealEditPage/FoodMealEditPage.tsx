import React, { useEffect, useState, type FormEvent } from 'react'
import { useParams } from 'react-router-dom'
import { useGetSelectFoodMealQuery, useUpdateFoodMealMutation } from '../../../features/FoodMeals/foodMealSliceApi';
import { PaginationInfo } from '../../../models/PaginationInfo';
import Pagination from '../../../components/Pagination';
import ConfirmInitialDetailsStage from './Components/ConfirmInitialDetailsStage';
import SelectIngredientsStage from './Components/SelectIngredientsStage';
import './FoodMealEditPage.css'
import * as jsonpatch from 'fast-json-patch';


export interface editFoodMealSubmission {
    id: string | undefined,
    name: string | undefined,
    description: string | undefined
    mealIngredients: usedIngredient[]
    mostRecentMealCreationStage: number | undefined
    totalCalories: number
    totalProtein: number
    totalFoodOutputQuantity: number | undefined
    totalFoodMeasurementUnit: string | undefined
    numberOfServings: number | undefined
    servingSizePerMeasuringUnit: number | undefined
    largePlateSize: string | undefined
    smallPlateSize: string | undefined
    bowlSize: string | undefined
    caloriesPerServing: number | undefined
    proteinPerServing: number | undefined
}


export interface usedIngredient {
    rawIngredientId: string
    name: string
    quantityUsed: number | undefined
    measuringMethod: string | undefined
    measuringUnit: string | undefined
    FoodMealId: string,
    totalCalories: number,
    totalProteinGrams: number
}
export interface singleIngredient {
    id: string,
    name: string,
    calories: number,
    unitOfMeasurement: string,
    baseLineMeasurement: number,
    protein: number,
    foodGroup: string
}



function FoodMealEditPage() {
    const { id } = useParams();
    const [editFoodMealStage, setEditFoodMealStage] = useState<number>(1)
    const [editSavedMessage, setEditSavedMessage] = useState<string | undefined>(undefined);
    const [editFormData, setEditFormData] = useState<editFoodMealSubmission>({
        id: undefined, name: undefined, description: undefined, mealIngredients: [], mostRecentMealCreationStage: undefined, totalFoodOutputQuantity: undefined, numberOfServings: undefined, totalCalories: 0, totalProtein: 0,
        totalFoodMeasurementUnit: undefined, servingSizePerMeasuringUnit: undefined, caloriesPerServing: undefined, proteinPerServing: undefined, largePlateSize: undefined, smallPlateSize: undefined, bowlSize: undefined
    })

    const { data, isError, isSuccess, error, isLoading } = useGetSelectFoodMealQuery({ id })
    const [updateFoodMeal] = useUpdateFoodMealMutation()


    useEffect(() => {
        if (isSuccess) {
            setEditFormData({ ...data, totalCalories: 0, totalProtein: 0 })
            setEditFoodMealStage(data.mostRecentMealCreationStage)
        }
    }, [data])


    function provideCurrentStage() {
        if (editFoodMealStage == 1) return <ConfirmInitialDetailsStage handleFormDataChange={handleFormDataChange} name={editFormData?.name} description={editFormData?.description} />
        else if (editFoodMealStage == 2) return <SelectIngredientsStage mealIngredients={editFormData.mealIngredients} editFormData={editFormData}
            handleAddingIngredient={handleAddingIngredient}
            handleUpdatingIngredient={handleUpdatingIngredient}
            handleRemovingIngredient={handleRemovingIngredient}
            handleFoodOutputChange={handleFoodOutputChange}
        />
        else if (editFoodMealStage == 3) return <div>stage 3</div>
    }

    function handleFormDataChange(event: React.ChangeEvent<HTMLSelectElement | HTMLInputElement | HTMLTextAreaElement>): void {
        const { name, value } = event.target;
        setEditFormData({ ...editFormData, [name]: value })
    }

    function handleAddingIngredient(ingredientToAdd: usedIngredient): void {
        let additionalIngredients = [...editFormData.mealIngredients, ingredientToAdd]
        console.log(ingredientToAdd)
        let calories = editFormData.totalCalories + ingredientToAdd.totalCalories
        let protein = editFormData.totalProtein + ingredientToAdd.totalProteinGrams
        setEditFormData({ ...editFormData, mealIngredients: additionalIngredients, totalCalories: calories, totalProtein: protein })
    }

    function handleRemovingIngredient(ingredientToRemove: usedIngredient): void {
        let ingredientsPostRemoval = [...editFormData.mealIngredients].filter(ingredient => ingredient.rawIngredientId != ingredientToRemove.rawIngredientId)
        let calories = editFormData.totalCalories - ingredientToRemove.totalCalories
        let protein = editFormData.totalProtein - ingredientToRemove.totalProteinGrams
        setEditFormData({ ...editFormData, mealIngredients: ingredientsPostRemoval, totalCalories: calories, totalProtein: protein })
    }

    function handleUpdatingIngredient(ingredientToUpdate: usedIngredient): void {
        var indexOfUpdate = editFormData.mealIngredients.findIndex((t) => t.rawIngredientId === ingredientToUpdate.rawIngredientId)
        var copyArray = editFormData.mealIngredients
        copyArray[indexOfUpdate] = ingredientToUpdate

        let calorieResult = 0
        let proteinResult = 0
        copyArray.map((ingredient) => {
            calorieResult = calorieResult + ingredient.totalCalories
            proteinResult = proteinResult + ingredient.totalProteinGrams
        })
        setEditFormData(prev => ({ ...prev, mealIngredients: copyArray, totalCalories: calorieResult, totalProtein: proteinResult }))
    }


    function handleFoodOutputChange(event: React.FocusEvent<HTMLFormElement>) {
        setEditFormData({ ...editFormData, [event.target.name]: event.target.value })
    }




    async function handleSaveProgress() {
        if (id != undefined) {
            try {
                const patch = jsonpatch.compare(data, { ...editFormData, mostRecentMealCreationStage: editFoodMealStage })
                if (patch.length > 0) await updateFoodMeal({ id, patchData: patch }).unwrap()

                setEditSavedMessage("Saved")
                setTimeout(() => { setEditSavedMessage(undefined) }, 2000);
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
            {editSavedMessage && <p>Saved!</p>}

            {<Pagination paginationInfo={new PaginationInfo(editFoodMealStage, 4, null)} onPageChange={setEditFoodMealStage} navigationNeeded={false} />}
        </div>
    )
}

export default FoodMealEditPage