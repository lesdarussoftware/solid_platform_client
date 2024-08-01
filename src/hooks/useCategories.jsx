import { useContext, useState } from "react";

import { DataContext } from "../providers/DataProvider";
import { MessageContext } from "../providers/MessageProvider";
import { useQuery } from "./useQuery";

import { CATEGORY_RATE_URL, CATEGORY_URL } from "../helpers/urls";
import { STATUS_CODES } from "../helpers/statusCodes";

export function useCategories() {

    const { state, dispatch } = useContext(DataContext)
    const { setMessage, setSeverity, setOpenMessage } = useContext(MessageContext)

    const { handleQuery } = useQuery()

    const [loadingCategories, setLoadingCategories] = useState(true)
    const [open, setOpen] = useState(null)
    const [count, setCount] = useState(0)
    const [workOn, setWorkOn] = useState(null)
    const [filter, setFilter] = useState({
        page: 0,
        offset: 60
    })

    async function getCategories(params) {
        const { status, data } = await handleQuery({ url: `${CATEGORY_URL}${params ? `${params}` : ''}` })
        if (status === STATUS_CODES.OK) {
            dispatch({ type: 'CATEGORIES', payload: data[0] })
            setCount(data[1])
            setLoadingCategories(false)
        }
    }

    async function handleSubmit(e, validate, formData, setDisabled, reset) {
        e.preventDefault()
        if (validate()) {
            const urls = { 'NEW': CATEGORY_URL, 'EDIT': `${CATEGORY_URL}/${formData.id}` }
            const { status, data } = await handleQuery({
                url: urls[open],
                method: open === 'NEW' ? 'POST' : open === 'EDIT' ? 'PUT' : 'GET',
                body: JSON.stringify(formData)
            })
            if (status === STATUS_CODES.CREATED) {
                dispatch({ type: 'CATEGORIES', payload: [data, ...state.categories] })
                setCount(count + 1)
                setMessage('Categoría registrada correctamente.')
            } else if (status === STATUS_CODES.OK) {
                dispatch({
                    type: 'CATEGORIES',
                    payload: [data, ...state.categories.filter(item => item.id !== data.id)]
                })
                setMessage('Categoría editada correctamente.')
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
        const { status, data } = await handleQuery({ url: `${CATEGORY_URL}/${formData.id}`, method: 'DELETE' })
        if (status === STATUS_CODES.OK) {
            dispatch({
                type: 'CATEGORIES',
                payload: [...state.categories.filter(item => item.id !== data.id)]
            })
            setCount(count - 1)
            setSeverity('success')
            setMessage('Categoría eliminada correctamente.')
            reset(setOpen)
        }
        if (status === STATUS_CODES.SERVER_ERROR) {
            setMessage(data.message)
            setSeverity('error')
            setDisabled(false)
        }
        setOpenMessage(true)
    }

    async function handleSubmitRate(e, validate, formData, reset) {
        e.preventDefault()
        if (validate()) {
            const urls = { 'NEW-RATE': CATEGORY_RATE_URL, 'EDIT-RATE': `${CATEGORY_RATE_URL}/${formData.id}` }
            const { status, data } = await handleQuery({
                url: urls[open],
                method: open === 'NEW-RATE' ? 'POST' : open === 'EDIT-RATE' ? 'PUT' : 'GET',
                body: JSON.stringify({ ...formData, category_id: workOn.id })
            })
            if (status === STATUS_CODES.CREATED) {
                dispatch({
                    type: 'CATEGORIES',
                    payload: [
                        ...state.categories.filter(c => c.id !== data.category_id),
                        {
                            ...state.categories.find(c => c.id === data.category_id),
                            rates: [
                                ...state.categories.find(c => c.id === data.category_id).rates,
                                data
                            ]
                        }
                    ]
                })
                setWorkOn({ ...workOn, rates: [...workOn.rates, data] })
                setMessage('Cotización registrada correctamente.')
            } else if (status === STATUS_CODES.OK) {
                dispatch({
                    type: 'CATEGORIES',
                    payload: [
                        ...state.categories.filter(c => c.id !== data.category_id),
                        {
                            ...state.categories.find(c => c.id === data.category_id),
                            rates: [
                                ...state.categories.find(c => c.id === data.category_id).rates
                                    .filter(r => r.id !== data.id),
                                data
                            ]
                        }
                    ]
                })
                setWorkOn({ ...workOn, rates: [...workOn.rates.filter(r => r.id !== data.id), data] })
                setMessage('Cotización editada correctamente.')
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

    async function handleDeleteRate(formData, reset) {
        const { status, data } = await handleQuery({ url: `${CATEGORY_RATE_URL}/${formData.id}`, method: 'DELETE' })
        if (status === STATUS_CODES.OK) {
            dispatch({
                type: 'CATEGORIES',
                payload: [
                    ...state.categories.filter(c => c.id !== data.category_id),
                    {
                        ...state.categories.find(c => c.id === data.category_id),
                        rates: [
                            ...state.categories.find(c => c.id === data.category_id).rates
                                .filter(r => r.id !== data.id)
                        ]
                    }
                ]
            })
            setWorkOn({ ...workOn, rates: [...workOn.rates.filter(r => r.id !== data.id).filter(r => r.id !== data.id)] })
            setSeverity('success')
            setMessage('Cotización eliminada correctamente.')
            reset(setOpen)
        }
        if (status === STATUS_CODES.SERVER_ERROR) {
            setSeverity('error')
            setMessage(data.message)
        }
        setOpenMessage(true)
    }

    return {
        getCategories,
        open,
        setOpen,
        handleSubmit,
        handleDelete,
        count,
        filter,
        setFilter,
        loadingCategories,
        workOn,
        setWorkOn,
        handleSubmitRate,
        handleDeleteRate
    }
}