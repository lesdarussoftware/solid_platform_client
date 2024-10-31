import { useContext, useState } from "react";

import { DataContext } from "../providers/DataProvider";
import { MessageContext } from "../providers/MessageProvider";
import { useQuery } from "./useQuery";
import { useAuth } from "./useAuth";

import { USER_URL } from "../helpers/urls";
import { STATUS_CODES } from "../helpers/statusCodes";

export function useUsers() {

    const { state, dispatch } = useContext(DataContext)
    const { setMessage, setSeverity, setOpenMessage } = useContext(MessageContext)

    const { handleQuery } = useQuery()
    const { handleLogout } = useAuth()

    const [loadingUsers, setLoadingUsers] = useState(true)
    const [open, setOpen] = useState(null)
    const [count, setCount] = useState(0)
    const [filter, setFilter] = useState({
        page: 0,
        offset: 60
    })

    async function getUsers(params) {
        const { status, data } = await handleQuery({ url: `${USER_URL}${params ? `${params}` : ''}` })
        if (status === STATUS_CODES.OK) {
            dispatch({ type: 'USERS', payload: data[0].sort((a, b) => a.username - b.username) })
            setCount(data[1])
        }
        setLoadingUsers(false)
    }

    async function handleSubmit(e, validate, formData, setDisabled, reset) {
        e.preventDefault()
        if (validate()) {
            const urls = { 'NEW': USER_URL, 'EDIT': `${USER_URL}/${formData.id}` }
            const { status, data } = await handleQuery({
                url: urls[open],
                method: open === 'NEW' ? 'POST' : open === 'EDIT' ? 'PUT' : 'GET',
                body: JSON.stringify(formData)
            })
            if (status === STATUS_CODES.CREATED) {
                dispatch({ type: 'USERS', payload: [data, ...state.users].sort((a, b) => a.username - b.username) })
                setCount(count + 1)
                setMessage('Usuario registrado correctamente.')
            } else if (status === STATUS_CODES.OK) {
                dispatch({
                    type: 'USERS',
                    payload: [data, ...state.users.filter(item => item.id !== data.id)].sort((a, b) => a.username - b.username)
                })
                setMessage('Usuario editado correctamente.')
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
        const { status, data } = await handleQuery({ url: `${USER_URL}/${formData.id}`, method: 'DELETE' })
        if (status === STATUS_CODES.OK) {
            dispatch({
                type: 'USERS',
                payload: [...state.users.filter(item => item.id !== data.id)]
            })
            setCount(count - 1)
            setSeverity('success')
            setMessage('Usuario eliminado correctamente.')
            reset(setOpen)
        }
        if (status === STATUS_CODES.SERVER_ERROR) {
            setMessage(data.message)
            setSeverity('error')
            setDisabled(false)
        }
        setOpenMessage(true)
    }

    async function handleModifyData(e, validate, formData, setDisabled, reset, changePwd = false) {
        e.preventDefault()
        if (validate()) {
            const { status, data } = await handleQuery({
                url: `${USER_URL}${changePwd ? '/change-pwd' : ''}/${formData.id}`,
                method: 'PUT',
                body: JSON.stringify(formData)
            })
            if (status === STATUS_CODES.OK) {
                setMessage('Datos editados correctamente.')
                setSeverity('success')
                reset(setOpen)
                handleLogout()
            } else {
                setMessage(data.message)
                setSeverity('error')
                setDisabled(false)
            }
            setOpenMessage(true)
        }
    }

    return { getUsers, open, setOpen, handleSubmit, handleDelete, count, handleModifyData, filter, setFilter, loadingUsers }
}