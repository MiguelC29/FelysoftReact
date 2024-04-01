import React from 'react'
import { Sidebar } from '../components/Sidebar'
import Users from '../components/data_tables/Users'

export default function ViewUsers() {
    return (
        <div>
            <div>
                <Sidebar />
                <div className='containerTable'>
                    <Users />
                </div>
            </div>
        </div>
    )
}