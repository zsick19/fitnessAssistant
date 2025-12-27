import { useEffect, useState } from "react"
import SelectedIngredientModal from "./SelectedIngredientModal"
import type { singleIngredient, usedIngredient } from "../FoodMealEditPage";
import { useGetAllRawIngredientsQuery } from "../../../../features/RawIngredients/rawIngredientsSliceApi";
import { PaginationInfo } from "../../../../models/PaginationInfo";
import Pagination from "../../../../components/Pagination";
import { useSelector } from "react-redux";
import { selectFoodGroups } from "../../../../features/Initializations/InitializationSliceApi";
import { manualRefetchOfInitializedData } from "../../../../features/Prefetch";
import EditSelectedIngredientModal from "./EditSelectedIngredientModal";



interface FormProps {
    mealIngredients: usedIngredient[],
    handleAddingIngredient: (usedIngredient: usedIngredient) => void
    handleUpdatingIngredient: (usedIngredient: usedIngredient) => void
    handleRemovingIngredient: (usedIngredient: usedIngredient) => void
}




function SelectIngredientsStage({ mealIngredients, handleAddingIngredient, handleUpdatingIngredient, handleRemovingIngredient }: FormProps) {

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
                            <th>Ingredient</th>
                            <th>Quantity Used</th>
                            <th>Measuring Method</th>
                            <th>Measuring Unit</th>
                            <th>Edit</th>
                            <th>Remove</th>
                        </tr>
                    </thead>
                    <tbody>
                        {mealIngredients.map((ingredient) =>
                        (<tr>
                            <td>{ingredient.name}</td>
                            <td>{ingredient.quantityUsed}</td>
                            <td>{ingredient.measuringMethod}</td>
                            <td>{ingredient.measuringUnit}</td>
                            <td><button onClick={() => setSelectEditIngredient(ingredient)}>Edit</button></td>
                            <td><button onClick={() => handleRemovingIngredient(ingredient)}>Remove</button></td>
                        </tr>)
                        )}
                    </tbody>
                </table>
            </div>

            {selectedIngredient && <SelectedIngredientModal ingredient={selectedIngredient} handleAddingIngredient={handleAddingIngredient} onClose={() => setSelectedIngredient(null)} />}
            {selectEditIngredient && <EditSelectedIngredientModal ingredient={selectEditIngredient} handleUpdatingIngredient={handleUpdatingIngredient} onClose={() => setSelectEditIngredient(null)} />}
        </div>
    )
}

export default SelectIngredientsStage