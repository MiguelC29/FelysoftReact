import React from 'react'
import Authors from '../components/data_tables/Authors'
import MiniDrawer from '../components/common/Sidebar';
import { Box } from '@mui/material';

export default function ViewAuthors() {
    return (
        <div>
            <MiniDrawer>
                <Box sx={{ marginTop: 10, mx: 2 }}>
                    <Authors />
                </Box>
            </MiniDrawer>
        </div>
    );
};