import React from 'react';
import MiniDrawer from '../components/common/Sidebar';
import Books from '../components/data_tables/Books';
import { Box } from '@mui/material';

export default function ViewBooks() {
    return (
        <div>
            <MiniDrawer>
                <Box sx={{
                    width: '100%',
                    maxWidth: '1200px', // Limitar el ancho máximo si es necesario
                    marginTop: { xs: 8, sm: 9, md: 9, lg: 10 },
                    padding: { xs: 2 }, // Añadir padding en pantallas pequeñas
                }}>
                    <Books />
                </Box>
            </MiniDrawer>
        </div>
    );
};