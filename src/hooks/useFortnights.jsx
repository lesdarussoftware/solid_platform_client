import { useContext, useState } from "react";

import { MessageContext } from "../providers/MessageProvider";
import { useQuery } from "./useQuery";

import { FORTNIGHT_URL, RULE_URL } from "../helpers/urls";
import { STATUS_CODES } from "../helpers/statusCodes";
import { format } from "date-fns";

export function useFortnights() {

    const { setMessage, setSeverity, setOpenMessage } = useContext(MessageContext)

    const { handleQuery } = useQuery()

    const [fortnights, setFortnights] = useState([])
    const [loadingFortnights, setLoadingFortnights] = useState(true)
    const [open, setOpen] = useState(null)
    const [count, setCount] = useState(0)
    const [filter, setFilter] = useState({
        page: 0,
        offset: 60
    })

    async function getFortnights(params) {
        const { status, data } = await handleQuery({ url: `${FORTNIGHT_URL}${params ? `${params}` : ''}` })
        if (status === STATUS_CODES.OK) {
            setFortnights(data[0])
            setCount(data[1])
            setLoadingFortnights(false)
        }
    }

    function formatNewData(formData) {
        const { start_date, end_date, in_hour, out_hour } = formData
        let sDate = new Date(start_date)
        let eDate = new Date(end_date)
        sDate.setHours(0, 0, 0, 0)
        eDate.setHours(23, 59, 59, 999)
        return {
            ...formData,
            start_date,
            end_date,
            in_hour: format(new Date(in_hour), 'HH:mm'),
            out_hour: format(new Date(out_hour), 'HH:mm')
        }
    }

    async function handleSubmit(e, formData, setDisabled, reset) {
        e.preventDefault()
        const urls = { 'NEW': FORTNIGHT_URL, 'EDIT': `${FORTNIGHT_URL}/${formData.id}` }
        const { status, data } = await handleQuery({
            url: urls[open],
            method: open === 'NEW' ? 'POST' : open === 'EDIT' ? 'PUT' : 'GET',
            body: JSON.stringify(formatNewData(formData))
        })
        if (status === STATUS_CODES.CREATED) {
            setFortnights([data, ...fortnights].sort((a, b) => {
                if (a.start_date > b.start_date) return 1
                if (a.start_date < b.start_date) return -1
                return 0
            }))
            setCount(count + 1)
            setMessage('Quincena registrada correctamente.')
        } else if (status === STATUS_CODES.OK) {
            setFortnights([data, ...fortnights.filter(f => f.id !== data.id)].sort((a, b) => {
                if (a.start_date > b.start_date) return 1
                if (a.start_date < b.start_date) return -1
                return 0
            }))
            setMessage('Quincena editada correctamente.')
        } else {
            setMessage(data.message)
            setSeverity('error')
            setDisabled(false)
        }
        if (status === STATUS_CODES.CREATED || status === STATUS_CODES.OK) {
            setSeverity('success')
            reset(setOpen)
        }
        setOpenMessage(true)
    }

    async function handleSubmitSeveralFortnights(e, formData, newFortnights, setDisabled, reset, setOpen, setNewFortnights) {
        e.preventDefault()
        const result = await Promise.all(newFortnights.map(nf => handleQuery({
            url: FORTNIGHT_URL,
            method: 'POST',
            body: JSON.stringify(formatNewData({ ...formData, site_id: nf }))
        })))
        if (result.every(r => r.status === STATUS_CODES.CREATED)) {
            setMessage('Configuración general registrada correctamente.')
            setSeverity('success')
            reset(setOpen)
            setNewFortnights([])
        } else {
            setMessage(`Ocurrió un error en las obras n°: ${result.filter(r => r.status !== STATUS_CODES.CREATED).map(r => r.data.id).join()}.`)
            setSeverity('error')
            setDisabled(false)
        }
        setOpenMessage(true)
    }

    async function handleSubmitRule(e, formData, setDisabled, reset, workOnFortnight, setWorkOnFortnight) {
        e.preventDefault()
        const urls = { 'NEW': RULE_URL, 'EDIT': `${RULE_URL}/${formData.id}` }
        const { status, data } = await handleQuery({
            url: urls[open],
            method: open === 'NEW' ? 'POST' : open === 'EDIT' ? 'PUT' : 'GET',
            body: JSON.stringify(formatNewData(formData))
        })
        if (status === STATUS_CODES.CREATED) {
            setWorkOnFortnight({
                ...workOnFortnight,
                rules: [...workOnFortnight.rules, data]
                    .sort((a, b) => {
                        if (a.date > b.date) return 1
                        if (a.date < b.date) return -1
                        return 0
                    })
            })
            setMessage('Regla registrada correctamente.')
        } else if (status === STATUS_CODES.OK) {
            setWorkOnFortnight({
                ...workOnFortnight,
                rules: [...workOnFortnight.rules.filter(r => r.id !== data.id), data]
                    .sort((a, b) => {
                        if (a.date > b.date) return 1
                        if (a.date < b.date) return -1
                        return 0
                    })
            })
            setMessage('Regla editada correctamente.')
        } else {
            setMessage(data.message)
            setSeverity('error')
            setDisabled(false)
        }
        if (status === STATUS_CODES.CREATED || status === STATUS_CODES.OK) {
            setSeverity('success')
            reset(setOpen)
        }
        setOpenMessage(true)
    }

    async function handleDelete(formData, reset, setDisabled) {
        const { status, data } = await handleQuery({ url: `${FORTNIGHT_URL}/${formData.id}`, method: 'DELETE' })
        if (status === STATUS_CODES.OK) {
            setFortnights([...fortnights.filter(item => item.id !== data.id)])
            setCount(count - 1)
            setSeverity('success')
            setMessage('Quincena eliminada correctamente.')
            reset(setOpen)
        }
        if (status === STATUS_CODES.SERVER_ERROR) {
            setMessage(data.message)
            setSeverity('error')
            setDisabled(false)
        }
        setOpenMessage(true)
    }

    async function handleDeleteRule(formData, reset, setDisabled, workOnFortnight, setWorkOnFortnight) {
        const { status, data } = await handleQuery({ url: `${RULE_URL}/${formData.id}`, method: 'DELETE' })
        if (status === STATUS_CODES.OK) {
            setWorkOnFortnight({
                ...workOnFortnight,
                rules: [...workOnFortnight.rules.filter(r => r.id !== data.id)]
            })
            setSeverity('success')
            setMessage('Regla eliminada correctamente.')
            reset(setOpen)
        }
        if (status === STATUS_CODES.SERVER_ERROR) {
            setMessage(data.message)
            setSeverity('error')
            setDisabled(false)
        }
        setOpenMessage(true)
    }

    return {
        open,
        setOpen,
        handleSubmit,
        handleDelete,
        count,
        filter,
        setFilter,
        fortnights,
        getFortnights,
        loadingFortnights,
        setLoadingFortnights,
        handleSubmitRule,
        handleDeleteRule,
        handleSubmitSeveralFortnights
    }
}