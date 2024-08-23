import React from 'react'
import MiniDrawer from '../components/common/Sidebar';
import { Box } from '@mui/material';
import AssociationAuthorGenre from '../components/data_tables/AssociationAuthorGenre';

export default function ViewAsociationGenAutor() {
    return (
        <div>
            <MiniDrawer>
                <Box sx={{ marginTop: 10, mx: 2 }}>
                    <AssociationAuthorGenre />
                </Box>
            </MiniDrawer>
        </div>
    );
};