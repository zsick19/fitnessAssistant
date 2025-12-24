
import { useEffect } from 'react'
import { store } from '../AppRedux/store';
import { foodGroupApiSlice } from './FoodGroups/foodGroupSliceApi';
import { Outlet } from 'react-router-dom';
import { useDispatch } from 'react-redux';

function Prefetch() {
    const dispatch = useDispatch()

    useEffect(() => {
        const prefetchDashboard = store.dispatch(foodGroupApiSlice.endpoints.getAllFoodGroups.initiate(undefined, { subscribe: true, forceRefetch: true, }

        ))
        console.log(prefetchDashboard)
        try {
        } catch (error) {

        }

        return () => {
            prefetchDashboard.unsubscribe()
        }

    }, [dispatch])
    return <Outlet />

}

export default Prefetch