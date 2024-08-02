import { useContext, useState } from 'react';
import { useNavigate } from 'react-router-dom';
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

import LogoWhite from '../../assets/logo-white.jpeg';
import LogoBlack from '../../assets/logo-black.jpeg';

const drawerWidth = 240;

export function Layout({ window, children }) {

    const { auth } = useContext(AuthContext);

    const navigate = useNavigate()

    const [mobileOpen, setMobileOpen] = useState(false);
    const [showUserDropdown, setShowUserDropdown] = useState(false);

    const navItems = [
        { label: 'Tarjas', action: () => navigate('/tarjas') },
        { label: 'Obras', action: () => navigate('/obras') },
        { label: 'Usuarios', action: () => navigate('/usuarios') }
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
                                    sx={{ color: '#fff', mr: 1, ml: 1 }}
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
            <Box sx={{ p: 3, pt: { xs: 4, sm: 9 } }}>
                {children}
            </Box>
        </Box>
    );
}