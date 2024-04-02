import React from 'react'
import Services from '../components/data_tables/Services'
import { Box } from '@mui/material';
import MiniDrawer from '../components/Sidebar';


export default function ViewServices() {
    return (
        <div>
            <MiniDrawer>
                <Box sx={{ marginTop: 10, mx: 2 }}>
                    <Services />
                </Box>
            </MiniDrawer>
        </div>
    );
}
