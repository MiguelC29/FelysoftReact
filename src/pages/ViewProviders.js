import React from 'react'
import { Sidebar } from '../components/Sidebar'
import Providers from '../components/data_tables/Providers'

export default function ViewProviders() {
    return (
        <div>
            <div>
                <Sidebar />
                <div className='containerTable'>
                    <Providers />
                </div>
            </div>
        </div>
    )
}