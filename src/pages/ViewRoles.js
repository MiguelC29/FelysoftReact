import React from 'react'
import Roles from '../components/data_tables/Roles'
import { Box } from '@mui/material';
import MiniDrawer from '../components/Sidebar';

export default function ViewRoles() {
    return (
        <div>
            <MiniDrawer>
                <Box sx={{ marginTop: 10, mx: 2 }}>
                    <Roles />
                </Box>
            </MiniDrawer>
        </div>
    );
};