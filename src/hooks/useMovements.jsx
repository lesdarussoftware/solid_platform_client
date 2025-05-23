import { useContext, useMemo, useState } from "react"
import { format } from "date-fns";

import { AuthContext } from "../providers/AuthProvider"
import { MessageContext } from "../providers/MessageProvider"
import { DataContext } from "../providers/DataProvider"
import { NotificationsContext } from "../providers/NotificationsProvider"
import { useQuery } from "./useQuery"

import { MOVEMENT_URL } from "../helpers/urls"
import { STATUS_CODES } from "../helpers/statusCodes"

export function useMovements() {

    const { auth } = useContext(AuthContext)
    const { state, dispatch } = useContext(DataContext)
    const { setSeverity, setMessage, setOpenMessage } = useContext(MessageContext)
    const { sendMessage } = useContext(NotificationsContext)

    const { handleQuery } = useQuery()

    const [loadingMovements, setLoadingMovements] = useState(true)
    const [newMovementWorkerHash, setNewMovementWorkerHash] = useState('')
    const [open, setOpen] = useState(null)
    const [count, setCount] = useState(0)
    const [filter, setFilter] = useState({
        page: 0,
        offset: 60,
        type: '',
        from: '',
        to: '',
        worker: '',
        site: '',
        category: ''
    })

    async function getMovements(params) {
        const { status, data } = await handleQuery({ url: `${MOVEMENT_URL}${params ? `${params}` : ''}` })
        if (status === STATUS_CODES.OK) {
            dispatch({ type: 'MOVEMENTS', payload: data[0] })
            setCount(data[1])
        }
        setLoadingMovements(false)
    }

    async function handleSubmit(e, validate, formData, setDisabled, reset) {
        e.preventDefault()
        if (validate()) {
            const urls = { 'NEW': MOVEMENT_URL, 'EDIT': `${MOVEMENT_URL}/${formData.id}` }
            const additionalData = open === 'NEW' ? { created_by: auth?.me.username } : open === 'EDIT' ? { updated_by: auth?.me.username } : {}
            const { status, data } = await handleQuery({
                url: urls[open],
                method: open === 'NEW' ? 'POST' : open === 'EDIT' ? 'PUT' : 'GET',
                body: JSON.stringify({ ...formData, ...additionalData })
            })
            if (status === STATUS_CODES.CREATED) {
                dispatch({
                    type: 'MOVEMENTS',
                    payload: [data, ...state.movements].sort((a, b) => a.id - b.id)
                })
                setCount(count + 1)
                setMessage('Evento registrado correctamente.')
            } else if (status === STATUS_CODES.OK) {
                dispatch({
                    type: 'MOVEMENTS',
                    payload: [data, ...state.movements.filter(item => item.id !== data.id)].sort((a, b) => a.id - b.id)
                })
                setMessage('Evento editado correctamente.')
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
        const { status, data } = await handleQuery({ url: `${MOVEMENT_URL}/${formData.id}`, method: 'DELETE' })
        if (status === STATUS_CODES.OK) {
            dispatch({
                type: 'MOVEMENTS',
                payload: [...state.movements.filter(item => item.id !== data.id)]
            })
            setCount(count - 1)
            setSeverity('success')
            setMessage('Evento eliminado correctamente.')
            reset(setOpen)
        }
        if (status === STATUS_CODES.SERVER_ERROR) {
            setMessage(data.message)
            setSeverity('error')
            setDisabled(false)
        }
        setOpenMessage(true)
    }

    async function handleScan(formData) {
        try {
            let additionalData = { date: new Date(Date.now()) }
            const { status, data } = await handleQuery({
                url: MOVEMENT_URL,
                method: 'POST',
                body: JSON.stringify({ ...formData, ...additionalData })
            })
            if (status === STATUS_CODES.CREATED) {
                setMessage(`Registro de ${data.worker.first_name} ${data.worker.last_name} guardado.`)
                setSeverity('success')
                setNewMovementWorkerHash('')
                sendMessage({
                    data,
                    message: `Registro de ${data.worker.first_name} ${data.worker.last_name} en ${data.site_name} guardado.`
                })
            } else {
                setMessage('Ocurrió un error.')
                setSeverity('error')
            }
            setOpenMessage(true)
        } catch (e) {
            if (e.toString().includes('TypeError: Failed to fetch')) {
                saveMovementInCache(formData)
            } else {
                console.error(e)
                setMessage('Ocurrió un error.')
                setSeverity('error')
                setOpenMessage(true)
            }
        }
    }

    async function saveMovementInCache(formData) {
        const movementsCache = JSON.parse(localStorage.getItem('solid_movements_storage') ?? '[]')
        const newMovementsCache = [...movementsCache, { ...formData, date: new Date(Date.now()) }]
        localStorage.setItem('solid_movements_storage', JSON.stringify(newMovementsCache))
        setMessage('Registro guardado sin conexión')
        setSeverity('success')
        setNewMovementWorkerHash('')
        setOpenMessage(true)
    }

    async function handleSync() {
        const movementsCache = JSON.parse(localStorage.getItem('solid_movements_storage') ?? '[]')
        if (movementsCache.length > 0) {
            try {
                const { status } = await handleQuery({
                    url: `${MOVEMENT_URL}/sync`,
                    method: 'POST',
                    body: JSON.stringify({ movements: movementsCache })
                })
                if (status === STATUS_CODES.CREATED) {
                    localStorage.removeItem('solid_movements_storage')
                    sendMessage('Registros sin conexión sincronizados.')
                }
            } catch (e) {
                console.error(e)
            }
        }
    }

    function getLocation(formData, setFormData) {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(
                (position) => {
                    setFormData({
                        ...formData,
                        lat: position.coords.latitude.toString(),
                        lng: position.coords.longitude.toString()
                    })
                },
                (error) => {
                    console.error('Error obteniendo geolocalización:', error);
                }
            );
        } else {
            console.error('La geolocalización no está soportada en este navegador.');
        }
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
            id: "date",
            numeric: false,
            disablePadding: true,
            label: "Fecha y hora",
            accessor: (row) => format(new Date(row.date), 'dd/MM/yy HH:mm')
        },
        {
            id: "worker",
            numeric: false,
            disablePadding: true,
            label: "Operario",
            accessor: (row) => `${row.worker.first_name} ${row.worker.last_name} (${state.categories.find(c => c.id === row.worker.category_id)?.name})`
        },
        {
            id: "created_by",
            numeric: false,
            disablePadding: true,
            label: "Creado por",
            accessor: 'created_by'
        },
        {
            id: "type",
            numeric: false,
            disablePadding: true,
            label: "Evento",
            accessor: 'type'
        },
        {
            id: "site",
            numeric: false,
            disablePadding: true,
            label: "Obra",
            accessor: (row) => row.site.name
        }
    ], [state.categories, state.movements]);

    return {
        handleScan,
        newMovementWorkerHash,
        setNewMovementWorkerHash,
        handleSync,
        getLocation,
        getMovements,
        count,
        filter,
        setFilter,
        open,
        setOpen,
        handleSubmit,
        handleDelete,
        loadingMovements,
        headCells
    }
}