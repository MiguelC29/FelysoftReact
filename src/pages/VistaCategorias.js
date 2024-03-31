import React, { useState } from 'react';
import { Sidebar } from '../components/Sidebar';
import Categories from './Categories';

export default function VistaCategorias() {
    const [sidebarExpanded, setSidebarExpanded] = useState(true);

    const toggleSidebarSize = () => {
        setSidebarExpanded(!sidebarExpanded);
    };

    return (
        <div>
            <div>
                <Sidebar expanded={sidebarExpanded} toggleSidebarSize={toggleSidebarSize} />
                <div className='containerTable'>
                    <Categories />
                </div>
            </div>
        </div>
    );
}