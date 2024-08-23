import React from 'react'
import MiniDrawer from '../components/common/Sidebar';
import { Box } from '@mui/material';
import AssociationProviderCategory from '../components/data_tables/AssociationProviderCategory';

export default function ViewAssociationCateProv() {
    return (
        <div>
            <MiniDrawer>
                <Box sx={{ marginTop: 10, mx: 2 }}>
                    <AssociationProviderCategory />
                </Box>
            </MiniDrawer>
        </div>
    );
};