import axios from 'axios';
import React, { useEffect, useState } from 'react'
import DataTable from '../components/DataTable';

export default function Employee() {
    const [employees, setEmployees] = useState([]);
    const headers = [
        "ID_EMPLEADO",
        "ESPECIALIDAD",
        "FECHA DE NACIMIENTO",
        "SALARIO",
        "CARGO",
        "NOMBRE"
    ];

    useEffect(() => {
        loadData();
    }, []);

    const loadData = () => {
        axios.get("http://localhost:8086/api/employee/all")
            .then((response) => {
                setEmployees(response.data.data)
            })
            .catch((e) => {
                console.log(e);
            })
    }
    return (
        <div>
            <h1>Employee</h1>
            <DataTable headers={headers} data={employees} campo={"names"}/>
        </div>
    )
}