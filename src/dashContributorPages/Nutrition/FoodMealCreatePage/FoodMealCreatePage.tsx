import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom';
import { useCreateFoodMealMutation } from '../../../features/FoodMeals/foodMealSliceApi';
import { isEmptyOrWhitespace } from '../../../services/HelperFunc';
import { useSelector } from 'react-redux';
import { selectMealCategories } from '../../../features/Initializations/InitializationSliceApi';
import { manualRefetchOfInitializedData } from '../../../features/Prefetch';

function FoodMealCreatePage() {
    const navigate = useNavigate();
    const mealCategories = useSelector(selectMealCategories)

    const [allRequiredFields, setAllRequiredFields] = useState(false)
    const [statusMessage, setStatusMessage] = useState('');
    const [formData, setFormData] = useState({ Name: '', MealCategoryId: '', Description: '' })
    const [formErrors, setFormErrors] = useState({})

    const [createFoodMeal, { error }] = useCreateFoodMealMutation()

    let mealCategorySelect
    if (mealCategories.isSuccess) {
        mealCategorySelect = mealCategories.data.map((mealCategory) => {
            return (<option value={mealCategory.id} key={mealCategory.id}>{mealCategory.name}</option>)
        })
    }







    function handleInputChange(e: React.ChangeEvent<HTMLSelectElement | HTMLInputElement | HTMLTextAreaElement>) {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value })
    }

    async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault()

        try {
            const formFileData = new FormData()
            formFileData.append('name', formData.Name);
            formFileData.append('mealCategoryId', formData.MealCategoryId);
            formFileData.append('description', formData.Description);

            const results = await createFoodMeal(formFileData).unwrap();

            setStatusMessage(`${results.name || "Food Meal"} created. Navigating to edit page.`)
            setTimeout(() => { navigate(`/dash/nutrition/contributor/foodMeal/${results.id}/edit`) }, 2000)

        } catch (error: any) {
            console.log(error)
            if ('status' in error) {
                const errMsg = 'error' in error ? error.error : JSON.stringify(error.data)
                setFormErrors(errMsg)
            } else {
                setFormErrors(error.message || 'An unknown error occurred.')
            }
        }
    }


    useEffect(() => {
        setAllRequiredFields(!isEmptyOrWhitespace(formData.Name) && !isEmptyOrWhitespace(formData.MealCategoryId) && !isEmptyOrWhitespace(formData.Description))
    }, [formData])

    return (
        <div>
            <h2>Food Meal Create Page</h2>
            <form onSubmit={handleSubmit}>
                <input type="text" name='Name' value={formData.Name} onChange={(e) => handleInputChange(e)} />

                {mealCategories.isError ? <div><button onClick={() => manualRefetchOfInitializedData()}>Refetch Data</button></div> :
                    <select name="MealCategoryId" id="" onChange={(e) => handleInputChange(e)}>
                        <option>Select a Category</option>
                        {mealCategorySelect}
                    </select>
                }

                <textarea name="Description" id="" value={formData.Description} onChange={(e) => handleInputChange(e)}></textarea>
                <button disabled={!allRequiredFields}>Submit</button>
            </form>

            {statusMessage}
        </div>
    )
}

export default FoodMealCreatePage