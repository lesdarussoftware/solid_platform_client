import { useContext, useState } from "react";

import { MessageContext } from "../providers/MessageProvider";
import { useQuery } from "./useQuery";

import { ACTIVITY_URL } from "../helpers/urls";
import { STATUS_CODES } from "../helpers/statusCodes";

export function useActivities() {

    const { setMessage, setSeverity, setOpenMessage } = useContext(MessageContext)

    const { handleQuery } = useQuery()

    const [activities, setActivities] = useState([])
    const [loadingActivities, setLoadingActivities] = useState(true)
    const [open, setOpen] = useState(null)
    const [count, setCount] = useState(0)
    const [filter, setFilter] = useState({
        page: 0,
        offset: 60,
        date: '',
        worker_id: ''
    })

    async function getActivities(params) {
        const { status, data } = await handleQuery({ url: `${ACTIVITY_URL}${params ? `${params}` : ''}` })
        if (status === STATUS_CODES.OK) {
            setActivities(data[0])
            setCount(data[1])
            setLoadingActivities(false)
        }
    }

    async function handleSubmit(e, validate, formData, setDisabled, reset) {
        e.preventDefault()
        if (validate()) {
            formData.hours = parseInt(formData.hours)
            const urls = { 'NEW': ACTIVITY_URL, 'EDIT': `${ACTIVITY_URL}/${formData.id}` }
            const { status, data } = await handleQuery({
                url: urls[open],
                method: open === 'NEW' ? 'POST' : open === 'EDIT' ? 'PUT' : 'GET',
                body: JSON.stringify(formData)
            })
            if (status === STATUS_CODES.CREATED) {
                setActivities([data, ...activities])
                setCount(count + 1)
                setMessage('Actividad registrada correctamente.')
            } else if (status === STATUS_CODES.OK) {
                setActivities([data, ...activities.filter(a => a.id !== data.id)])
                setMessage('Actividad editada correctamente.')
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
    }

    async function handleDelete(formData, reset, setDisabled) {
        const { status, data } = await handleQuery({ url: `${ACTIVITY_URL}/${formData.id}`, method: 'DELETE' })
        if (status === STATUS_CODES.OK) {
            setActivities(activities.filter(a => a.id !== data.id))
            setCount(count - 1)
            setSeverity('success')
            setMessage('Actividad eliminada correctamente.')
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
        activities,
        getActivities,
        open,
        setOpen,
        handleSubmit,
        handleDelete,
        count,
        filter,
        setFilter,
        loadingActivities
    }
}