import React from 'react'
import { Sidebar } from '../components/Sidebar'
import Genres from '../components/data_tables/Genres';

export default function ViewGenres() {
    return (
        <div>
            <div>
                <Sidebar />
                <div className='containerTable'>
                    <Genres />
                </div>
            </div>
        </div>
    )
}
