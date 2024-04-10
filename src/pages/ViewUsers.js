import React from 'react'
import Users from '../components/data_tables/Users'
import { Box } from '@mui/material';
import MiniDrawer from '../components/Sidebar';

export default function ViewUsers() {
    return (
        <div>
            <MiniDrawer>
                <Box sx={{ marginTop: 10, mx: 2 }}>
                    <Users />
                </Box>
            </MiniDrawer>
        </div>
    );
};