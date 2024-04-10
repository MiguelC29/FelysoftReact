import React from 'react'
import Charges from '../components/data_tables/Charges'
import { Box } from '@mui/material';
import MiniDrawer from '../components/Sidebar';

export default function ViewCharges() {
    return (
        <div>
            <MiniDrawer>
                <Box sx={{ marginTop: 10, mx: 2 }}>
                    <Charges />
                </Box>
            </MiniDrawer>
        </div>
    );
};