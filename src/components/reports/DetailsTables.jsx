import { Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Typography } from "@mui/material";
import { format } from "date-fns";

export function DetailsTables({ workOn }) {

    const sortedMovs = workOn?.movs.sort((a, b) => new Date(a.date) - new Date(b.date))
    const inc = sortedMovs?.filter(m => m.type === 'INGRESO')
    const out = sortedMovs?.filter(m => m.type === 'EGRESO')

    return (
        <>
            {workOn?.movs &&
                <>
                    <Typography variant="h6" sx={{ marginBottom: 1 }}>
                        {workOn?.worker} - Ingresos / egresos
                    </Typography>
                    <TableContainer component={Paper} sx={{ maxHeight: 300, overflowY: 'auto' }}>
                        <Table>
                            <TableHead>
                                <TableRow>
                                    <TableCell align="center">#</TableCell>
                                    <TableCell align="center">Tipo</TableCell>
                                    <TableCell align="center">Fecha</TableCell>
                                    <TableCell align="center">Obs</TableCell>
                                    <TableCell align="center">Tipo</TableCell>
                                    <TableCell align="center">Fecha</TableCell>
                                    <TableCell align="center">Obs</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {inc.map((i, idx) => {
                                    const c = out.find(o => format(new Date(o.date), 'dd/MM/yyyy') === format(new Date(i.date), 'dd/MM/yyyy'))
                                    const cDate = c ? format(new Date(c.date), 'dd/MM/yyyy HH:mm') : ''
                                    return (
                                        <TableRow key={i.id}>
                                            <TableCell align="center">{idx + 1}</TableCell>
                                            <TableCell align="center">{i.type}</TableCell>
                                            <TableCell align="center">{format(new Date(i.date), 'dd/MM/yyyy HH:mm')}</TableCell>
                                            <TableCell align="center">{i.observations}</TableCell>
                                            <TableCell align="center">{c?.type}</TableCell>
                                            <TableCell align="center">{cDate}</TableCell>
                                            <TableCell align="center">{c?.observations}</TableCell>
                                        </TableRow>
                                    )
                                })}
                            </TableBody>
                        </Table>
                    </TableContainer>
                </>
            }
            {workOn?.activities &&
                <>
                    <Typography variant="h6" sx={{ mb: 1, mt: 3 }}>
                        {workOn?.worker} - Horas extra
                    </Typography>
                    <TableContainer component={Paper} sx={{ maxHeight: 300, overflowY: 'auto' }}>
                        <Table>
                            <TableHead>
                                <TableRow>
                                    <TableCell align="center">#</TableCell>
                                    <TableCell align="center">Detalle</TableCell>
                                    <TableCell align="center">Entrada</TableCell>
                                    <TableCell align="center">Salida</TableCell>
                                    <TableCell align="center">Horas</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {workOn?.activities.sort((a, b) => a.id - b.id).map(act => (
                                    <TableRow key={act.id}>
                                        <TableCell align="center">{act.id}</TableCell>
                                        <TableCell align="center">{act.description}</TableCell>
                                        <TableCell align="center">{format(new Date(act.in_date), 'dd/MM/yyyy HH:mm')}</TableCell>
                                        <TableCell align="center">{format(new Date(act.out_date), 'dd/MM/yyyy HH:mm')}</TableCell>
                                        <TableCell align="center">{act.hours}</TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </TableContainer>
                </>
            }
        </>
    );
}