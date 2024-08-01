import React from 'react'
import MiniDrawer from '../components/common/Sidebar';
import { Box } from '@mui/material';
import ProfilePage from '../components/userspage/ProfilePage';

export default function ViewProfile() {
    return (
        <div>
            <MiniDrawer>
                <Box sx={{ marginTop: 10, mx: 2 }}>
                    <ProfilePage />
                </Box>
            </MiniDrawer>
        </div>
    );
}
