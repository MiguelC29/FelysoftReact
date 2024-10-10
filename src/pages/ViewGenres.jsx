import React from 'react'
import Genres from '../components/data_tables/Genres';
import { Box } from '@mui/material';
import MiniDrawer from '../components/common/Sidebar';

export default function ViewGenres() {
    return (
        <div>
            <MiniDrawer>
                <Box sx={{
                    width: '100%',
                    maxWidth: '1200px', // Limitar el ancho máximo si es necesario
                    marginTop: { xs: 8, sm: 9, md: 9, lg: 10 },
                    padding: { xs: 2 }, // Añadir padding en pantallas pequeñas
                }}>
                    <Genres />
                </Box>
            </MiniDrawer>
        </div>
    );
};