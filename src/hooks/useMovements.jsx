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
        try {
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
        } catch (e) {
            if (e.toString().includes('TypeError: Failed to fetch')) {
                saveMovementInCache()
            } else {
                console.error(e)
                setMessage('Ocurrió un error.')
                setSeverity('error')
                setOpenMessage(true)
            }
        }
    }

    async function saveMovementInCache() {
        const movementsCache = JSON.parse(localStorage.getItem('solid_movements_storage') ?? '[]')
        const newMovementsCache = [...movementsCache, { ...newMovement, date: setLocalDate(Date.now()) }]
        localStorage.setItem('solid_movements_storage', JSON.stringify(newMovementsCache))
        setMessage('Registro guardado sin conexión')
        setSeverity('success')
        setNewMovementWorkerDni(0)
        setOpenMessage(true)
    }

    async function handleSync() {
        const movementsCache = JSON.parse(localStorage.getItem('solid_movements_storage') ?? '[]')
        if (movementsCache.length > 0) {
            try {
                const res = await fetch(`${MOVEMENT_URL}/sync`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(movementsCache)
                })
                if (res.status === 201) localStorage.removeItem('solid_movements_storage')
            } catch (e) {
                console.error(e)
            }
        }
    }

    return {
        handleSubmit,
        newMovement,
        setNewMovement,
        newMovementWorkerDni,
        setNewMovementWorkerDni,
        handleSync
    }
}