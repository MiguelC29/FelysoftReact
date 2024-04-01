import React from 'react'
import { Sidebar } from '../components/Sidebar'
import Purchases from '../components/data_tables/Purchases';

export default function ViewPurchases() {
  return (
    <div>
            <div>
                <Sidebar />
                <div className='containerTable'>
                    <Purchases />
                </div>
            </div>
        </div>
  )
}