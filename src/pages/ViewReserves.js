import React from 'react'
import { Sidebar } from '../components/Sidebar'
import Reserves from '../components/data_tables/Reserves';

export default function ViewReserves() {
    return (
        <div>
            <div>
                <Sidebar />
                <div className='containerTable'>
                    <Reserves />
                </div>
            </div>
        </div>
    )
}
