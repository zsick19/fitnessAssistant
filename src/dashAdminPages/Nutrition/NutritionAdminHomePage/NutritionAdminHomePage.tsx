import React, { useEffect, useState } from 'react'
import { useConnectionTestQuery } from '../../../features/test/testSliceApi'
import { PaginationInfo } from '../../../models/PaginationInfo';
import Pagination from '../../../components/Pagination';
import { Link, useSearchParams } from 'react-router-dom';

function NutritionAdminHomePage() {
    const [searchParams, setSearchParams] = useSearchParams();
    const [nameSearch, setNameSearch] = useState<string | undefined>(() => { if (searchParams.get('name') == null) return undefined })
    const [currentPage, setCurrentPage] = useState<number>(1)
    const [resultsPerPage, setResultsPerPage] = useState<number>(5)
    const [errorMessage, setErrorMessage] = useState<string>('');

    const [paginationInfo, setPaginationInfo] = useState<PaginationInfo | null>(null);



    const { data, error, isSuccess, isLoading, isError, refetch } = useConnectionTestQuery({ pageNumber: currentPage, pageSize: resultsPerPage, searchMealName: searchParams.get('name') || undefined })


    let testResults;
    if (isSuccess && data.data.length > 0) { testResults = data.data.map((summary) => { return (<div id={summary.Id}>{summary.name}</div>) }) }
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

            <div className='flex'>
                <form onSubmit={handleSearch}>
                    <input type="search" value={nameSearch || ''} onChange={(e) => handleSearchTermChange(e)} placeholder="Meal Search" aria-label="search" />
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

            {paginationInfo && <Pagination paginationInfo={paginationInfo} onPageChange={setCurrentPage} />}
        </div>
    )
}

export default NutritionAdminHomePage