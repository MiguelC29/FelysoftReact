import React from 'react';
import MiniDrawer from '../components/newSidebar';
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
}
