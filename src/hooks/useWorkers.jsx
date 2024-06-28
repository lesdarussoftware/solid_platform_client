import { useContext } from "react";

import { DataContext } from "../providers/DataProvider";

import { WORKER_URL } from "../helpers/urls";

export function useWorkers() {

    const { dispatch } = useContext(DataContext)

    async function getWorkers() {
        const res = await fetch(WORKER_URL)
        const data = await res.json()
        if (res.status === 200) {
            dispatch({
                type: 'WORKERS',
                payload: data
            })
        }
    }

    return { getWorkers }
}