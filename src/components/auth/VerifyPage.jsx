import React, { useEffect, useState } from 'react';
import Swal from 'sweetalert2';
import { useNavigate } from 'react-router-dom';
import { Box, CircularProgress, Typography } from '@mui/material';
import UserService from '../service/UserService';
import LoadingOverlay from "../common/LoadingOverlay";

const VerifyPage = () => {
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        const queryParams = new URLSearchParams(window.location.search);
        const token = queryParams.get('token');

        if (token) {
            UserService.verifyAccount(token)
                .then(response => {
                    setLoading(false);
                    setSuccess("Cuenta activada correctamente.");
                })
                .catch(error => {
                    setLoading(false);
                    setError("Error al activar la cuenta. Intenta nuevamente.");
                });
        } else {
            setLoading(false);
            setError("Token de verificación no proporcionado.");
        }
    }, [navigate]);

    useEffect(() => {
        if (loading) return;
        if (error) {
            Swal.fire({
                title: 'Error',
                text: error,
                icon: 'error',
                confirmButtonText: 'OK'
            }).then(() => {
                navigate('/login');
            });
        } else if (success) {
            Swal.fire({
                title: 'Éxito',
                text: success,
                icon: 'success',
                confirmButtonText: 'OK'
            }).then(() => {
                navigate('/login');
            });
        }
    }, [loading, error, success, navigate]);

    return (
        <>
            <LoadingOverlay visible={loading} /> {/* Overlay de carga */}
            <Box
                display="flex"
                justifyContent="center"
                alignItems="center"
                minHeight="100vh"
                flexDirection="column"
            >
                {loading && (
                    <>
                        <CircularProgress />
                        <Typography variant="h6" mt={2} className='text-white'>
                            Verificando...
                        </Typography>
                    </>
                )}
                {!loading && !error && !success && (
                    <Typography variant="h6">
                        Esperando resultado...
                    </Typography>
                )}
            </Box>
        </>
    );
};

export default VerifyPage;
