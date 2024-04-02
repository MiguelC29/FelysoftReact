import React from 'react'
import MiniDrawer from '../components/Sidebar'
import { Box } from '@mui/material'
import BookInventory from '../components/data_tables/BookInventory'

export default function ViewBooksInventory() {
    return (
        <div>
            <MiniDrawer>
                <Box sx={{ marginTop: 10, mx: 2 }}>
                    <BookInventory />
                </Box>
            </MiniDrawer>
        </div>
    )
}
