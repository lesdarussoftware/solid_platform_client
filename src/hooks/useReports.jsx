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
        window.open(`${REPORT_URL}/recibos?token=${auth?.refresh_token}&receipts=${JSON.stringify(receipts.map(r => {
            return { id: r.id, receipt_payment: r.receipt_payment, receipt_hours: r.receipt_hours }
        }))}&month=${formData.month}&year=${formData.year}&fortnight=${formData.fortnight}&concept=${formData.concept}`, '_blank')
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