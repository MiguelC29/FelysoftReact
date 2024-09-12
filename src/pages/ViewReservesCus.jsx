import React from 'react'
import MiniDrawer from '../components/common/Sidebar';
import { Box } from '@mui/material'
import ReservesCus from '../components/data_tables/ReservesCus';

export default function ViewReservesCus() {
    return (
        <div>
            <MiniDrawer>
                <Box sx={{ marginTop: 10, mx: 2 }}>
                    <ReservesCus />
                </Box>
            </MiniDrawer>
        </div>
    )
}