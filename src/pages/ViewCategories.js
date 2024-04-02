import React from 'react';
import Categories from '../components/data_tables/Categories';
import { Box } from '@mui/material';
import MiniDrawer from '../components/Sidebar';

export default function ViewCategories() {
    return (
        <div>
            <MiniDrawer>
                <Box sx={{ marginTop: 10, mx: 2 }}>
                    <Categories />
                </Box>
            </MiniDrawer>
        </div>
    );
}