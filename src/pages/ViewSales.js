import React from 'react'
import Sales from '../components/data_tables/Sales';
import { Box } from '@mui/material';
import MiniDrawer from '../components/Sidebar';

export default function ViewSales() {
    return (
        <div>
            <MiniDrawer>
                <Box sx={{ marginTop: 10, mx: 2 }}>
                    <Sales />
                </Box>
            </MiniDrawer>
        </div>
    );
};