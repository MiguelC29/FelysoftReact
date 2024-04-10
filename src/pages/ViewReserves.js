import React from 'react'
import Reserves from '../components/data_tables/Reserves';
import { Box } from '@mui/material';
import MiniDrawer from '../components/Sidebar';

export default function ViewReserves() {
    return (
        <div>
            <MiniDrawer>
                <Box sx={{ marginTop: 10, mx: 2 }}>
                    <Reserves />
                </Box>
            </MiniDrawer>
        </div>
    );
};