import React from 'react';
import Categories from '../components/data_tables/Categories';
import { Box } from '@mui/material';
import MiniDrawer from '../components/common/Sidebar';

export default function ViewCategories() {
    return (
        <div>
            <MiniDrawer>
                <Box sx={{
                    width: '100%',
                    maxWidth: '1200px', // Limitar el ancho máximo si es necesario
                    marginTop: { xs: 8, sm: 9, md: 9, lg: 10 },
                    padding: { xs: 2 }, // Añadir padding en pantallas pequeñas
                }}>
                    <Categories />
                </Box>
            </MiniDrawer>
        </div>
    );
};