import { useContext, useEffect, useRef, useState } from "react"
import { Box, Button, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow } from "@mui/material"
import QrScanner from "qr-scanner"

import { DataContext } from "../../providers/DataProvider"

import QrFrame from "../../assets/qr-frame.svg"

export function QrReader({
    formData,
    reset,
    handleSubmit,
    setFormData,
    newMovementWorkerHash,
    setNewMovementWorkerHash
}) {

    const { state } = useContext(DataContext)

    const [reScan, setReScan] = useState(false)
    const [qrOn, setQrOn] = useState(true)

    const scanner = useRef()
    const videoEl = useRef(null)
    const qrBoxEl = useRef(null)

    const onScanSuccess = (result) => {
        setNewMovementWorkerHash(parseInt(result.data))
        scanner?.current?.stop()
        setReScan(true)
    }

    useEffect(() => {
        setFormData({ ...formData, worker_id: newMovementWorkerHash })
    }, [newMovementWorkerHash])

    useEffect(() => {
        if (formData.worker_id.toString().length > 0) handleSubmit()
    }, [formData.worker_id])

    const onScanFail = (err) => console.log(err)

    const handleReScan = () => {
        setReScan(false)
        scanner?.current
            ?.start()
            .then(() => setQrOn(true))
            .catch((err) => {
                if (err) setQrOn(false)
            })
    }

    useEffect(() => {
        if (videoEl?.current && !scanner.current) {
            // 👉 Instantiate the QR Scanner
            scanner.current = new QrScanner(videoEl?.current, onScanSuccess, {
                onDecodeError: onScanFail,
                // 📷 This is the camera facing mode. In mobile devices, "environment" means back camera and "user" means front camera.
                preferredCamera: "environment",
                // 🖼 This will help us position our "QrFrame.svg" so that user can only scan when qr code is put in between our QrFrame.svg.
                highlightScanRegion: true,
                // 🔥 This will produce a yellow (default color) outline around the qr code that we scan, showing a proof that our qr-scanner is scanning that qr code.
                highlightCodeOutline: true,
                // 📦 A custom div which will pair with "highlightScanRegion" option above 👆. This gives us full control over our scan region.
                overlay: qrBoxEl?.current || undefined,
            })

            // 🚀 Start QR Scanner
            scanner?.current
                ?.start()
                .then(() => setQrOn(true))
                .catch((err) => {
                    if (err) setQrOn(false)
                })
        }

        // 🧹 Clean up on unmount.
        // 🚨 This removes the QR Scanner from rendering and using camera when it is closed or removed from the UI.
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
            <TableContainer component={Paper} sx={{ width: { xs: '80%', sm: '35%' }, margin: '0 auto', marginBottom: 2 }}>
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell align="center">Capataz</TableCell>
                            <TableCell align="center">Obra</TableCell>
                            <TableCell align="center">Tipo</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        <TableRow>
                            <TableCell align="center">
                                {`${state.chiefs.find(c => c.id === parseInt(formData.chief_id))?.first_name} ${state.chiefs.find(c => c.id === parseInt(formData.chief_id))?.last_name} (${state.chiefs.find(c => c.id === parseInt(formData.chief_id))?.dni})`}
                            </TableCell>
                            <TableCell align="center">{state.sites.find(s => s.id === parseInt(formData.site_id))?.name}</TableCell>
                            <TableCell align="center">{formData.type}</TableCell>
                        </TableRow>
                    </TableBody>
                </Table>
            </TableContainer>
            <div className="qr-reader" style={{ display: reScan ? 'none' : 'block' }}>
                <video ref={videoEl}></video>
                <div ref={qrBoxEl} className="qr-box">
                    <img
                        src={QrFrame}
                        alt="Qr Frame"
                        width={256}
                        height={256}
                        className="qr-frame"
                    />
                </div>
            </div>
            <Box sx={{ textAlign: 'center', margin: '0 auto', marginTop: 2, width: { xs: '80%', sm: '35%' } }}>
                {reScan &&
                    <Button
                        type="button"
                        variant="contained"
                        sx={{ width: '100%', padding: 2, marginBottom: 1 }}
                        onClick={handleReScan}
                    >
                        Escanear nuevo QR
                    </Button>
                }
                <Button
                    type="button"
                    variant="contained"
                    sx={{ width: '100%', padding: 2 }}
                    onClick={() => reset()}
                >
                    Volver
                </Button>
            </Box>
        </Box>
    )
}