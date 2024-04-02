import React from 'react'
import Payments from '../components/data_tables/Payments';
import { Box } from '@mui/material';
import MiniDrawer from '../components/newSidebar';

export default function ViewPayments() {
  return (
    <div>
        <MiniDrawer>
            <Box sx={{ marginTop: 10, mx: 2 }}>
                <Payments />
            </Box>
        </MiniDrawer>
    </div>
);
}