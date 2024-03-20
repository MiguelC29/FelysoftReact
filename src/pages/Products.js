import axios from 'axios';
import React, { useEffect, useState } from 'react'
import DataTable from '../components/DataTable';

export default function Products() {
    const [products, setProducts] = useState([]);
    const headers = [
        "ID_PRODUCTO",
        "IMAGE",
        "NOMBRE",
        "MARCA",
        "PRECIO DE VENTA",
        "FECHA DE VENCIMIENTO",
        "CATEGORIA",
        "PROVEEDOR"
    ];

    // CAMPOS A MOSTRAR que deseas mostrar en tu DataTable
    const visibleHeaders = [
        "idProduct",
        "image",
        "name",
        "brand",
        "salePrice",
        "expiryDate",
        "category",
        "provider"
    ];

    useEffect(() => {
        loadData();
    }, []);

    const loadData = () => {
        axios.get("http://localhost:8086/api/product/all")
            .then((response) => {
                setProducts(response.data.data)
            })
            .catch((e) => {
                console.log(e);
            })
    }

    // Filtrar los datos para incluir solo los campos visibles
    const filteredData = products.map(row => {
        const filteredRow = {};
        visibleHeaders.forEach(header => {
            filteredRow[header] = row[header];
        });
        return filteredRow;
    });

    return (
        <div>
            <h1>Products</h1>
            <DataTable headers={headers} data={filteredData} campo={"name"}/>
        </div>
    )
}