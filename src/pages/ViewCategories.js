import React from 'react';
import { Sidebar } from '../components/Sidebar';
import Categories from '../components/data_tables/Categories';

export default function ViewCategories() {

    return (
        <div>
            <div>
                <Sidebar />
                <div className='containerTable'>
                    <Categories />
                </div>
            </div>
        </div>
    );
}