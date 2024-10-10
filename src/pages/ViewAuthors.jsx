import React from 'react'
import Authors from '../components/data_tables/Authors'
import MiniDrawer from '../components/common/Sidebar';
import { Box } from '@mui/material';

export default function ViewAuthors() {
    return (
        <div>
            <MiniDrawer>
                <Box sx={{
                    width: '100%',
                    maxWidth: '1200px', // Limitar el ancho máximo si es necesario
                    marginTop: { xs: 8, sm: 9, md: 9, lg: 10 },
                    padding: { xs: 2 }, // Añadir padding en pantallas pequeñas
                }}>
                    <Authors />
                </Box>
            </MiniDrawer>
        </div>
    );
};