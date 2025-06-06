import { useContext, useState } from "react";

import { useQuery } from "./useQuery";

import { AuthContext } from "../providers/AuthProvider";
import { MessageContext } from "../providers/MessageProvider";

import { MOVEMENT_URL, REPORT_URL, WORKER_URL } from "../helpers/urls";
import { STATUS_CODES } from "../helpers/statusCodes";
import { formatLocalDate } from "../helpers/utils";

export function useReports() {

    const { auth } = useContext(AuthContext)
    const { setSeverity, setOpenMessage, setMessage } = useContext(MessageContext)

    const { handleQuery } = useQuery()

    const [hoursAmountRows, setHoursAmountRows] = useState([])
    const [receipts, setReceipts] = useState([])
    const [loading, setLoading] = useState(false)
    const [open, setOpen] = useState(null)

    function getQuery(formData) {
        let query = '?'
        if (formData.site && formData.worker.toString().length > 0) {
            query += `site=${formData.site}&worker=${formData.worker}`
        } else {
            if (formData.site) query += `site=${formData.site}`
            if (formData.worker.toString().length > 0) query += `worker=${formData.worker}`
        }
        if (formData.is_chief) query += `&is_chief=true`
        return query
    }

    async function getHoursAmountRows(formData, validate, setDisabled) {
        if (validate()) {
            setLoading(true);
            const fromFormatted = formatLocalDate(formData.from);
            const toFormatted = formatLocalDate(formData.to);

            const { status, data } = await handleQuery({
                url: MOVEMENT_URL + `/hours-amount/${fromFormatted}/${toFormatted}${getQuery(formData)}`
            });

            if (status === STATUS_CODES.OK) {
                setHoursAmountRows(data);
                setDisabled(false);
                setLoading(false);
                setSeverity('success');
                setMessage('Datos actualizados.');
            } else {
                setSeverity('error');
                setMessage('Ocurrió un error.');
            }
            setOpenMessage(true);
        }
    }


    const printHoursAmount = (type, validate, formData) => {
        if (validate()) {
            if (type === 'PDF') {
                window.open(`${REPORT_URL}/calculo-horas-pdf/${auth?.refresh_token}/${formatLocalDate(formData.from)}/${formatLocalDate(formData.to)}${getQuery(formData)}`, '_blank')
            }
            if (type === 'EXCEL') {
                window.open(`${REPORT_URL}/calculo-horas-excel/${auth?.refresh_token}/${formatLocalDate(formData.from)}/${formatLocalDate(formData.to)}${getQuery(formData)}`, '_blank')
            }
        }
    }

    async function getReceiptsRows(formData) {
        setLoading(true)
        const { status, data } = await handleQuery({
            url: WORKER_URL + `/receipts/${formData.month}/${formData.year}/${formData.fortnight}${getQuery(formData)}`
        })
        if (status === STATUS_CODES.OK) {
            setReceipts(data)
            setLoading(false)
            setSeverity('success')
            setMessage('Datos actualizados.')
        } else {
            setSeverity('error')
            setMessage('Ocurrió un error.')
        }
        setOpenMessage(true)
    }

    const printReceipts = (formData) => {
        const formattedReceiptDate = formatLocalDate(formData.receipt_date).split('T')[0].split('-').reverse().join('/')
        const endpoint = formData.is_chief ? 'recibos-capataces' : 'recibos-operarios'
        window.open(`${REPORT_URL}/${endpoint}?token=${auth?.refresh_token}&receipts=${JSON.stringify(receipts.map(r => {
            const { id, receipt_payment, receipt_hours, site } = r
            return { id, receipt_payment, receipt_hours, site }
        }))}&month=${formData.month}&year=${formData.year}&fortnight=${formData.fortnight}&receipt_date=${formattedReceiptDate}&concept=${formData.concept}`, '_blank')
    }

    return {
        hoursAmountRows,
        setHoursAmountRows,
        getHoursAmountRows,
        printHoursAmount,
        loading,
        open,
        setOpen,
        receipts,
        setReceipts,
        getReceiptsRows,
        printReceipts
    }
}