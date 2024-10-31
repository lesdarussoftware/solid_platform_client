import { useContext, useState } from "react";

import { MessageContext } from "../providers/MessageProvider";
import { useQuery } from "./useQuery";

import { TRASH_URL } from "../helpers/urls";
import { STATUS_CODES } from "../helpers/statusCodes";

export function useTrash() {

    const { setMessage, setSeverity, setOpenMessage } = useContext(MessageContext)

    const { handleQuery } = useQuery()

    const [elements, setElements] = useState([])
    const [loading, setLoading] = useState(true)
    const [open, setOpen] = useState(null)
    const [count, setCount] = useState(0)
    const [filter, setFilter] = useState({
        page: 0,
        offset: 60
    })

    async function getElements({ entity, params }) {
        const { status, data } = await handleQuery({ url: `${TRASH_URL}/${entity}${params ? `${params}` : ''}` })
        if (status === STATUS_CODES.OK) {
            ;
            setElements(data[0])
            setCount(data[1])
        }
        setLoading(false)
    }

    async function handleDelete({ entity, selected, message }) {
        const { status, data } = await handleQuery({ url: `${TRASH_URL}/${entity}/${selected.id}`, method: 'DELETE' })
        if (status === STATUS_CODES.OK) {
            setElements([...elements.filter(item => item.id === data.id)])
            setCount(count - 1)
            setSeverity('success')
            setMessage(message)
            setOpen(null)
        }
        if (status === STATUS_CODES.SERVER_ERROR) {
            setMessage(data.message)
            setSeverity('error')
        }
        setOpenMessage(true)
    }

    return {
        elements,
        getElements,
        handleDelete,
        count,
        filter,
        setFilter,
        loading,
        setLoading,
        open,
        setOpen
    }
}