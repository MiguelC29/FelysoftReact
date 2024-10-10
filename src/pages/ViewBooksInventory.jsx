import React from 'react'
import MiniDrawer from '../components/common/Sidebar';
import { Box } from '@mui/material'
import BookInventory from '../components/data_tables/BookInventory'

export default function ViewBooksInventory() {
    return (
        <div>
            <MiniDrawer>
                <Box sx={{
                    width: '100%',
                    maxWidth: '1200px', // Limitar el ancho máximo si es necesario
                    marginTop: { xs: 8, sm: 9, md: 9, lg: 10 },
                    padding: { xs: 2 }, // Añadir padding en pantallas pequeñas
                }}>
                    <BookInventory />
                </Box>
            </MiniDrawer>
        </div>
    );
};