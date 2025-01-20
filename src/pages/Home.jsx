import { useContext, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Box } from "@mui/material";

import { AuthContext } from "../providers/AuthProvider";

import { LoginForm } from "../components/common/LoginForm";

import Logo from '../assets/logo.png'

export function Home() {

    const { auth } = useContext(AuthContext)

    const navigate = useNavigate()

    useEffect(() => {
        if (auth) navigate('/tarjas')
    }, [auth])

    return (
        <Box sx={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            height: '90vh',
            flexDirection: 'column'
        }}>
            <img src={Logo} width={180} />
            <LoginForm submitAction={() => navigate('/tarjas')} />
        </Box>
    )
}