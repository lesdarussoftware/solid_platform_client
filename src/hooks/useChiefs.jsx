import { useContext } from "react";

import { DataContext } from "../providers/DataProvider";
import { useQuery } from "./useQuery";

import { CHIEF_URL } from "../helpers/urls";
import { STATUS_CODES } from "../helpers/statusCodes";

export function useChiefs() {

    const { dispatch } = useContext(DataContext)

    const { handleQuery } = useQuery()

    async function getChiefs(params) {
        const { status, data } = await handleQuery({ url: `${CHIEF_URL}${params ? `/${params}` : ''}` })
        if (status === STATUS_CODES.OK) {
            dispatch({ type: 'CHIEFS', payload: data })
            localStorage.setItem('solid_chiefs_storage', JSON.stringify(data))
        }
    }

    return { getChiefs }
}