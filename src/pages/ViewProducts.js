import React from 'react'
import { Sidebar } from '../components/Sidebar'
import Products from '../components/data_tables/Products'

export default function ViewProducts() {
    return (
        <div>
            <div>
                <Sidebar />
                <div className='containerTable'>
                    <Products />
                </div>
            </div>
        </div>
    )
}
