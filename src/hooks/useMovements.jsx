import { useContext, useState } from "react"

import { MessageContext } from "../providers/MessageProvider"

import { MOVEMENT_URL } from "../helpers/urls"
import { setLocalDate } from "../helpers/utils"
import { useForm } from "./useForm"

export function useMovements() {

    const { setSeverity, setMessage, setOpenMessage } = useContext(MessageContext)

    const { formData, setFormData, validate, errors, disabled, handleChange, reset } = useForm({
        defaultData: {
            chief_dni: '',
            site_name: '',
            type: null,
            lat: null,
            lng: null
        },
        rules: { site_name: { required: true }, chief_dni: { required: true } }
    })
    const [newMovementWorkerDni, setNewMovementWorkerDni] = useState(0)

    async function handleSubmit() {
        try {
            let additionalData = { date: setLocalDate(Date.now()) }
            const res = await fetch(MOVEMENT_URL, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ ...formData, ...additionalData })
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
        const newMovementsCache = [...movementsCache, { ...formData, date: setLocalDate(Date.now()) }]
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
                    body: JSON.stringify({ movements: movementsCache })
                })
                if (res.status === 201) localStorage.removeItem('solid_movements_storage')
            } catch (e) {
                console.error(e)
            }
        }
    }

    function getLocation() {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(
                (position) => {
                    setFormData({
                        ...formData,
                        lat: position.coords.latitude,
                        lng: position.coords.longitude
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

    return {
        handleSubmit,
        newMovementWorkerDni,
        setNewMovementWorkerDni,
        handleSync,
        formData,
        validate,
        handleChange,
        errors,
        setFormData,
        disabled,
        reset,
        getLocation
    }
}