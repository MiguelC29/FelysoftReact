import React from 'react'
import { Sidebar } from '../components/Sidebar'
import TypeServices from '../components/data_tables/Typeservices'


export default function ViewTypeservices() {
    return (
        <div>
            <div>
                <Sidebar />
                <div className='containerTable'>
                    <TypeServices />
                </div>
            </div>
        </div>
    )
}
