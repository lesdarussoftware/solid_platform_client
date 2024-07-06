import { useContext, useState } from "react"
import { Box, Tabs, Tab, Typography } from "@mui/material"

import { AuthContext } from "../providers/AuthProvider"

import { MovementsAbm } from "../components/abm/MovementsAbm"
import { ChiefsAbm } from "../components/abm/ChiefsAbm"
import { WorkersAbm } from "../components/abm/WorkersAbm"
import { Header } from "../components/common/Header"
import { LoginForm } from "../components/common/LoginForm"
import { CategoriesAbm } from "../components/abm/CategoriesAbm"
import { SitesAbm } from "../components/abm/SitesAbm"
import { UsersAbm } from "../components/abm/UsersAbm"

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
            {value === index && <Box sx={{ paddingTop: 1 }}>{children}</Box>}
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

    const { auth } = useContext(AuthContext)

    const [value, setValue] = useState(0)

    const handleChange = (event, newValue) => {
        setValue(newValue)
    }

    return (
        <>
            {auth ?
                <Box>
                    <Header />
                    <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
                        <Tabs
                            value={value}
                            onChange={handleChange}
                            aria-label="basic tabs example"
                            variant="scrollable"
                            scrollButtons="auto"
                            sx={{ marginY: { xs: 3, sm: 0 } }}
                        >
                            <Tab label="Planilla" {...a11yProps(0)} />
                            <Tab label="Operarios" {...a11yProps(1)} />
                            <Tab label="Capataces" {...a11yProps(2)} />
                            <Tab label="Categorías" {...a11yProps(3)} />
                            <Tab label="Obras" {...a11yProps(4)} />
                            <Tab label="Usuarios" {...a11yProps(5)} />
                        </Tabs>
                    </Box>
                    <CustomTabPanel value={value} index={0}>
                        <MovementsAbm />
                    </CustomTabPanel>
                    <CustomTabPanel value={value} index={1}>
                        <WorkersAbm />
                    </CustomTabPanel>
                    <CustomTabPanel value={value} index={2}>
                        <ChiefsAbm />
                    </CustomTabPanel>
                    <CustomTabPanel value={value} index={3}>
                        <CategoriesAbm />
                    </CustomTabPanel>
                    <CustomTabPanel value={value} index={4}>
                        <SitesAbm />
                    </CustomTabPanel>
                    <CustomTabPanel value={value} index={5}>
                        <UsersAbm />
                    </CustomTabPanel>
                </Box> :
                <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '90vh' }}>
                    <Box sx={{ width: '30%' }}>
                        <Typography variant="h6" align="center" marginBottom={1}>
                            Inicie sesión para usar el sistema
                        </Typography>
                        <LoginForm />
                    </Box>
                </Box>
            }
        </>
    )
}