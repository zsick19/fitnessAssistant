import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom';
import { useCreateFoodMealMutation } from '../../../features/FoodMeals/foodMealSliceApi';

function FoodMealCreatePage() {

    const [allRequiredFields, setAllRequiredFields] = useState(false)
    const [statusMessage, setStatusMessage] = useState('');

    const sampleCatData = [{ id: '881E3995-99B1-4B46-9968-7FD3166B538F', name: 'b' }, { id: 222, name: 'c' }]

    const [formData, setFormData] = useState({
        Name: '',
        MealCategoryId: '',
        Description: ''
    })

    const [formErrors, setFormErrors] = useState({})


    const [createFoodMeal, { error }] = useCreateFoodMealMutation()


    const handleInputChange = (e: React.ChangeEvent<HTMLSelectElement | HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value
        })
    }

    const navigate = useNavigate();

    async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault()
        console.log(formData)
        try {
            const formFileData = new FormData()
            formFileData.append('name', formData.Name);
            formFileData.append('mealCategoryId', formData.MealCategoryId);
            formFileData.append('description', formData.Description);

            const results = await createFoodMeal(formFileData)

            setStatusMessage(`${results.data?.name || "Food Meal"} created. Navigating to edit page.`)
            setTimeout(() => { navigate(`/dash/nutrition/contributor/foodMeal/${results.data?.id}/edit`) }, 2000)

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

    const isEmptyOrWhitespace = (str: string | undefined) => {

        return !str || !str.trim() || str === undefined;
    };

    useEffect(() => {
        console.log(formData)
        setAllRequiredFields(!isEmptyOrWhitespace(formData.Name) && !isEmptyOrWhitespace(formData.MealCategoryId) && !isEmptyOrWhitespace(formData.Description))
    }, [formData])

    return (
        <div>FoodMealCreatePage
            <form onSubmit={handleSubmit}>
                <input type="text" name='Name' value={formData.Name} onChange={(e) => handleInputChange(e)} />

                <select name="MealCategoryId" id="" onChange={(e) => handleInputChange(e)}>
                    <option>Select a Category</option>
                    {sampleCatData.map((sample) => {
                        return (<option value={sample.id} key={sample.id}>{sample.name}</option>)
                    })}
                </select>

                <textarea name="Description" id="" value={formData.Description} onChange={(e) => handleInputChange(e)}></textarea>
                <button disabled={!allRequiredFields}>Submit</button>
            </form>

            {statusMessage}
        </div>
    )
}

export default FoodMealCreatePage