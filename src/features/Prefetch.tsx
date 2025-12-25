import { useEffect } from 'react'
import { store } from '../AppRedux/store';
import { Outlet } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { InitializationApiSlice } from './Initializations/InitializationSliceApi';

function Prefetch() {
    const dispatch = useDispatch()


    useEffect(() => {
        const prefetchAdminInitial = store.dispatch(InitializationApiSlice.endpoints.getAdminLevelInitialization.initiate(undefined, { subscribe: true, forceRefetch: true, }))


        return () => {
            prefetchAdminInitial.unsubscribe()
        }
    }, [dispatch])

    return <Outlet />

}

export default Prefetch

export const manualRefetchOfInitializedData = () => { store.dispatch(InitializationApiSlice.endpoints.getAdminLevelInitialization.initiate(undefined, { subscribe: false, forceRefetch: true })) }
