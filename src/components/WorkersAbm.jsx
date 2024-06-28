import { useContext, useEffect } from "react"

import { DataContext } from "../providers/DataProvider"
import { useWorkers } from "../hooks/useWorkers"

import { DataGridWithFrontendPagination } from "./DataGridWithFrontendPagination"

export function WorkersAbm() {

    const { state } = useContext(DataContext)

    const { getWorkers } = useWorkers()

    useEffect(() => {
        getWorkers()
    }, [])

    const headCells = [
        {
            id: "dni",
            numeric: false,
            disablePadding: true,
            label: "Documento",
            accessor: 'dni'
        },
        {
            id: "first_name",
            numeric: false,
            disablePadding: true,
            label: "Nombre",
            accessor: 'first_name'
        },
        {
            id: "last_name",
            numeric: false,
            disablePadding: true,
            label: "Apellido",
            accessor: 'last_name'
        }
    ]

    return (
        <DataGridWithFrontendPagination
            headCells={headCells}
            rows={state.workers}
        />
    )
}