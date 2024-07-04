import { useContext, useState } from "react";

import { DataContext } from "../providers/DataProvider";
import { MessageContext } from "../providers/MessageProvider";
import { useQuery } from "./useQuery";

import { CHIEF_URL } from "../helpers/urls";
import { STATUS_CODES } from "../helpers/statusCodes";

export function useChiefs() {

    const { state, dispatch } = useContext(DataContext)
    const { setMessage, setSeverity, setOpenMessage } = useContext(MessageContext)

    const { handleQuery } = useQuery()

    const [open, setOpen] = useState(null)
    const [count, setCount] = useState(0)

    async function getChiefs(params) {
        const { status, data } = await handleQuery({ url: `${CHIEF_URL}${params ? `/${params}` : ''}` })
        if (status === STATUS_CODES.OK) {
            dispatch({ type: 'CHIEFS', payload: data[0] })
            setCount(data[1])
            localStorage.setItem('solid_chiefs_storage', JSON.stringify(data))
        }
    }

    async function handleSubmit(e, validate, formData, setDisabled, reset) {
        e.preventDefault()
        if (validate()) {
            const urls = { 'NEW': CHIEF_URL, 'EDIT': `${CHIEF_URL}/${formData.id}` }
            const { status, data } = await handleQuery({
                url: urls[open],
                method: open === 'NEW' ? 'POST' : open === 'EDIT' ? 'PUT' : 'GET',
                body: JSON.stringify({ ...formData, dni: parseInt(formData.dni) })
            })
            if (status === STATUS_CODES.CREATED) {
                dispatch({ type: 'CHIEFS', payload: [data, ...state.chiefs] })
                setCount(count + 1)
                setMessage('Capataz registrado correctamente.')
            } else if (status === STATUS_CODES.OK) {
                dispatch({
                    type: 'CHIEFS',
                    payload: [data, ...state.chiefs.filter(item => item.id !== data.id)]
                })
                setMessage('Capataz editado correctamente.')
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
        const { status, data } = await handleQuery({ url: `${CHIEF_URL}/${formData.id}`, method: 'DELETE' })
        if (status === STATUS_CODES.OK) {
            dispatch({
                type: 'CHIEFS',
                payload: [...state.chiefs.filter(item => item.id !== data.id)]
            })
            setCount(count - 1)
            setSeverity('success')
            setMessage('Capataz eliminado correctamente.')
            reset(setOpen)
        }
        if (status === STATUS_CODES.SERVER_ERROR) {
            setMessage(data.message)
            setSeverity('error')
            setDisabled(false)
        }
        setOpenMessage(true)
    }

    return { getChiefs, open, setOpen, handleSubmit, handleDelete, count }
}