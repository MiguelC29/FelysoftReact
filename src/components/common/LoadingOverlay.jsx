import React from 'react';
import "../../css/loadingOverlay.css";
import { CircularProgress } from '@mui/material';

const LoadingOverlay = ({ visible }) => {
    return (
        visible && (
            <div className="loading-overlay">
                <div className="spinner-wrapper">
                    <CircularProgress sx={{ color: 'white' }} />
                    <p>Cargando...</p>
                </div>
            </div>
        )
    );
};

export default LoadingOverlay;
