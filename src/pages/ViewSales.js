import React from 'react'
import { Sidebar } from '../components/Sidebar'
import Sales from '../components/data_tables/Sales';

export default function ViewSales() {
  return (
    <div>
            <div>
                <Sidebar />
                <div className='containerTable'>
                    <Sales />
                </div>
            </div>
        </div>
  )
}
