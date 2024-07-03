import { useContext } from "react";

import { DataContext } from "../providers/DataProvider";
import { useQuery } from "./useQuery";

import { SITE_URL } from "../helpers/urls";
import { STATUS_CODES } from "../helpers/statusCodes";

export function useSites() {

    const { dispatch } = useContext(DataContext)

    const { handleQuery } = useQuery()

    async function getSites(params) {
        const { status, data } = await handleQuery({ url: `${SITE_URL}${params ? `/${params}` : ''}` })
        if (status === STATUS_CODES.OK) {
            dispatch({ type: 'SITES', payload: data })
            localStorage.setItem('solid_sites_storage', JSON.stringify(data))
        }
    }

    return { getSites }
}