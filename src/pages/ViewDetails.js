import React from 'react'
import Details from '../components/data_tables/Details';
import { Box } from '@mui/material';
import MiniDrawer from '../components/Sidebar';

export default function ViewDetails() {
    return (
        <div>
            <MiniDrawer>
                <Box sx={{ marginTop: 10, mx: 2 }}>
                    <Details />
                </Box>
            </MiniDrawer>
        </div>
    );
};