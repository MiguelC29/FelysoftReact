import React from 'react'
import TypeServices from '../components/data_tables/Typeservices'
import { Box } from '@mui/material';
import MiniDrawer from '../components/Sidebar';


export default function ViewTypeservices() {
    return (
        <div>
            <MiniDrawer>
                <Box sx={{ marginTop: 10, mx: 2 }}>
                    <TypeServices />
                </Box>
            </MiniDrawer>
        </div>
    );
}
