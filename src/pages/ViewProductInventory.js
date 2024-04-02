import React from 'react'
import ProductInventory from '../components/data_tables/ProductInventory'
import { Box } from '@mui/material';
import MiniDrawer from '../components/Sidebar';


export default function ViewProductInventory() {
    return (
        <div>
            <MiniDrawer>
                <Box sx={{ marginTop: 10, mx: 2 }}>
                    <ProductInventory />
                </Box>
            </MiniDrawer>
        </div>
    );
}