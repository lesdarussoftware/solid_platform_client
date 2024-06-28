/* eslint-disable react/prop-types */
import { useState, useMemo } from 'react';
import Box from '@mui/material/Box';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TablePagination from '@mui/material/TablePagination';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';

import { EnhancedTableHead } from './EnhancedTableHead';

import { getComparator, stableSort } from '../helpers/utils';

export function DataGridWithFrontendPagination({
    children,
    headCells,
    rows,
    contentHeader,
    defaultOrder = 'desc',
    defaultOrderBy = 'id'
}) {

    const [order, setOrder] = useState(defaultOrder);
    const [orderBy, setOrderBy] = useState(defaultOrderBy);
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(5);

    const handleRequestSort = (event, property) => {
        const isAsc = orderBy === property && order === 'asc';
        setOrder(isAsc ? 'desc' : 'asc');
        setOrderBy(property);
    };

    const handleChangePage = (event, newPage) => {
        setPage(newPage);
    };

    const handleChangeRowsPerPage = (event) => {
        setRowsPerPage(parseInt(event.target.value, 10));
        setPage(0);
    };

    const emptyRows = page > 0 ? Math.max(0, (1 + page) * rowsPerPage - rows.length) : 0;

    const visibleRows = useMemo(
        () =>
            stableSort(rows, getComparator(order, orderBy, headCells.find(hc => hc.id === orderBy)?.sorter)).slice(
                page * rowsPerPage,
                page * rowsPerPage + rowsPerPage,
            ),
        [order, orderBy, page, rowsPerPage, rows],
    );
    return (
        <Box sx={{ width: '100%', backgroundColor: '#fff' }}>
            <Box sx={{ marginBottom: 3 }}>
                {contentHeader}
            </Box>
            <Paper sx={{ width: '100%', mb: 2 }}>
                <TableContainer>
                    <Table
                        sx={{ minWidth: 750, fontWeight: "bold" }}
                        aria-labelledby="tableTitle"
                        size="small"
                    >
                        <EnhancedTableHead
                            headCells={headCells}
                            order={order}
                            orderBy={orderBy}
                            onRequestSort={handleRequestSort}
                        />
                        <TableBody>
                            {
                                visibleRows && visibleRows.length > 0 ? (
                                    visibleRows.map((row, index) => {
                                        return (
                                            <TableRow
                                                role="checkbox"
                                                tabIndex={-1}
                                                key={row.id}
                                                width="100px"
                                            >
                                                {headCells
                                                    .map((cell) => cell.accessor)
                                                    .map((accessor) => (
                                                        <TableCell
                                                            key={accessor}
                                                            align="center"
                                                        >
                                                            {typeof accessor === "function"
                                                                ? accessor(row, index)
                                                                : row[accessor]}
                                                        </TableCell>
                                                    ))}
                                            </TableRow>
                                        );
                                    })
                                ) : (
                                    <TableRow>
                                        <TableCell
                                            colSpan={headCells.length + 1}
                                            align="inherit"
                                            sx={{
                                                fontSize: "1rem",
                                                textAlign: 'center'
                                            }}
                                        >
                                            No se encontraron registros
                                        </TableCell>
                                    </TableRow>
                                )
                            }
                            {emptyRows > 0 && (
                                <TableRow style={{ height: 33 * emptyRows }}>
                                    <TableCell colSpan={6} />
                                </TableRow>
                            )}
                        </TableBody>
                    </Table>
                </TableContainer>
                <TablePagination
                    rowsPerPageOptions={[5, 10, 25]}
                    component="div"
                    count={rows.length}
                    rowsPerPage={rowsPerPage}
                    labelRowsPerPage="Registros por página"
                    labelDisplayedRows={({ from, to, count }) => `${from}–${to} de ${count}`}
                    page={page}
                    onPageChange={handleChangePage}
                    onRowsPerPageChange={handleChangeRowsPerPage}
                />
            </Paper>
            {children}
        </Box>
    );
}