import { useContext, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Box, Typography } from "@mui/material";

import { AuthContext } from "../providers/AuthProvider";

import { LoginForm } from "../components/common/LoginForm";

export function Home() {

    const { auth } = useContext(AuthContext)

    const navigate = useNavigate()

    useEffect(() => {
        if (auth) navigate('/dashboard')
    }, [auth])

    return (
        <Box sx={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            height: '90vh',
            flexDirection: 'column',
            gap: 3
        }}>
            <Typography variant="h2" sx={{ color: '#000', fontSize: 45 }}>
                Solid Platform
            </Typography>
            <LoginForm submitAction={() => navigate('/dashboard')} />
        </Box>
    )
}