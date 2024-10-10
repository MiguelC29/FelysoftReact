import React from 'react'
import TypeServices from '../components/data_tables/Typeservices'
import { Box } from '@mui/material';
import MiniDrawer from '../components/common/Sidebar';

export default function ViewTypeservices() {
    return (
        <div>
            <MiniDrawer>
                <Box sx={{
                    width: '100%',
                    maxWidth: '1200px', // Limitar el ancho máximo si es necesario
                    marginTop: { xs: 8, sm: 9, md: 9, lg: 10 },
                    padding: { xs: 2 }, // Añadir padding en pantallas pequeñas
                }}>
                    <TypeServices />
                </Box>
            </MiniDrawer>
        </div>
    );
};