import React from 'react'
import { Sidebar } from '../components/Sidebar'
import Employees from '../components/data_tables/Employees'


export default function ViewEmployees() {
    return (
        <div>
            <div>
                <Sidebar />
                <div className='containerTable'>
                    <Employees />
                </div>
            </div>
        </div>
    )
}
