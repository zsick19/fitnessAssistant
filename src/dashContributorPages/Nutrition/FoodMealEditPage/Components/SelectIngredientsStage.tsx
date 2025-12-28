import { useEffect, useState, type FormEvent } from "react"
import SelectedIngredientModal from "./SelectedIngredientModal"
import type { editFoodMealSubmission, singleIngredient, usedIngredient } from "../FoodMealEditPage";
import { useGetAllRawIngredientsQuery } from "../../../../features/RawIngredients/rawIngredientsSliceApi";
import { PaginationInfo } from "../../../../models/PaginationInfo";
import Pagination from "../../../../components/Pagination";
import { useSelector } from "react-redux";
import { selectFoodGroups } from "../../../../features/Initializations/InitializationSliceApi";
import { manualRefetchOfInitializedData } from "../../../../features/Prefetch";
import EditSelectedIngredientModal from "./EditSelectedIngredientModal";



interface FormProps {
    mealIngredients: usedIngredient[],
    editFormData: editFoodMealSubmission
    handleAddingIngredient: (usedIngredient: usedIngredient) => void
    handleUpdatingIngredient: (usedIngredient: usedIngredient) => void
    handleRemovingIngredient: (usedIngredient: usedIngredient) => void
    handleFoodOutputChange: (event: React.FocusEvent<HTMLFormElement>) => void
}




function SelectIngredientsStage({ mealIngredients, editFormData, handleAddingIngredient, handleUpdatingIngredient, handleRemovingIngredient, handleFoodOutputChange }: FormProps) {

    const [selectedIngredient, setSelectedIngredient] = useState<singleIngredient | null>(null)
    const [selectEditIngredient, setSelectEditIngredient] = useState<usedIngredient | null>(null)

    const [search, setSearch] = useState<string | undefined>(undefined)
    const [currentPage, setCurrentPage] = useState<number>(1)
    const [errorMessage, setErrorMessage] = useState<string>('');
    const [paginationInfo, setPaginationInfo] = useState<PaginationInfo | null>(null);
    const [searchParams, setSearchParams] = useState<string | undefined>(undefined)
    const [searchCategory, setSearchCategory] = useState<string | undefined>(undefined)
    const resultsPerPage = 5


    let foodGroupSelectOptions;
    const { foodGroups, isSuccess: isFoodGroupSuccess, isError: isFoodGroupError } = useSelector(selectFoodGroups)
    if (isFoodGroupSuccess) {
        foodGroupSelectOptions = foodGroups.map((foodGroup) => {
            return (
                <>
                    <input type="radio" name="ingredientCategory" id={foodGroup.name} value={foodGroup.id} />
                    <label htmlFor={foodGroup.name}>{foodGroup.name}</label>
                </>
            )
        })
    }

    let rawIngredientSearchResults;
    const { data, isSuccess, isError, isLoading } = useGetAllRawIngredientsQuery({ pageNumber: currentPage, pageSize: resultsPerPage, searchName: searchParams, searchCategory: searchCategory })
    if (isSuccess && data.rawIngredients.length > 0) {
        rawIngredientSearchResults = data.rawIngredients.map((rawIngredient) => {
            return (
                <div className="rawIngredientCard" key={rawIngredient.id} onClick={() => setSelectedIngredient(rawIngredient)} >
                    <p>{rawIngredient.foodGroup}</p>
                    <p>{rawIngredient.name}</p>
                    <p>{rawIngredient.calories} Calories</p>
                    <p>{rawIngredient.protein} Grams of Protein</p>
                </div>
            )
        })
    }
    else if (isSuccess) { rawIngredientSearchResults = <div>No matching results</div> }
    else if (isLoading) { rawIngredientSearchResults = <div>Loading...</div> }
    else if (isError) { rawIngredientSearchResults = <div>Error loading results</div> }



    useEffect(() => {
        if (isSuccess) {
            setPaginationInfo(new PaginationInfo(currentPage, data.totalPages, null))
            setErrorMessage('')
        }
    }, [data])


    function handleSearchTermChange(event: React.ChangeEvent<HTMLInputElement>) {
        if (event.target.value === '') {
            setSearch(undefined)
            setSearchParams(undefined)
        } else {
            setSearch(event.target.value)
        }
    }
    function handleCategorySearchChange(event: React.FormEvent<HTMLFieldSetElement>) {
        const target = event.target as HTMLInputElement
        if (target.value === 'allCategories') setSearchCategory(undefined)
        else { setSearchCategory(target.value) }
    }
    function handleSearch(event: React.FormEvent<HTMLFormElement>) {
        event.preventDefault();
        setSearchParams(search)
    }


    return (
        <div>
            <h2>Select Ingredients Stage</h2>
            <div>
                <form className="flex" onSubmit={handleSearch}>
                    {isFoodGroupError ? <div><button onClick={() => manualRefetchOfInitializedData()}>Refetch Initialized Data</button></div> :
                        <fieldset onChange={handleCategorySearchChange}>
                            <legend>Filter By Category</legend>
                            <input type="radio" name="ingredientCategory" id="allCategories" value="allCategories" />
                            <label htmlFor="allCategories">All</label>
                            {foodGroupSelectOptions}
                        </fieldset>
                    }

                    <div>
                        <input type="text" placeholder="Search" onChange={handleSearchTermChange} />
                        <button>Search</button>
                        {errorMessage}
                    </div>
                </form>

                <div>
                    <div className="flex">
                        {rawIngredientSearchResults}
                    </div>
                    {paginationInfo && <Pagination paginationInfo={paginationInfo} onPageChange={setCurrentPage} navigationNeeded={false} />}
                </div>
            </div>

            <div>
                <h2>Ingredient List</h2>
                <table>
                    <thead>
                        <tr>
                            <th>Ingredient Name</th>
                            <th>Quantity Used</th>
                            <th>Calorie Count</th>
                            <th>Protein(Grams)</th>
                            <th>Edit</th>
                            <th>Remove</th>
                        </tr>
                    </thead>
                    <tbody>
                        {mealIngredients.map((ingredient) =>
                        (<tr>
                            <td>{ingredient.name}</td>
                            <td>{ingredient.quantityUsed} {ingredient.measuringUnit}</td>
                            <td>{ingredient.totalCalories} Calories</td>
                            <td>{ingredient.totalProteinGrams?.toFixed(2)} G</td>
                            <td><button onClick={() => setSelectEditIngredient(ingredient)}>Edit</button></td>
                            <td><button onClick={() => handleRemovingIngredient(ingredient)}>Remove</button></td>
                        </tr>)
                        )}
                    </tbody>
                </table>
                <p>Total Calories {editFormData.totalCalories.toFixed(2)}</p>
                <p>Total Protein {editFormData.totalProtein.toFixed(2)} Grams</p>
                <br />
                <div>
                    <h2>Total Food Output</h2>

                    <form onChange={handleFoodOutputChange} className="flex">
                        <input type="number" min={0} name="totalFoodOutputQuantity" id="totalFoodOutputQuantity" value={editFormData.totalFoodOutputQuantity} />
                        <select name="totalFoodMeasurementUnit" id="totalFoodOutputMeasurementUnit">
                            <option value="cup">Cup</option>
                            <option value="pound">Pound</option>
                        </select>
                        <div>
                            <label htmlFor="numberOfServings">Number of Servings: </label>
                            <input type="number" name="numberOfServings" id="numberOfServings" min={1} value={editFormData.numberOfServings} />
                        </div>
                    </form>
                    <br />

                    <div className="flex">
                        <p>Serving Size: {(editFormData.totalFoodOutputQuantity && editFormData.numberOfServings) && editFormData.totalFoodOutputQuantity / editFormData.numberOfServings} {editFormData.totalFoodMeasurementUnit}</p>
                        <div className="flex">
                            <p>Per Serving:</p>
                            <p>350 Calories</p>
                            <p>23g Protein</p>
                        </div>
                    </div>
                    <br />
                    <div>
                        <form onChange={handleFoodOutputChange}>
                            <fieldset className="flex">
                                <legend>Serving visual on a large plate:</legend>
                                <div>
                                    <input type="radio" name="largePlateSize" id="largePlateEighth" value='Eighth' />
                                    <label htmlFor="largePlateEighth">1/8</label>
                                </div>
                                <div>
                                    <input type="radio" name="largePlateSize" id="largePlateFourth" value='Fourth' />
                                    <label htmlFor="largePlateFourth">1/4</label>
                                </div>
                                <div>
                                    <input type="radio" name="largePlateSize" id="largePlateThird" value='Third' />
                                    <label htmlFor="largePlateThird">1/3</label>
                                </div>
                                <div>
                                    <input type="radio" name="largePlateSize" id="largePlateHalf" value='Half' />
                                    <label htmlFor="largePlateHalf">1/2</label>
                                </div>
                                <div>
                                    <input type="radio" name="largePlateSize" id="largePlateTwoThirds" value='TwoThirds' />
                                    <label htmlFor="largePlateTwoThirds">2/3</label>
                                </div>
                                <div>
                                    <input type="radio" name="largePlateSize" id="largePlateThreeFourths" value='ThreeFourths' />
                                    <label htmlFor="largePlateThreeFourths">3/4</label>
                                </div>
                                <div>
                                    <input type="radio" name="largePlateSize" id="largePlateWhole" value='Whole' />
                                    <label htmlFor="largePlateWhole">Whole</label>
                                </div>
                            </fieldset>

                            <fieldset className="flex">
                                <legend>Serving visual on a small plate:</legend>
                                <div>
                                    <input type="radio" name="smallPlateSize" id="smallPlateEighth" value='Eighth' />
                                    <label htmlFor="smallPlateEighth">1/8</label>
                                </div>
                                <div>
                                    <input type="radio" name="smallPlateSize" id="smallPlateFourth" value='Fourth' />
                                    <label htmlFor="smallPlateFourth">1/4</label>
                                </div>
                                <div>
                                    <input type="radio" name="smallPlateSize" id="smallPlateThird" value='Third' />
                                    <label htmlFor="smallPlateThird">1/3</label>
                                </div>
                                <div>
                                    <input type="radio" name="smallPlateSize" id="smallPlateHalf" value='Half' />
                                    <label htmlFor="smallPlateHalf">1/2</label>
                                </div>
                                <div>
                                    <input type="radio" name="smallPlateSize" id="smallPlateTwoThirds" value='TwoThirds' />
                                    <label htmlFor="smallPlateTwoThirds">2/3</label>
                                </div>
                                <div>
                                    <input type="radio" name="smallPlateSize" id="smallPlateThreeFourths" value='ThreeFourths' />
                                    <label htmlFor="smallPlateThreeFourths">3/4</label>
                                </div>
                                <div>
                                    <input type="radio" name="smallPlateSize" id="smallPlateWhole" value='Whole' />
                                    <label htmlFor="smallPlateWhole">Whole</label>
                                </div>
                            </fieldset>

                            <fieldset className="flex">
                                <legend>Serving visual in a bowl:</legend>
                                <div>
                                    <input type="radio" name="bowlSize" id="largeBowlEighth" value='Eighth' />
                                    <label htmlFor="largeBowlEighth">1/8</label>
                                </div>
                                <div>
                                    <input type="radio" name="bowlSize" id="largeBowlFourth" value='Fourth' />
                                    <label htmlFor="largeBowlFourth">1/4</label>
                                </div>
                                <div>
                                    <input type="radio" name="bowlSize" id="largeBowlThird" value='Third' />
                                    <label htmlFor="largeBowlThird">1/3</label>
                                </div>
                                <div>
                                    <input type="radio" name="bowlSize" id="largeBowlHalf" value='Half' />
                                    <label htmlFor="largeBowlHalf">1/2</label>
                                </div>
                                <div>
                                    <input type="radio" name="bowlSize" id="largeBowlTwoThirds" value='TwoThirds' />
                                    <label htmlFor="largeBowlTwoThirds">2/3</label>
                                </div>
                                <div>
                                    <input type="radio" name="bowlSize" id="largeBowlThreeFourths" value='ThreeFourths' />
                                    <label htmlFor="largeBowlThreeFourths">3/4</label>
                                </div>
                                <div>
                                    <input type="radio" name="bowlSize" id="largeBowlWhole" value='Whole' />
                                    <label htmlFor="largeBowlWhole">Whole</label>
                                </div>
                            </fieldset>
                        </form>
                    </div>
                </div>
            </div>
            <br />
            {selectedIngredient && <SelectedIngredientModal ingredient={selectedIngredient} handleAddingIngredient={handleAddingIngredient} onClose={() => setSelectedIngredient(null)} />}
            {selectEditIngredient && data?.rawIngredients && <EditSelectedIngredientModal ingredient={selectEditIngredient} rawIngredient={data.rawIngredients.find(t => t.id === selectEditIngredient.rawIngredientId)!} handleUpdatingIngredient={handleUpdatingIngredient} onClose={() => setSelectEditIngredient(null)} />}
        </div>
    )
}

export default SelectIngredientsStage