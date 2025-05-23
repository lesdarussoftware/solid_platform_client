import { useContext, useState } from "react"
import { Box, Tabs, Tab, Typography } from "@mui/material"

import { AuthContext } from "../providers/AuthProvider"

import { MovementsAbm } from "../components/abm/MovementsAbm"
import { ActivitiesAbm } from "../components/abm/ActivitiesAbm"
import { WorkersAbm } from "../components/abm/WorkersAbm"
import { LoginForm } from "../components/common/LoginForm"
import { CategoriesAbm } from "../components/abm/CategoriesAbm"
import { ReportsMenu } from "../components/reports/ReportsMenu"
import { Layout } from "../components/common/Layout"
import { CustomTabPanel } from "../components/common/CustomTabPanel"

import { a11yProps } from "../helpers/utils"

export function Tarjas() {

    const { auth } = useContext(AuthContext)

    const [value, setValue] = useState(0)

    const handleChange = (_, newValue) => {
        setValue(newValue)
    }

    return (
        <>
            {auth ?
                <Layout>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 3 }}>
                        <Box sx={{
                            borderBottom: 1,
                            borderColor: 'divider',
                            overflow: { xs: 'scroll', sm: 'auto' }
                        }}>
                            <Tabs
                                value={value}
                                onChange={handleChange}
                                aria-label="basic tabs example"
                                variant="scrollable"
                                scrollButtons="auto"
                                sx={{ marginY: { xs: 3, sm: 0 } }}
                            >
                                <Tab label="Ing./Egr." {...a11yProps(0)} />
                                <Tab label="Hs. Extra" {...a11yProps(1)} />
                                <Tab label="Personal" {...a11yProps(2)} />
                                <Tab label="Categorías" {...a11yProps(3)} />
                                <Tab label="Reportes" {...a11yProps(4)} />
                            </Tabs>
                        </Box>
                    </Box>
                    <CustomTabPanel value={value} index={0}>
                        <MovementsAbm />
                    </CustomTabPanel>
                    <CustomTabPanel value={value} index={1}>
                        <ActivitiesAbm />
                    </CustomTabPanel>
                    <CustomTabPanel value={value} index={2}>
                        <WorkersAbm />
                    </CustomTabPanel>
                    <CustomTabPanel value={value} index={3}>
                        <CategoriesAbm />
                    </CustomTabPanel>
                    <CustomTabPanel value={value} index={4}>
                        <ReportsMenu />
                    </CustomTabPanel>
                </Layout> :
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