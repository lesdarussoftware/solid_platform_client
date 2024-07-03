import { createContext, useState } from "react";

import { ModalComponent } from "../components/common/ModalComponent";
import { LoginForm } from "../components/common/LoginForm";

export const AuthContext = createContext({
    auth: null,
    setAuth: () => { },
    openModal: false,
    setOpenModal: () => { }
})

export function AuthProvider({ children }) {

    const [auth, setAuth] = useState(JSON.parse(localStorage.getItem('solid_auth')))
    const [openModal, setOpenModal] = useState(false)

    return (
        <AuthContext.Provider value={{ auth, setAuth, openModal, setOpenModal }}>
            <ModalComponent open={openModal} onClose={() => setOpenModal(false)}>
                <Typography variant="h6" sx={{ color: '#000' }} align="center">
                    Tu sesión expiró. Por favor ingresa de nuevo tu usuario y contraseña
                </Typography>
                <LoginForm />
            </ModalComponent>
            {children}
        </AuthContext.Provider>
    )
}