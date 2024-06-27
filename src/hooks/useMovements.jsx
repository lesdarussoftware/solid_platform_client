import { useContext, useState } from "react"

import { MessageContext } from "../providers/MessageProvider"

import { MOVEMENT_URL } from "../helpers/urls"
import { setLocalDate } from "../helpers/utils"

export function useMovements(formData) {

    const { setSeverity, setMessage, setOpenMessage } = useContext(MessageContext)

    const [newMovement, setNewMovement] = useState({
        chief_dni: formData.chief_dni,
        site_name: formData.site_name,
        type: formData.type,
        date: '',
        lat: null,
        lng: null
    })
    const [newMovementWorkerDni, setNewMovementWorkerDni] = useState(0)

    async function handleSubmit() {
        const res = await fetch(MOVEMENT_URL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ ...newMovement, date: setLocalDate(Date.now()) })
        })
        const data = await res.json()
        if (res.status === 201) {
            setMessage(`Registro de ${data.worker.first_name} ${data.worker.last_name} guardado.`)
            setSeverity('success')
            setNewMovementWorkerDni(0)
        } else {
            setMessage('Ocurrió un error.')
            setSeverity('error')
        }
        setOpenMessage(true)
    }

    async function handleSubmitOffline() {
        setMessage('Registro guardado sin conexión')
        setSeverity('success')
        setNewMovementWorkerDni(0)
        setOpenMessage(true)
    }

    return {
        handleSubmit,
        newMovement,
        setNewMovement,
        newMovementWorkerDni,
        setNewMovementWorkerDni
    }
}