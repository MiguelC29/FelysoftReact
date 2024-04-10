import React from 'react'
import Genres from '../components/data_tables/Genres';
import { Box } from '@mui/material';
import MiniDrawer from '../components/Sidebar';

export default function ViewGenres() {
    return (
        <div>
            <MiniDrawer>
                <Box sx={{ marginTop: 10, mx: 2 }}>
                    <Genres />
                </Box>
            </MiniDrawer>
        </div>
    );
};