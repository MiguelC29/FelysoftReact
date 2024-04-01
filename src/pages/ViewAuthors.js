import React from 'react'
import { Sidebar } from '../components/Sidebar'
import Authors from '../components/data_tables/Authors'

export default function ViewAuthors() {
    return (
        <div>
            <div>
                <Sidebar />
                <div className='containerTable'>
                    <Authors />
                </div>
            </div>
        </div>
    )
}
