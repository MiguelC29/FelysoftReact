import React from 'react';
import MiniDrawer from '../components/Sidebar';
import Books from '../components/data_tables/Books';
import { Box } from '@mui/material';

export default function ViewBooks() {
    return (
        <div>
            <MiniDrawer>
                <Box sx={{ marginTop: 10, mx: 2 }}>
                    <Books />
                </Box>
            </MiniDrawer>
        </div>
    );
};