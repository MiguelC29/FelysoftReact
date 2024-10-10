import React from 'react'
import ProductInventory from '../components/data_tables/ProductInventory'
import { Box } from '@mui/material';
import MiniDrawer from '../components/common/Sidebar';

export default function ViewProductInventory() {
    return (
        <div>
            <MiniDrawer>
                <Box sx={{
                    width: '100%',
                    maxWidth: '1200px', // Limitar el ancho máximo si es necesario
                    marginTop: { xs: 8, sm: 9, md: 9, lg: 10 },
                    padding: { xs: 2 }, // Añadir padding en pantallas pequeñas
                }}>
                    <ProductInventory />
                </Box>
            </MiniDrawer>
        </div>
    );
};