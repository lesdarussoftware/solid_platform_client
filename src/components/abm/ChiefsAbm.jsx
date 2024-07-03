import { useContext, useEffect } from "react"

import { DataContext } from "../../providers/DataProvider"
import { useChiefs } from "../../hooks/useChiefs"

import { DataGrid} from "../datagrid/DataGrid"

export function ChiefsAbm() {

    const { state } = useContext(DataContext)

    const { getChiefs } = useChiefs()

    useEffect(() => {
        getChiefs()
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
        <DataGrid
            headCells={headCells}
            rows={state.chiefs}
        />
    )
}