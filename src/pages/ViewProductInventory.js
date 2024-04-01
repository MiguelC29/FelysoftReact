import React from 'react'
import { Sidebar } from '../components/Sidebar'
import ProductInventory from '../components/data_tables/ProductInventory'

export default function ViewProductInventory() {
    return (
        <div>
            <div>
                <Sidebar />
                <div className='containerTable'>
                    <ProductInventory />
                </div>
            </div>
        </div>
    )
}