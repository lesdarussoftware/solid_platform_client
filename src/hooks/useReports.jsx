import { useContext, useState } from "react";

import { useQuery } from "./useQuery";

import { AuthContext } from "../providers/AuthProvider";
import { MessageContext } from "../providers/MessageProvider";

import { MOVEMENT_URL, REPORT_URL } from "../helpers/urls";
import { STATUS_CODES } from "../helpers/statusCodes";

export function useReports() {

    const { auth } = useContext(AuthContext)
    const { setSeverity, setOpenMessage, setMessage } = useContext(MessageContext)

    const { handleQuery } = useQuery()

    const [siteStatusRows, setSiteStatusRows] = useState([])
    const [loadingSiteStatus, setLoadingSiteStatus] = useState(false)

    async function getSiteStatusRows(formData, validate, setDisabled) {
        if (validate()) {
            setLoadingSiteStatus(true)
            const { status, data } = await handleQuery({
                url: MOVEMENT_URL + `/site-status/${formData.site}/${formData.from.toISOString()}/${formData.to.toISOString()}/${formData.referenceInHour}/${formData.referenceOutHour}/${formData.toleranceMinutes}`
            })
            if (status === STATUS_CODES.OK) {
                setSiteStatusRows(data)
                setDisabled(false)
                setLoadingSiteStatus(false)
                setSeverity('success')
                setMessage('Datos actualizados.')
            } else {
                setSeverity('error')
                setMessage('Ocurrió un error.')
            }
            setOpenMessage(true)
        }
    }

    const printSiteStatus = (type, validate, formData) => {
        if (validate()) {
            if (type === 'PDF') {
                window.open(`${REPORT_URL}/estado-obra-pdf/${auth?.refresh_token}/${formData.site}/${formData.from.toISOString()}/${formData.to.toISOString()}`, '_blank')
            }
            if (type === 'EXCEL') {
                window.open(`${REPORT_URL}/estado-obra-excel/${auth?.refresh_token}/${formData.site}/${formData.from.toISOString()}/${formData.to.toISOString()}`, '_blank')
            }
        }
    }

    return {
        siteStatusRows,
        setSiteStatusRows,
        getSiteStatusRows,
        printSiteStatus,
        loadingSiteStatus
    }
}