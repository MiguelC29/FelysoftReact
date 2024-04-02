import React from 'react'
import Expenses from '../components/data_tables/Expenses';
import { Box } from '@mui/material';
import MiniDrawer from '../components/Sidebar';

export default function ViewExpenses() {
  return (
    <div>
        <MiniDrawer>
            <Box sx={{ marginTop: 10, mx: 2 }}>
                <Expenses />
            </Box>
        </MiniDrawer>
    </div>
);
}