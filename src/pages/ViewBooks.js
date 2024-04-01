import React from 'react'
import { Sidebar } from '../components/Sidebar'
import Books from '../components/data_tables/Books';

export default function ViewBooks() {
    return (
        <div>
            <div>
                <Sidebar />
                <div className='containerTable'>
                    <Books/>
                </div>
            </div>
        </div>
    )
}