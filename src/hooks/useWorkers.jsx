import { useContext, useState } from "react"
import { v4 as uuid } from 'uuid'

import { MessageContext } from "../providers/MessageProvider"
import { DataContext } from "../providers/DataProvider"
import { useQuery } from "./useQuery"

import { QR_URL, WORKER_URL } from "../helpers/urls"
import { STATUS_CODES } from "../helpers/statusCodes"

export function useWorkers() {

    const { state, dispatch } = useContext(DataContext)
    const { setMessage, setSeverity, setOpenMessage } = useContext(MessageContext)

    const { handleQuery } = useQuery()

    const [loadingWorkers, setLoadingWorkers] = useState(true)
    const [open, setOpen] = useState(null)
    const [count, setCount] = useState(0)
    const [newQrs, setNewQrs] = useState([])
    const [workersForQr, setWorkersForQr] = useState([])
    const [disabled, setDisabled] = useState(false)
    const [filter, setFilter] = useState({
        page: 0,
        offset: 60
    })

    async function getWorkers(params) {
        const { status, data } = await handleQuery({ url: `${WORKER_URL}${params ? `${params}` : ''}` })
        if (status === STATUS_CODES.OK) {
            dispatch({ type: 'WORKERS', payload: data[0] })
            setCount(data[1])
            setLoadingWorkers(false)
        }
    }

    async function getWorkersForQr() {
        const { status, data } = await handleQuery({ url: WORKER_URL })
        if (status === STATUS_CODES.OK) setWorkersForQr(data[0])
    }

    async function getScanners() {
        const { status, data } = await handleQuery({ url: WORKER_URL + '/scanners' })
        if (status === STATUS_CODES.OK) {
            dispatch({ type: 'SCANNERS', payload: data[0] })
            localStorage.setItem('solid_scanners_storage', JSON.stringify(data[0]))
        }
    }

    async function handleSubmit(e, validate, formData, setDisabled, reset) {
        e.preventDefault()
        if (validate()) {
            const urls = { 'NEW': WORKER_URL, 'EDIT': `${WORKER_URL}/${formData.id}` }
            const { status, data } = await handleQuery({
                url: urls[open],
                method: open === 'NEW' ? 'POST' : open === 'EDIT' ? 'PUT' : 'GET',
                body: JSON.stringify({ ...formData, dni: parseInt(formData.dni) })
            })
            if (status === STATUS_CODES.CREATED) {
                dispatch({ type: 'WORKERS', payload: [data, ...state.workers] })
                setCount(count + 1)
                setMessage('Operario registrado correctamente.')
            } else if (status === STATUS_CODES.OK) {
                dispatch({
                    type: 'WORKERS',
                    payload: [data, ...state.workers.filter(item => item.id !== data.id)]
                })
                setMessage('Operario editado correctamente.')
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
        const { status, data } = await handleQuery({ url: `${WORKER_URL}/${formData.id}`, method: 'DELETE' })
        if (status === STATUS_CODES.OK) {
            dispatch({
                type: 'WORKERS',
                payload: [...state.workers.filter(item => item.id !== data.id)]
            })
            setCount(count - 1)
            setSeverity('success')
            setMessage('Operario eliminado correctamente.')
            reset(setOpen)
        }
        if (status === STATUS_CODES.SERVER_ERROR) {
            setMessage(data.message)
            setSeverity('error')
            setDisabled(false)
        }
        setOpenMessage(true)
    }

    async function handleGenerateQr(e, setOpenInstance) {
        e.preventDefault()
        setDisabled(true)
        const { status, data } = await handleQuery({
            url: QR_URL,
            method: 'POST',
            body: JSON.stringify({
                qrs: newQrs.map(nqr => ({
                    worker_id: nqr,
                    hash: `${nqr}-${uuid()}`
                }))
            })
        })
        if (status === STATUS_CODES.CREATED) {
            const newWorkerIds = Array.from(new Set(data.map(qr => qr.worker_id)))
            dispatch({
                type: 'WORKERS',
                payload: [
                    ...state.workers.map(w => {
                        if (!newWorkerIds.includes(w.id)) return w
                        return {
                            ...w,
                            qrs: [
                                ...data.filter(item => item.worker_id === w.id),
                                ...w.qrs
                            ]
                        }
                    })
                ]
            })
            setSeverity('success')
            setMessage('QRs generados correctamente.')
            setOpenInstance(null)
            setNewQrs([])
            setDisabled(false)
        } else {
            setMessage(data.message)
            setSeverity('error')
        }
        setOpenMessage(true)
    }

    return {
        getWorkers,
        open,
        setOpen,
        handleSubmit,
        handleDelete,
        count,
        filter,
        setFilter,
        loadingWorkers,
        newQrs,
        setNewQrs,
        handleGenerateQr,
        workersForQr,
        getWorkersForQr,
        disabled,
        setDisabled,
        getScanners
    }
}