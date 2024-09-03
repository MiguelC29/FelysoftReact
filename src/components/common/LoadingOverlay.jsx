import React from 'react';
import { ProgressSpinner } from 'primereact/progressspinner';
import "../../css/loadingOverlay.css";

const LoadingOverlay = ({ visible }) => {
    return (
        visible && (
            <div className="loading-overlay">
                <div className="spinner-wrapper">
                    <ProgressSpinner />
                    <p>Cargando...</p>
                </div>
            </div>
        )
    );
};

export default LoadingOverlay;
