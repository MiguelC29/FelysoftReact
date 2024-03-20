import axios from 'axios';
import React, { useEffect, useState } from 'react'
import DataTable from '../components/DataTable';

export default function Roles() {
    const [roles, setRoles] = useState([]);
    const headers = [
        "ID_ROL",
        "ROL"
    ];

    useEffect(() => {
        loadData();
    }, []);

    const loadData = () => {
        axios.get("http://localhost:8086/api/role/all")
            .then((response) => {
                setRoles(response.data.data)
            })
            .catch((e) => {
                console.log(e);
            })
    }
    return (
        <div>
            <h1>Roles</h1>
            <DataTable headers={headers} data={roles}/>
        </div>
    )
}