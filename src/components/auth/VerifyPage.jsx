import React, { useState } from 'react';
import Swal from 'sweetalert2';
import { useNavigate } from 'react-router-dom';
import UserService from '../service/UserService';
import LoadingOverlay from "../common/LoadingOverlay";
import { Button } from 'primereact/button';
import '../../css/verifyPage.css';
import { Card } from 'primereact/card';

function VerifyPage() {

    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const verifyAccount = () => {

        const queryParams = new URLSearchParams(window.location.search);
        const token = queryParams.get('token');

        if (token) {
            setLoading(true);
            UserService.verifyAccount(token, setLoading, navigate);
        } else {
            setLoading(false);
            Swal.fire({
                title: "Error",
                text: "Token de verificación no proporcionado.",
                icon: "error",
                confirmButtonText: 'OK'
            }).then(() => {
                navigate('/login');
            });
        }
    }

    return (
        <div className="verify-container d-flex align-items-center justify-content-center min-vh-100">
            <Card className="p-4 text-center shadow-sm verify-card">
                <div className="logo-container mb-4">
                    <img src="https://i.postimg.cc/FznvrwC7/logo.png" alt="Felysoft Logo" className="logoF" />
                </div>
                <h2 className="mb-4">Verificación de Cuenta</h2>
                <p className="mb-4">
                    Para completar el registro, por favor verifica tu cuenta haciendo clic en el botón a continuación.
                </p>
                <Button
                    label="Verificar Cuenta"
                    icon="pi pi-check"
                    className="btn-verify p-button-primary p-button-rounded p-button-lg"
                    onClick={verifyAccount}
                    loading={loading}
                />
            </Card>
            <LoadingOverlay visible={loading} />
        </div>
    );
};

export default VerifyPage;
