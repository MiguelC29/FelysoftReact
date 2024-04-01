import React from 'react'
import { Sidebar } from '../components/Sidebar'
import Expenses from '../components/data_tables/Expenses';

export default function ViewExpenses() {
  return (
    <div>
            <div>
                <Sidebar />
                <div className='containerTable'>
                    <Expenses />
                </div>
            </div>
        </div>
  )
}