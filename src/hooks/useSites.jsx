import { useContext } from "react";

import { DataContext } from "../providers/DataProvider";

import { SITE_URL } from "../helpers/urls";

export function useSites() {

    const { dispatch } = useContext(DataContext)

    async function getSites() {
        const res = await fetch(SITE_URL)
        const data = await res.json()
        if (res.status === 200) {
            dispatch({
                type: 'SITES',
                payload: data
            })
        }
    }

    return { getSites }
}