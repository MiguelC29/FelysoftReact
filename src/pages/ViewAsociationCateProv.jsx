import React from 'react'
import MiniDrawer from '../components/common/Sidebar';
import { Box } from '@mui/material';
import AsociationProviderCategory from '../components/data_tables/AsociationProviderCategory';

export default function ViewAsociationCateProv() {
    return (
        <div>
            <MiniDrawer>
                <Box sx={{ marginTop: 10, mx: 2 }}>
                    <AsociationProviderCategory />
                </Box>
            </MiniDrawer>
        </div>
    );
};