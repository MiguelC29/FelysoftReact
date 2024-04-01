import React from 'react'
import { Sidebar } from '../components/Sidebar'
import Charges from '../components/data_tables/Charges'


export default function ViewCharges() {
    return (
        <div>
            <div>
                <Sidebar />
                <div className='containerTable'>
                    <Charges />
                </div>
            </div>
        </div>
    )
}
