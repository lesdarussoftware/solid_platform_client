import { useEffect, useRef, useState } from "react"
import { Box, Button, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow } from "@mui/material"
import QrScanner from "qr-scanner"

export function QrReader({ formData, reset }) {

    const [qrOn, setQrOn] = useState(true)
    const scanner = useRef()
    const videoEl = useRef(null)

    const handleOnline = () => {
        console.log('Conexión restablecida');
    };

    const handleOffline = () => {
        console.log('Conexión perdida');
    };

    useEffect(() => {
        window.addEventListener('online', handleOnline);
        window.addEventListener('offline', handleOffline);

        return () => {
            window.removeEventListener('online', handleOnline);
            window.removeEventListener('offline', handleOffline);
        };
    }, []);

    const onScanSuccess = (result) => {
        console.log(result)
    }

    const onScanFail = (err) => {
        console.log(err)
    }

    useEffect(() => {
        if (videoEl?.current && !scanner.current) {
            // 👉 Instantiate the QR Scanner
            scanner.current = new QrScanner(videoEl?.current, onScanSuccess, {
                onDecodeError: onScanFail,
                // 📷 This is the camera facing mode. In mobile devices, "environment" means back camera and "user" means front camera.
                preferredCamera: "environment",
                // 🔥 This will produce a yellow (default color) outline around the qr code that we scan, showing a proof that our qr-scanner is scanning that qr code.
                highlightCodeOutline: true,
            })
            // 🚀 Start QR Scanner
            scanner?.current
                ?.start()
                .then(() => setQrOn(true))
                .catch((err) => {
                    if (err) setQrOn(false)
                })
        }
        return () => {
            if (!videoEl?.current) {
                scanner?.current?.stop()
            }
        }
    }, [])

    // ❌ If "camera" is not allowed in browser permissions, show an alert.
    useEffect(() => {
        if (!qrOn)
            alert(
                "Camera is blocked or not accessible. Please allow camera in your browser permissions and Reload."
            )
    }, [qrOn])

    return (
        <Box>
            <TableContainer component={Paper} sx={{ width: '35%', margin: '0 auto', marginBottom: 2 }}>
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell align="center">DNI Capataz</TableCell>
                            <TableCell align="center">Obra</TableCell>
                            <TableCell align="center">Tipo</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        <TableRow>
                            <TableCell align="center">{formData.dni}</TableCell>
                            <TableCell align="center">{formData.site_id}</TableCell>
                            <TableCell align="center">{formData.type}</TableCell>
                        </TableRow>
                    </TableBody>
                </Table>
            </TableContainer>
            <Box className="qr-reader">
                <video ref={videoEl}></video>
            </Box>
            <Box sx={{ textAlign: 'center', margin: '0 auto', marginTop: 2, width: '35%' }}>
                <Button
                    type="button"
                    variant="contained"
                    sx={{ width: '100%' }}
                    onClick={() => reset()}
                >
                    Volver
                </Button>
            </Box>
        </Box>
    )
}