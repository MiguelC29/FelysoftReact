import React, { useEffect, useState } from 'react'
import { confirmAction, getData, getOneData, modalDelte, sendRequest, show_alert } from '../functions'

export default function Prod() {

    const URL = 'http://localhost:8086/api/product/';
    const [products, setProducts] = useState([]);
    const [categories, setCategories] = useState([]);
    const [providers, setProviders] = useState([]);
    const [id, setId] = useState('');
    // TODO: REVISAR LO DE LAS IMAGENES, CAMPOS IMG Y TYPE IMG
    const [name, setName] = useState('');
    const [brand, setBrand] = useState('');
    const [salePrice, setSalePrice] = useState(0.0);
    const [expiryDate, setExpiryDate] = useState('');
    const [stock, setStock] = useState(0);
    const [operation, setOperation] = useState(1);
    const [title, setTitle] = useState('');
    const [selectedCategory, setSelectedCategory] = useState('');
    const [selectedProvider, setSelectedProvider] = useState('');

    useEffect(() => {
        getData(URL, setProducts);
        getData('http://localhost:8086/api/category/', setCategories);
        getData('http://localhost:8086/api/provider/', setProviders);
    }, []);

    const handleCategoryChange = (categoryId) => {
        setSelectedCategory(categoryId);
        if (categoryId) {
            getOneData(`${'http://localhost:8086/api/provider/providersByCategory/'}${categoryId}`, setProviders);
        }
    };

    const handleProviderChange = (providerId) => {
        setSelectedProvider(providerId);
        if (providerId) {
            getOneData(`${'http://localhost:8086/api/category/categoriesByProvider/'}${providerId}`, setCategories);
        }
    };

    const openModal = (op, id, name, brand, salePrice, expiryDate, IdCategory, IdProvider) => {
        setId('');
        setName('');
        setBrand('');
        setSalePrice('');
        setExpiryDate('');
        setStock('');
        setSelectedCategory('');
        setSelectedProvider('');
        getData('http://localhost:8086/api/category/', setCategories);
        getData('http://localhost:8086/api/provider/', setProviders);
        setOperation(op);
        switch (op) {
            case 1:
                setTitle('Registrar Producto');
                break;
            case 2:
                setTitle('Editar Producto');
                setId(id);
                setName(name);
                setBrand(brand);
                setSalePrice(salePrice);
                setExpiryDate(expiryDate);
                setSelectedCategory(IdCategory);
                setSelectedProvider(IdProvider);
                break;
            default:
                break;
        }
        window.setTimeout(() => { document.getElementById('nombre').focus(); }, 500);
    }

    const validate = () => {
        let parameters;
        let method;
        let url;
    
        const categoryId = document.getElementById('selectCategory').value;
        const providerId = document.getElementById('selectProvider').value;
    
        if (name.trim() === '') {
            show_alert('Escribe el nombre del producto', 'warning');
        } else if (brand.trim() === '') {
            show_alert('Escribe la marca del producto', 'warning');
        } else if (salePrice === '') {
            show_alert('Escribe el precio de venta del producto', 'warning');
        } else if (expiryDate.trim() === '') {
            show_alert('Escribe el la fecha de vencimiento del producto', 'warning');
        } else if (stock.trim() === '' && operation === 1) {
            show_alert('Escribe el stock inicial del producto', 'warning');
        } else if (categoryId === '') {
            show_alert('Seleccione una categoría para el producto', 'warning');
        } else if (providerId === '') {
            show_alert('Seleccione un proveedor para el producto', 'warning');
        } else {
            confirmAction(operation, () => {
                if (operation === 1) {
                    parameters = {
                        name: name.trim(), brand: brand.trim(), salePrice: salePrice, expiryDate: expiryDate.trim(),
                        category: categoryId, provider: providerId, stockInicial: stock.trim()
                    };
                    url = URL + 'create';
                    method = 'POST';
                } else {
                    parameters = {
                        idProduct: id, name: name.trim(), brand: brand.trim(), salePrice: salePrice, expiryDate: expiryDate.trim(),
                        category: categoryId, provider: providerId
                    };
                    url = URL + 'update/' + id;
                    method = 'PUT';
                }
    
                sendRequest(method, parameters, url, setProducts, URL);
            });
        }
    };

    const deleteProduct = (id, name) => {
        modalDelte('el producto', name, setId, id, setProducts, URL);
    }

    return (
        <div className="App">
            <div className="container-fluid">
                <div className="row mt-3">
                    <div className="col-md-4 offset-md-4">
                        <div className="d-grid mx-auto">
                            <button onClick={() => openModal(1)} className='btn btn-dark' data-bs-toggle='modal' data-bs-target='#modalProducts'>
                                <i className='fa-solid fa-circle-plus'></i> Añadir
                            </button>
                        </div>
                    </div>
                </div>
                <div className="row mt-3">
                    <div className="col-12 col-lg-8 offset-0 offset-lg-2">
                        <div className="table-responsive">
                            <table className='table table-bordered'>
                                <thead>
                                    <tr>
                                        <th>#</th>
                                        {/* <th>IMAGEN</th> */}
                                        <th>PRODUCTO</th>
                                        <th>MARCA</th>
                                        <th>PRECIO DE VENTA</th>
                                        <th>FECHA DE VENCIMIENTO</th>
                                        <th>CATEGORIA</th>
                                        <th>PROVEEDOR</th>
                                        <th>ACCIONES</th>
                                    </tr>
                                </thead>
                                <tbody className='table-group-divider'>
                                    {products.map((product, i) => (
                                        <tr key={product.idProduct}>
                                            <td>{(i + 1)}</td>
                                            {/* <td><img width = "100px" height = "100px" src="data:<?php echo $producto->tipoImg?>;base64,<?php echo base64_encode($producto->imagen)?>"></td> */}
                                            {/* <td><img width = "100px" height = "100px" src={`data:${product.typeImg};base64,${btoa(product.image)}`} alt={`Imagen del producto ${product.name}`} /></td> */}
                                            <td>{product.name}</td>
                                            <td>{product.brand}</td>
                                            <td>{product.salePrice}</td>
                                            <td>{product.expiryDate}</td>
                                            <td>{product.category.name}</td>
                                            <td>{product.provider.name}</td>
                                            <td>
                                                <button onClick={() => openModal(2, product.idProduct, product.name, product.brand, product.salePrice, product.expiryDate, product.category.idCategory, product.provider.idProvider)} className='btn btn-warning' data-bs-toggle='modal' data-bs-target='#modalProducts'>
                                                    <i className='fa-solid fa-edit'></i>
                                                </button>
                                                &nbsp;
                                                <button onClick={() => deleteProduct(product.idProduct, product.name)} className='btn btn-danger'>
                                                    <i className='fa-solid fa-trash'></i>
                                                </button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </div>
            <div id='modalProducts' className="modal fade" aria-hidden='true'>
                <div className="modal-dialog">
                    <div className="modal-content">
                        <div className="modal-header">
                            <label className="h5">{title}</label>
                            <button type='button' id='btnCerrar' className="btn-close" data-bs-dismiss='modal' aria-label='Close'></button>
                        </div>
                        <div className="modal-body">
                            <input type="hidden" id="id" />
                            <div className="input-group mb-3">
                                <span className="input-group-text"><i className="fa-solid fa-gift"></i></span>
                                <input type="text" id='nombre' className='form-control' placeholder='Nombre' value={name} onChange={(e) => setName(e.target.value)} required />
                            </div>
                            <div className="input-group mb-3">
                                <span className="input-group-text"><i className="fa-solid fa-gift"></i></span>
                                <input type="text" id='marca' className='form-control' placeholder='Marca' value={brand} onChange={(e) => setBrand(e.target.value)} required />
                            </div>
                            <div className="input-group mb-3">
                                <span className="input-group-text"><i className="fa-solid fa-gift"></i></span>
                                <input type="number" id='precio_venta' className='form-control' placeholder='Precio de venta' value={salePrice} onChange={(e) => setSalePrice(e.target.value)} required />
                            </div>
                            <div className="input-group mb-3">
                                <span className="input-group-text"><i className="fa-solid fa-gift"></i></span>
                                <input type="date" id='fecha_vencimiento' className='form-control' placeholder='Fecha de Vencimiento' value={expiryDate} onChange={(e) => setExpiryDate(e.target.value)} required />
                            </div>
                            {operation === 1 &&
                                <div className="input-group mb-3">
                                    <span className="input-group-text"><i className="fa-solid fa-gift"></i></span>
                                    <input type="number" id='stock_inicial' className='form-control' placeholder='Stock Inicial' value={stock} onChange={(e) => setStock(e.target.value)} required />
                                </div>}
                            <div className="input-group mb-3">
                                <span className="input-group-text"><i className="fa-solid fa-gift"></i></span>
                                <select className='form-select' aria-label='Seleccionar la categoría' id='selectCategory' name="idCategoria" value={selectedCategory} onChange={(e) => handleCategoryChange(e.target.value)} required>
                                    <option value="" disabled>Seleccione la categoria</option>
                                    {categories.map((category) => (
                                        <option key={category.idCategory} value={category.idCategory}>{category.name}</option>
                                    ))}
                                </select>
                            </div>
                            <div className="input-group mb-3">
                                <span className="input-group-text"><i className="fa-solid fa-gift"></i></span>
                                <select className='form-select' aria-label='Seleccionar el proveedor' id='selectProvider' name="idProveedor" value={selectedProvider} onChange={(e) => handleProviderChange(e.target.value)} required>
                                    <option value="" disabled>Seleccione el proveedor</option>
                                    {providers.map((provider) => (
                                        <option key={provider.idProvider} value={provider.idProvider}>{provider.name}</option>
                                    ))}
                                </select>

                            </div>
                            <div className="input-group mb-3">
                                {/* <label for="imagenP">Imagen: <sup>*</sup></label> */}
                                <span className="input-group-text"><i className="fa-solid fa-gift"></i></span>
                                <input className='form-control' type="file" name="imagenP" id="formFile" required />
                                {/* <img width="200px" height="200px" src="data:<?php echo $datos['tipoImgP'] ?>;base64,<?php echo base64_encode($datos['imagenP']) ?>"> */}
                            </div>
                            <div onClick={() => validate()} className="d-grid col-6 mx-auto">
                                <button className='btn btn-success'>
                                    {/* <button className='btn btn-success' onClick={confirmAction()}> */}
                                    <i className='fa-solid fa-floppy-disk'></i> Guardar
                                </button>
                            </div>
                        </div>
                        <div className="modal-footer"></div>
                    </div>
                </div>
            </div>
        </div>
    )
}