import React from 'react'
import { Sidebar } from '../components/Sidebar'
import Services from '../components/data_tables/Services'


export default function ViewServices() {
    return (
        <div>
            <div>
                <Sidebar />
                <div className='containerTable'>
                    <Services />
                </div>
            </div>
        </div>
    )
}
