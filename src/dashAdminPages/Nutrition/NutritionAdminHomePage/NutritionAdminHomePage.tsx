import React, { useEffect, useState } from 'react'
import { PaginationInfo } from '../../../models/PaginationInfo';
import Pagination from '../../../components/Pagination';
import { Link, useSearchParams } from 'react-router-dom';
import { useGetAllFoodMealsQuery } from '../../../features/FoodMeals/foodMealSliceApi';

function NutritionAdminHomePage() {
    const [searchParams, setSearchParams] = useSearchParams();
    const [nameSearch, setNameSearch] = useState<string | undefined>(() => { if (searchParams.get('name') == null) return undefined })
    const [currentPage, setCurrentPage] = useState<number>(1)
    const [resultsPerPage, setResultsPerPage] = useState<number>(5)
    const [errorMessage, setErrorMessage] = useState<string>('');
    const [showOnlyUsersMeals, setShowOnlyUsersMeals] = useState<boolean>(false)

    const [paginationInfo, setPaginationInfo] = useState<PaginationInfo | null>(null);



    const { data, error, isSuccess, isLoading, isError, refetch } = useGetAllFoodMealsQuery({
        pageNumber: currentPage, pageSize: resultsPerPage,
        searchByGuid: showOnlyUsersMeals,
        searchMealName: searchParams.get('name') || undefined
    })


    let testResults;
    if (isSuccess && data.data.length > 0) { testResults = data.data.map((summary: any) => { return (<div id={summary.Id}>{summary.name}</div>) }) }
    else if (isSuccess) { testResults = <div>No results</div> }
    else if (isLoading) { testResults = <div>Is Loading</div> }
    else if (isError) {
        if ('status' in error) {
            const errMsg = 'error' in error ? error.error : JSON.stringify(error.data)
            setErrorMessage(errMsg)
        } else {
            setErrorMessage(error.message || 'An unknown error occurred.')
        }
    }

    useEffect(() => {
        if (isSuccess) {
            setPaginationInfo(new PaginationInfo(currentPage, data.totalPages, nameSearch))
            setErrorMessage('')
        }
    }, [data])

    const handleSearch = (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault()
        const params: any = {};
        if (nameSearch) {
            params.name = nameSearch
            params.page = 1
        } else {
            params.page = 1
        }
        setSearchParams(params)
    }

    const handleSearchTermChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        if (event.target.value === '') {
            const params: any = {}
            params.page = 1
            setSearchParams(params)
        }
        setNameSearch(event.target.value)
    }



    return (
        <div>
            <h1>
                NutritionAdminHomePage
            </h1>
            <Link to={'/dash/nutrition/contributor/foodMeal/create'}>Create a New Meal</Link>

            <div>
                <Link to="http://localhost:5173/dash/nutrition/contributor/foodMeal/e7af0e42-ffec-4837-9ca1-ed3c41c78c60/edit">Edit Meal</Link>
            </div>

            <div className='flex'>
                <form onSubmit={handleSearch}>
                    <input type="search" value={nameSearch} onChange={(e) => handleSearchTermChange(e)} placeholder="Meal Search" aria-label="search" />
                    <button type="submit">Search</button>
                </form>
                <form>
                    <label htmlFor="resultsPerPage">Results Per Page</label>
                    <select id='resultsPerPage' onChange={(e) => setResultsPerPage(parseInt(e.target.value))}>
                        <option value='2'>2</option>
                        <option value='5' selected>5</option>
                        <option value='10'>10</option>
                    </select>
                </form>
            </div>

            <button onClick={() => setShowOnlyUsersMeals(prev => !prev)}>{showOnlyUsersMeals ? 'Show All' : 'Show only users'}</button>
            {isError ?
                <div>
                    {errorMessage}
                    <button onClick={() => refetch()}>Refetch</button>
                </div> :
                <div>
                    <h1>Results</h1>
                    {testResults}
                </div>
            }

            {paginationInfo && <Pagination paginationInfo={paginationInfo} onPageChange={setCurrentPage} navigationNeeded={true} />}
        </div>
    )
}

export default NutritionAdminHomePage