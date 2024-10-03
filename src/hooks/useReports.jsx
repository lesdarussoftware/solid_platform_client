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

    const [hoursAmountRows, setHoursAmountRows] = useState([])
    const [loadingHoursAmount, setLoadingHoursAmount] = useState(false)
    const [open, setOpen] = useState(null)

    function getQuery(formData) {
        let query = '?'
        if (formData.site && formData.worker.toString().length > 0) {
            query += `site=${formData.site}&worker=${formData.worker}`
        } else {
            if (formData.site) query += `site=${formData.site}`
            if (formData.worker.toString().length > 0) query += `worker=${formData.worker}`
        }
        return query
    }

    async function getHoursAmountRows(formData, validate, setDisabled) {
        if (validate()) {
            setLoadingHoursAmount(true)
            const { status, data } = await handleQuery({
                url: MOVEMENT_URL + `/hours-amount/${formData.from.toISOString()}/${formData.to.toISOString()}${getQuery(formData)}`
            })
            if (status === STATUS_CODES.OK) {
                setHoursAmountRows(data)
                setDisabled(false)
                setLoadingHoursAmount(false)
                setSeverity('success')
                setMessage('Datos actualizados.')
            } else {
                setSeverity('error')
                setMessage('Ocurrió un error.')
            }
            setOpenMessage(true)
        }
    }

    const printHoursAmount = (type, validate, formData) => {
        if (validate()) {
            if (type === 'PDF') {
                window.open(`${REPORT_URL}/calculo-horas-pdf/${auth?.refresh_token}/${formData.from.toISOString()}/${formData.to.toISOString()}${getQuery(formData)}`, '_blank')
            }
            if (type === 'EXCEL') {
                window.open(`${REPORT_URL}/calculo-horas-excel/${auth?.refresh_token}/${formData.from.toISOString()}/${formData.to.toISOString()}${getQuery(formData)}`, '_blank')
            }
        }
    }

    return {
        hoursAmountRows,
        setHoursAmountRows,
        getHoursAmountRows,
        printHoursAmount,
        loadingHoursAmount,
        open,
        setOpen
    }
}