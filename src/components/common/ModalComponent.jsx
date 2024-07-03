import Backdrop from '@mui/material/Backdrop';
import Box from '@mui/material/Box';
import Modal from '@mui/material/Modal';
import Fade from '@mui/material/Fade';
import { useState } from 'react';

export function ModalComponent({ children, open, onClose, reduceWidth = 800 }) {

    const [screenWidth, setScreenWidth] = useState(window.innerWidth < 700 ? window.innerWidth : window.innerWidth - reduceWidth)

    window.onresize = () => {
        if (window.innerWidth < 700) {
            setScreenWidth(window.innerWidth)
        } else {
            setScreenWidth(window.innerWidth - 300)
        }
    }

    const style = {
        position: 'absolute',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        backgroundColor: 'white',
        boxShadow: 24,
        padding: 3,
        borderRadius: 1,
        width: screenWidth
    }

    return (
        <Modal
            aria-labelledby="transition-modal-title"
            aria-describedby="transition-modal-description"
            open={open}
            onClose={onClose}
            closeAfterTransition
            slots={{ backdrop: Backdrop }}
            slotProps={{
                backdrop: {
                    timeout: 500,
                },
            }}
        >
            <Fade in={open}>
                <Box sx={style}>
                    {children}
                </Box>
            </Fade>
        </Modal>
    );
}