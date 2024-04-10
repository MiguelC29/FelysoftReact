import React from 'react'
import Products from '../components/data_tables/Products'
import { Box } from '@mui/material';
import MiniDrawer from '../components/Sidebar';

export default function ViewProducts() {
    return (
        <div>
            <MiniDrawer>
                <Box sx={{ marginTop: 10, mx: 2 }}>
                    <Products />
                </Box>
            </MiniDrawer>
        </div>
    );
};