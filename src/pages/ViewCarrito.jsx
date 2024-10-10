import React from 'react'
import MiniDrawer from '../components/common/Sidebar';
import { Box } from '@mui/material'
import Carrito from '../components/data_tables/Carrito'

export default function ViewCarrito() {
    return (
        <div>
            <MiniDrawer>
                <Box sx={{
                    width: '100%',
                    maxWidth: '1200px', // Limitar el ancho máximo si es necesario
                    marginTop: { xs: 8, sm: 9, md: 9, lg: 10 },
                    padding: { xs: 2 }, // Añadir padding en pantallas pequeñas
                }}>
                    <Carrito />
                </Box>
            </MiniDrawer>
        </div>
    )
}