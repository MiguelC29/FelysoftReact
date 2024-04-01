import React from 'react'
import { Sidebar } from '../components/Sidebar'
import Details from '../components/data_tables/Details';

export default function ViewDetails() {
  return (
    <div>
            <div>
                <Sidebar />
                <div className='containerTable'>
                    <Details />
                </div>
            </div>
        </div>
  )
}