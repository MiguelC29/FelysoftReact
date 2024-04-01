import React from 'react'
import { Sidebar } from '../components/Sidebar'
import Roles from '../components/data_tables/Roles'

export default function ViewRoles() {
    return (
        <div>
            <div>
                <Sidebar />
                <div className='containerTable'>
                    <Roles />
                </div>
            </div>
        </div>
    )
}