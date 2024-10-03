import { useState } from "react";
import { Box, Typography } from "@mui/material";

import { HoursAmount } from "./HoursAmount";
import { WorkersStatus } from "./WorkersStatus";

export function ReportsMenu() {

    const [show, setShow] = useState(null)

    const boxStyles = {
        background: 'linear-gradient(#FFF, #BDBDBD)',
        borderRadius: 1,
        padding: 1,
        width: '250px',
        height: '250px',
        transition: '200ms all',
        cursor: 'pointer',
        ':hover': {
            transform: 'scale(1.05)'
        }
    }

    return (
        <>
            {!show &&
                <Box sx={{ display: 'flex', flexWrap: 'wrap', padding: 2, gap: 2 }}>
                    <Box sx={boxStyles} onClick={() => setShow('HOURS_AMOUNT')}>
                        <Typography variant="h6" marginBottom={1}>Cálculo de horas</Typography>
                        <Typography variant="body1">
                            Permite calcular el total de horas trabajadas por operario por obra.
                        </Typography>
                    </Box>
                    <Box sx={boxStyles} onClick={() => setShow('WORKERS_STATUS')}>
                        <Typography variant="h6" marginBottom={1}>Estado de operarios</Typography>
                        <Typography variant="body1">
                            Permite ver si un operario está en obra o no.
                        </Typography>
                    </Box>
                </Box>
            }
            {show === 'HOURS_AMOUNT' && <HoursAmount setShow={setShow} />}
            {show === 'WORKERS_STATUS' && <WorkersStatus setShow={setShow} />}
        </>
    );
}