import React from 'react'
import MiniDrawer from '../components/common/Sidebar';
import { Box } from '@mui/material'
import Carrito from '../components/data_tables/Carrito'

export default function ViewCarrito() {
    return (
        <div>
            <MiniDrawer>
                <Box sx={{ marginTop: 10, mx: 2 }}>
                    <Carrito />
                </Box>
            </MiniDrawer>
        </div>
    )
}