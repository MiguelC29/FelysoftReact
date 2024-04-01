import React from 'react'
import { Sidebar } from '../components/Sidebar'
import Payments from '../components/data_tables/Payments';

export default function ViewPayments() {
  return (
    <div>
            <div>
                <Sidebar />
                <div className='containerTable'>
                    <Payments />
                </div>
            </div>
        </div>
  )
}