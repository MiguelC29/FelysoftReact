import React from 'react'
import MiniDrawer from '../components/common/Sidebar';
import { Box } from '@mui/material'
import Reservar from '../components/data_tables/Reservas'

export default function ViewReserva() {
    return (
        <div>
            <MiniDrawer>
                <Box sx={{ marginTop: 10, mx: 2 }}>
                    <Reservar />
                </Box>
            </MiniDrawer>
        </div>
    )
}