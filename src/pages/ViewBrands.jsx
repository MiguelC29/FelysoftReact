import React from 'react';
import { Box } from '@mui/material';
import MiniDrawer from '../components/common/Sidebar';
import Brands from '../components/data_tables/Brands';

export default function ViewBrands() {
    return (
        <div>
            <MiniDrawer>
                <Box sx={{ marginTop: 10, mx: 2 }}>
                    <Brands />
                </Box>
            </MiniDrawer>
        </div>
    );
};