import { useContext } from "react";

import { DataContext } from "../providers/DataProvider";

import { CHIEF_URL } from "../helpers/urls";

export function useChiefs() {

    const { dispatch } = useContext(DataContext)

    async function getChiefs() {
        const res = await fetch(CHIEF_URL)
        const data = await res.json()
        if (res.status === 200) {
            dispatch({
                type: 'CHIEFS',
                payload: data
            })
            localStorage.setItem('solid_chiefs_storage', JSON.stringify(data))
        }
    }

    return { getChiefs }
}