import React from 'react'
import Providers from '../components/data_tables/Providers'
import { Box } from '@mui/material';
import MiniDrawer from '../components/Sidebar';

export default function ViewProviders() {
    return (
        <div>
            <MiniDrawer>
                <Box sx={{ marginTop: 10, mx: 2 }}>
                    <Providers />
                </Box>
            </MiniDrawer>
        </div>
    );
}