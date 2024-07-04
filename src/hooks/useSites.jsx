import { useContext, useState } from "react";

import { DataContext } from "../providers/DataProvider";
import { MessageContext } from "../providers/MessageProvider";
import { useQuery } from "./useQuery";

import { SITE_URL } from "../helpers/urls";
import { STATUS_CODES } from "../helpers/statusCodes";

export function useSites() {

    const { state, dispatch } = useContext(DataContext)
    const { setMessage, setSeverity, setOpenMessage } = useContext(MessageContext)

    const { handleQuery } = useQuery()

    const [open, setOpen] = useState(null)
    const [count, setCount] = useState(0)

    async function getSites(params) {
        const { status, data } = await handleQuery({ url: `${SITE_URL}${params ? `/${params}` : ''}` })
        if (status === STATUS_CODES.OK) {
            dispatch({ type: 'SITES', payload: data[0] })
            setCount(data[1])
            localStorage.setItem('solid_sites_storage', JSON.stringify(data))
        }
    }

    async function handleSubmit(e, validate, formData, setDisabled, reset) {
        e.preventDefault()
        if (validate()) {
            const urls = { 'NEW': SITE_URL, 'EDIT': `${SITE_URL}/${formData.id}` }
            const { status, data } = await handleQuery({
                url: urls[open],
                method: open === 'NEW' ? 'POST' : open === 'EDIT' ? 'PUT' : 'GET',
                body: JSON.stringify(formData)
            })
            if (status === STATUS_CODES.CREATED) {
                dispatch({ type: 'SITES', payload: [data, ...state.sites] })
                setCount(count + 1)
                setMessage('Obra registrada correctamente.')
            } else if (status === STATUS_CODES.OK) {
                dispatch({
                    type: 'SITES',
                    payload: [data, ...state.sites.filter(item => item.id !== data.id)]
                })
                setMessage('Obra editada correctamente.')
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
        const { status, data } = await handleQuery({ url: `${SITE_URL}/${formData.id}`, method: 'DELETE' })
        if (status === STATUS_CODES.OK) {
            dispatch({
                type: 'SITES',
                payload: [...state.sites.filter(item => item.id !== data.id)]
            })
            setCount(count - 1)
            setSeverity('success')
            setMessage('Obra eliminada correctamente.')
            reset(setOpen)
        }
        if (status === STATUS_CODES.SERVER_ERROR) {
            setMessage(data.message)
            setSeverity('error')
            setDisabled(false)
        }
        setOpenMessage(true)
    }

    return { getSites, open, setOpen, handleSubmit, handleDelete, count }
}