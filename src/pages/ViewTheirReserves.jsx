import React from 'react'
import MiniDrawer from '../components/common/Sidebar';
import { Box } from '@mui/material'
import TheirReserves from '../components/data_tables/TheirReserves';

export default function ViewTheirReserves() {
    return (
        <div>
            <MiniDrawer>
                <Box sx={{ marginTop: 10, mx: 2 }}>
                    <TheirReserves />
                </Box>
            </MiniDrawer>
        </div>
    )
}