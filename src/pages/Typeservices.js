import axios from 'axios';
import React, { useEffect, useState } from 'react'
import DataTable from '../components/DataTable';

export default function Typeservices() {

  const [typeservices, setTypeservices] = useState([]);
  const headers = ["ID_TIPOSERVICIO", "NOMBRE", "DESCRIPCIÓN", "PRECIO"];

  useEffect(() => {
    loadData();
  }, []);

  const loadData = () => {
    axios.get("http://localhost:8086/api/typeservice/all")
      .then((response) => {
        setTypeservices(response.data.data)
      })
      .catch((e) => {
        console.log(e);
    })
  }

  return (
    <div>
      <h1>Tipo de Servicios</h1>
      <DataTable headers={headers} data={typeservices}/>
    </div>
  )
}