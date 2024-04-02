import React from 'react'
import Purchases from '../components/data_tables/Purchases';
import { Box } from '@mui/material';
import MiniDrawer from '../components/newSidebar';

export default function ViewPurchases() {
  return (
    <div>
        <MiniDrawer>
            <Box sx={{ marginTop: 10, mx: 2 }}>
                <Purchases />
            </Box>
        </MiniDrawer>
    </div>
);
}