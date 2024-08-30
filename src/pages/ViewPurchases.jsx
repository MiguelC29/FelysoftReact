import React from 'react'
import Purchases from '../components/data_tables/Purchases';
import { Box } from '@mui/material';
import MiniDrawer from '../components/common/Sidebar';
import PurchasesC from '../components/data_tables/PurchasesC';

export default function ViewPurchases() {
    return (
        <div>
            <MiniDrawer>
                <Box sx={{ marginTop: 10, mx: 2 }}>
                    <PurchasesC />
                </Box>
            </MiniDrawer>
        </div>
    );
};