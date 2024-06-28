import { useContext, useState } from "react"
import { useNavigate } from "react-router-dom"
import { Box, Tabs, Tab, Typography, Button } from "@mui/material"

import { AuthContext } from "../providers/AuthProvider"

import { ChiefsAbm } from "../components/ChiefsAbm"
import { WorkersAbm } from "../components/WorkersAbm"

function CustomTabPanel(props) {

    const { children, value, index, ...other } = props

    return (
        <div
            role="tabpanel"
            hidden={value !== index}
            id={`simple-tabpanel-${index}`}
            aria-labelledby={`simple-tab-${index}`}
            {...other}
        >
            {value === index && <Box sx={{ p: 1 }}>{children}</Box>}
        </div>
    )
}

function a11yProps(index) {
    return {
        id: `simple-tab-${index}`,
        'aria-controls': `simple-tabpanel-${index}`,
    }
}

export function Dashboard() {

    const { setAuth } = useContext(AuthContext)

    const navigate = useNavigate()

    const [value, setValue] = useState(0)

    const handleChange = (event, newValue) => {
        setValue(newValue)
    }

    const logout = () => {
        navigate('/')
        setAuth(null)
        localStorage.removeItem('solid_auth')
    }

    return (
        <Box sx={{ paddingX: 2 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', marginBottom: 3, paddingY: 1 }}>
                <Typography variant="h6" align="center">
                    Solid Platform
                </Typography>
                <Button type="button" variant="contained" onClick={logout}>
                    Cerrar sesión
                </Button>
            </Box>
            <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
                <Tabs value={value} onChange={handleChange} aria-label="basic tabs example">
                    <Tab label="Planilla" {...a11yProps(0)} />
                    <Tab label="Capataces" {...a11yProps(1)} />
                    <Tab label="Empleados" {...a11yProps(2)} />
                </Tabs>
            </Box>
            <CustomTabPanel value={value} index={0}>
            </CustomTabPanel>
            <CustomTabPanel value={value} index={1}>
                <ChiefsAbm />
            </CustomTabPanel>
            <CustomTabPanel value={value} index={2}>
                <WorkersAbm />
            </CustomTabPanel>
        </Box>
    )
}