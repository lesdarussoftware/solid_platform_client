import { useContext, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import CssBaseline from '@mui/material/CssBaseline';
import Divider from '@mui/material/Divider';
import Drawer from '@mui/material/Drawer';
import IconButton from '@mui/material/IconButton';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemText from '@mui/material/ListItemText';
import MenuIcon from '@mui/icons-material/Menu';
import Toolbar from '@mui/material/Toolbar';
import { Avatar } from "@mui/material";
import Button from '@mui/material/Button';

import { AuthContext } from '../../providers/AuthProvider';

import { UserDropdown } from './UserDropdown';

import { serverIsAboutToExpire } from '../../helpers/utils';

import LogoWhite from '../../assets/logo-white.jpeg';
import LogoBlack from '../../assets/logo-black.jpeg';

const drawerWidth = 240;

export function Layout({ window, children }) {

    const { auth } = useContext(AuthContext);

    const navigate = useNavigate()
    const { pathname } = useLocation()

    const [mobileOpen, setMobileOpen] = useState(false);
    const [showUserDropdown, setShowUserDropdown] = useState(false);
    const serverDeadLine = import.meta.env.VITE_APP_SERVER_DEADLINE;

    const navItems = [
        { label: 'Tarjas', pathname: '/tarjas', action: () => navigate('/tarjas') },
        { label: 'Obras', pathname: '/obras', action: () => navigate('/obras') },
        { label: 'Usuarios', pathname: '/usuarios', action: () => navigate('/usuarios') },
        { label: 'Papelera', pathname: '/papelera', action: () => navigate('/papelera') }
    ];

    const handleDrawerToggle = () => {
        setMobileOpen((prevState) => !prevState);
    };

    const drawer = (
        <Box onClick={handleDrawerToggle} sx={{ textAlign: 'center' }}>
            <img src={LogoWhite} width={60} />
            <Divider />
            <List>
                {navItems.map((item) => (
                    <ListItem key={item.label} disablePadding onClick={() => item.action()}>
                        <ListItemButton sx={{ textAlign: 'center' }}>
                            <ListItemText primary={item.label.toUpperCase()} />
                        </ListItemButton>
                    </ListItem>
                ))}
            </List>
        </Box>
    );

    const container = window !== undefined ? () => window().document.body : undefined;

    return (
        <Box>
            <CssBaseline />
            <AppBar position="fixed" sx={{ alignItems: 'center' }}>
                <Toolbar sx={{ width: '100%', maxWidth: '2000px', display: 'flex', justifyContent: 'space-between', px: 2 }}>
                    <IconButton
                        color="inherit"
                        aria-label="open drawer"
                        edge="start"
                        onClick={handleDrawerToggle}
                        sx={{ mr: 2, display: { sm: 'none' } }}
                    >
                        <MenuIcon />
                    </IconButton>
                    <img src={LogoBlack} width={60} className='menuLogo' />
                    <Box sx={{ display: 'flex', justifyContent: 'end', alignItems: 'center', gap: 2 }}>
                        <Box sx={{ display: { xs: 'none', sm: 'block' } }}>
                            {navItems.map((item) => (
                                <Button
                                    key={item.label}
                                    sx={{
                                        backgroundColor: pathname === item.pathname ? '#fff' : '#000',
                                        color: pathname === item.pathname ? '#000' : '#fff',
                                        mr: 1,
                                        ml: 1,
                                        ':hover': {
                                            backgroundColor: '#fff',
                                            color: '#000'
                                        }
                                    }}
                                    onClick={() => item.action()}
                                >
                                    {item.label}
                                </Button>
                            ))}
                        </Box>
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
                </Toolbar>
            </AppBar>
            <nav>
                <Drawer
                    container={container}
                    variant="temporary"
                    open={mobileOpen}
                    onClose={handleDrawerToggle}
                    ModalProps={{ keepMounted: true }}
                    sx={{
                        display: { xs: 'block', sm: 'none' },
                        '& .MuiDrawer-paper': { boxSizing: 'border-box', width: drawerWidth },
                    }}
                >
                    {drawer}
                </Drawer>
            </nav>
            <Box sx={{
                pl: { xs: 1, md: 3 },
                pr: { xs: 1, md: 3 },
                pt: { xs: 4, sm: 8 }
            }}>
                {serverIsAboutToExpire(serverDeadLine) &&
                    <Box sx={{ mt: { xs: 5, sm: 2 }, backgroundColor: 'red', color: '#FFF', p: 0.5, borderRadius: 1, width: 'fit-content' }}>
                        El servidor vence el día {serverDeadLine}. Contacte al administrador para renovarlo.
                    </Box>
                }
                {children}
            </Box>
        </Box>
    );
}