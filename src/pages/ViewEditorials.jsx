import React from 'react'
import Editorials from '../components/data_tables/Editorials';
import { Box } from '@mui/material';
import MiniDrawer from '../components/common/Sidebar';

export default function ViewGenres() {
    return (
        <div>
            <MiniDrawer>
                <Box sx={{ marginTop: 10, mx: 2 }}>
                    <Editorials />
                </Box>
            </MiniDrawer>
        </div>
    );
};