import React from 'react'
import Employees from '../components/data_tables/Employees'
import { Box } from '@mui/material';
import MiniDrawer from '../components/Sidebar';


export default function ViewEmployees() {
    return (
        <div>
            <MiniDrawer>
                <Box sx={{ marginTop: 10, mx: 2 }}>
                    <Employees />
                </Box>
            </MiniDrawer>
        </div>
    );
}
