import { useContext, useMemo, useState } from "react";
import { format } from "date-fns";

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
        }
        setLoadingActivities(false)
    }

    async function handleCreate(e, validate, formData, newActivities, setDisabled, reset, setOpen, setNewActivities) {
        e.preventDefault()
        if (validate()) {
            const result = await Promise.all(newActivities.map(na => handleQuery({
                url: ACTIVITY_URL,
                method: 'POST',
                body: JSON.stringify({ ...formData, hours: parseInt(formData.hours), worker_id: na })
            })))
            if (result.every(r => r.status === STATUS_CODES.CREATED)) {
                setActivities([
                    ...activities,
                    ...result.map(r => r.data)
                ])
                setMessage('Actividades registradas correctamente.')
                setSeverity('success')
                reset(setOpen)
                setNewActivities([])
            } else {
                setMessage(`Ocurrió un error con los operarios n°: ${result.filter(r => r.status !== STATUS_CODES.CREATED).map(r => r.data.id).join()}.`)
                setSeverity('error')
                setDisabled(false)
            }
            setOpenMessage(true)
        }
    }

    async function handleEdit(e, validate, formData, setDisabled, reset) {
        e.preventDefault()
        if (validate()) {
            formData.hours = parseInt(formData.hours)
            const { status, data } = await handleQuery({
                url: `${ACTIVITY_URL}/${formData.id}`,
                method: 'PUT',
                body: JSON.stringify(formData)
            })
            if (status === STATUS_CODES.OK) {
                setSeverity('success')
                setActivities([data, ...activities.filter(a => a.id !== data.id)])
                setMessage('Actividad editada correctamente.')
                reset(setOpen)
            } else {
                setMessage(data.message)
                setSeverity('error')
                setDisabled(false)
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

    const headCells = useMemo(() => [
        {
            id: "id",
            numeric: true,
            disablePadding: false,
            label: "#",
            accessor: 'id'
        },
        {
            id: "worker",
            numeric: false,
            disablePadding: true,
            label: "Operario",
            accessor: (row) => `${row.worker.first_name} ${row.worker.last_name}`
        },
        {
            id: "description",
            numeric: false,
            disablePadding: true,
            label: "Detalle",
            accessor: 'description'
        },
        {
            id: "in_date",
            numeric: false,
            disablePadding: true,
            label: "Entrada",
            accessor: (row) => format(new Date(row.in_date), 'dd/MM/yy HH:mm')
        },
        {
            id: "out_date",
            numeric: false,
            disablePadding: true,
            label: "Salida",
            accessor: (row) => format(new Date(row.out_date), 'dd/MM/yy HH:mm')
        },
        {
            id: "hours",
            numeric: false,
            disablePadding: true,
            label: "Cant. hs. extra",
            accessor: 'hours'
        },
        {
            id: "payment_amount",
            numeric: false,
            disablePadding: true,
            label: "Monto pago ($)",
            disableSorting: true,
            accessor: 'payment_amount'
        }
    ], []);

    return {
        activities,
        getActivities,
        open,
        setOpen,
        handleEdit,
        handleCreate,
        handleDelete,
        count,
        filter,
        setFilter,
        loadingActivities,
        headCells
    }
}