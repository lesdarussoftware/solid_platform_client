import { useContext, useState } from "react";
import { Avatar, Box, Typography } from "@mui/material";

import { AuthContext } from "../../providers/AuthProvider";

import { UserDropdown } from "./UserDropdown";

import Logo from '../../assets/logo.jpeg'

export function Header() {

    const { auth } = useContext(AuthContext)

    const [showUserDropdown, setShowUserDropdown] = useState(false)

    return (
        <Box sx={{ display: 'flex', justifyContent: 'space-between', paddingLeft: 1, paddingRight: 1 }}>
            <img src={Logo} width={60} />
            <Box sx={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', position: 'relative' }}>
                <Avatar
                    sx={{ cursor: 'pointer' }}
                    onMouseEnter={() => setShowUserDropdown(true)}
                    onClick={() => setShowUserDropdown(!showUserDropdown)}
                >
                    {auth?.me.username.charAt(0).toUpperCase()}
                </Avatar>
                {showUserDropdown && <UserDropdown setShowUserDropdown={setShowUserDropdown} />}
            </Box>
        </Box>
    )
}