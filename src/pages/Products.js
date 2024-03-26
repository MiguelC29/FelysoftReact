import React, { useState, useEffect, useRef } from 'react';
import { confirmAction, getData, getOneData, sendRequest, show_alert } from '../functions'
import { classNames } from 'primereact/utils';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Toast } from 'primereact/toast';
import { Button } from 'primereact/button';
// import { FileUpload } from 'primereact/fileupload';
import { Toolbar } from 'primereact/toolbar';
import { InputNumber } from 'primereact/inputnumber';
import { Dialog } from 'primereact/dialog';
import { InputText } from 'primereact/inputtext';
import { Dropdown } from 'primereact/dropdown';
// import { Calendar } from 'primereact/calendar';
import { InputMask } from 'primereact/inputmask'
import axios from 'axios'

export default function Products() {
    let emptyProduct = {
        idProduct: null,
        image: null,
        typeImg: null,
        name: '',
        brand: '',
        salePrice: 0,
        expiryDate: '',
        stockInicial: 0,
        category: '',
        provider: ''
    };

    const URL = 'http://localhost:8086/api/product/';
    const [products, setProducts] = useState([]);
    const [categories, setCategories] = useState([]);
    const [selectedCategory, setSelectedCategory] = useState(null);
    const [providers, setProviders] = useState([]);
    const [selectedProvider, setSelectedProvider] = useState(null);
    const [productDialog, setProductDialog] = useState(false);
    const [deleteProductDialog, setDeleteProductDialog] = useState(false);
    const [deleteProductsDialog, setDeleteProductsDialog] = useState(false);
    const [product, setProduct] = useState(emptyProduct);
    const [selectedProducts, setSelectedProducts] = useState(null);
    const [submitted, setSubmitted] = useState(false);
    const [globalFilter, setGlobalFilter] = useState(null);
    const [operation, setOperation] = useState();
    const [title, setTitle] = useState('');
    const toast = useRef(null);
    const dt = useRef(null);

    useEffect(() => {
        getData(URL, setProducts);
        getData('http://localhost:8086/api/category/', setCategories);
        getData('http://localhost:8086/api/provider/', setProviders);
    }, []);

    const handleCategoryChange = (categoryId) => {
        setSelectedCategory(categoryId);
        if (categoryId) {
            getOneData(`${'http://localhost:8086/api/provider/providersByCategory/'}${categoryId.idCategory}`, setProviders);
        }
        if (selectedCategory) {
            setSelectedProvider('');
            product.provider = '';
        }
    };

    const handleProviderChange = (providerId) => {
        setSelectedProvider(providerId);
        if (providerId) {
            getOneData(`${'http://localhost:8086/api/category/categoriesByProvider/'}${providerId.idProvider}`, setCategories);
        }
        if (selectedProvider) {
            setSelectedCategory('');
            product.category = '';
        }
    };

    const formatCurrency = (value) => {
        return value.toLocaleString('es-CO', { style: 'currency', currency: 'COP' });
    };

    const openNew = () => {
        setProduct(emptyProduct);
        setTitle('Registrar Producto');
        setSelectedCategory('');
        setSelectedProvider('');
        getData('http://localhost:8086/api/category/', setCategories);
        getData('http://localhost:8086/api/provider/', setProviders);
        setOperation(1);
        setSubmitted(false);
        setProductDialog(true);
    };

    const editProduct = (product) => {
        setProduct({ ...product });
        getData('http://localhost:8086/api/category/', setCategories);
        getData('http://localhost:8086/api/provider/', setProviders);
        setSelectedCategory(product.category);
        setSelectedProvider(product.provider);
        setTitle('Editar Producto');
        setOperation(2);
        setProductDialog(true);
    };

    const hideDialog = () => {
        setSubmitted(false);
        setProductDialog(false);
    };

    const hideDeleteProductDialog = () => {
        setDeleteProductDialog(false);
    };

    const hideDeleteProductsDialog = () => {
        setDeleteProductsDialog(false);
    };

    const saveProduct = () => {
        setSubmitted(true);

        if (product.name.trim() && product.brand.trim() && product.expiryDate && product.salePrice && product.category && product.provider) {
            let url, method, parameters;

            if (product.idProduct && operation === 2) {
                parameters = {
                    idProduct: product.idProduct, name: product.name.trim(), brand: product.brand.trim(), salePrice: product.salePrice, expiryDate: product.expiryDate.trim(), category: product.category.idCategory, provider: product.provider.idProvider
                };
                url = URL + 'update/' + product.idProduct;
                method = 'PUT';
            } else {
                if (operation === 1 && product.stock) {
                    // FALTA VER QUE AL ENVIAR LA SOLICITUD PONE ERROR EN LOS CAMPOS DEL FORM, SOLO QUE SE VE POR MILESEMIMAS DE SEG
                    parameters = {
                        name: product.name.trim(), brand: product.brand.trim(), salePrice: product.salePrice, expiryDate: product.expiryDate.trim(), category: product.category.idCategory, provider: product.provider.idProvider, stockInicial: product.stock
                    };
                    url = URL + 'create';
                    method = 'POST';
                }
            }

            // sendRequest(method, parameters, url, setProducts, URL);
            // PUEDO USAR EL SENDREQUEST PERO ME TOCARIA MODIFICARLO Y AGREGARLE EL TOAST
            axios({ method: method, url: url, data: parameters })
            .then((response) => {
                let type = response.data['status'];
                let msg = response.data['data'];
                // show_alert(msg, type);
                if (type === 'success') {
                    // document.getElementById('btnCerrar').click();
                    // toast.current.show({ severity: 'success', summary: 'Exitoso', detail: 'Producto Creado', life: 3000 });
                    toast.current.show({ severity: 'success', summary: msg, detail: 'Producto ' + (operation === 1 ? 'Creado' : 'Actualizado'), life: 3000 });
                    getData(URL, setProducts);
                }
            })
            .catch((error) => {
                // show_alert('Error en la solicitud', 'error');
                toast.current.show({ severity: 'error', summary: 'Error en la solicitud', detail: 'Producto NO ' + (operation === 1 ? 'Creado' : 'Actualizado'), life: 3000 });
                console.log(error);
            });
            setProductDialog(false);
            setProduct(emptyProduct);
        }
    };

    const confirmDeleteProduct = (product) => {
        setProduct(product);
        setDeleteProductDialog(true);
    };

    const deleteProduct = () => {
        const durl = URL + 'delete/' + product.idProduct;
        // sendRequest('PUT', { id: id }, durl, setTable, url);
        axios({ method: 'PUT', url: durl, data: { id: product.idProduct } })
        .then((response) => {
            let type = response.data['status'];
            let msg = response.data['data'];
            // show_alert(msg, type);
            if (type === 'success') {
                toast.current.show({ severity: 'success', summary: msg, detail: 'Producto Eliminado', life: 3000 });
                getData(URL, setProducts);
            }
        })
        .catch((error) => {
            toast.current.show({ severity: 'error', summary: 'Error en la solicitud', detail: 'Producto NO Eliminado', life: 3000 });
            console.log(error);
        });

        setDeleteProductDialog(false);
        setProduct(emptyProduct);
    };

    const exportCSV = () => {
        dt.current.exportCSV();
    };

    const confirmDeleteSelected = () => {
        setDeleteProductsDialog(true);
    };

    const deleteSelectedProducts = () => {
        // TODO: ORGANIZAR EL CONTROLADOR PARA PODER ELIMINAR MAS DE UNO
        let _products = products.filter((val) => !selectedProducts.includes(val));

        setProducts(_products);
        setDeleteProductsDialog(false);
        setSelectedProducts(null);
        toast.current.show({ severity: 'success', summary: 'Exitoso', detail: 'Productos Eliminados', life: 3000 });
    };

    const onInputChange = (e, name) => {
        const val = (e.target && e.target.value) || '';
        let _product = { ...product };

        _product[`${name}`] = val;

        setProduct(_product);
    };

    const onInputNumberChange = (e, name) => {
        const val = e.value || 0;
        let _product = { ...product };

        _product[`${name}`] = val;

        setProduct(_product);
    };

    const leftToolbarTemplate = () => {
        return (
            <div className="flex flex-wrap gap-2">
                <Button label="Nuevo" icon="pi pi-plus" severity="success" onClick={openNew} />
                <Button label="Borrar" icon="pi pi-trash" severity="danger" onClick={confirmDeleteSelected} disabled={!selectedProducts || !selectedProducts.length} />
            </div>
        );
    };

    const rightToolbarTemplate = () => {
        return <Button label="Exportar" icon="pi pi-upload" className="p-button-help" onClick={exportCSV} />;
    };

    // const imageBodyTemplate = (rowData) => {
    //     return <img src={`https://primefaces.org/cdn/primereact/images/product/${rowData.image}`} alt={rowData.image} className="shadow-2 border-round" style={{ width: '64px' }} />;
    // };

    const priceBodyTemplate = (rowData) => {
        return formatCurrency(rowData.salePrice);
    };

    const actionBodyTemplate = (rowData) => {
        return (
            <React.Fragment>
                <Button icon="pi pi-pencil" rounded className="mr-2" onClick={() => editProduct(rowData)} />
                <Button icon="pi pi-trash" rounded severity="danger" onClick={() => confirmDeleteProduct(rowData)} />
            </React.Fragment>
        );
    };

    const header = (
        <div className="flex flex-wrap gap-2 align-items-center justify-content-between">
            <h4 className="m-0">Lista de Productos</h4>
            <span className="p-input-icon-left">
                <i className="pi pi-search" />
                <InputText type="search" onInput={(e) => setGlobalFilter(e.target.value)} placeholder="Buscar..." />
            </span>
        </div>
    );
    const productDialogFooter = (
        <React.Fragment>
            <Button label="Cancelar" icon="pi pi-times" outlined onClick={hideDialog} />
            <Button label="Guardar" icon="pi pi-check" onClick={saveProduct} />
        </React.Fragment>
    );
    const deleteProductDialogFooter = (
        <React.Fragment>
            <Button label="No" icon="pi pi-times" outlined onClick={hideDeleteProductDialog} />
            <Button label="Si" icon="pi pi-check" severity="danger" onClick={deleteProduct} />
        </React.Fragment>
    );
    const deleteProductsDialogFooter = (
        <React.Fragment>
            <Button label="No" icon="pi pi-times" outlined onClick={hideDeleteProductsDialog} />
            <Button label="Si" icon="pi pi-check" severity="danger" onClick={deleteSelectedProducts} />
        </React.Fragment>
    );

    const selectedCategoryTemplate = (option, props) => {
        if (option) {
            return (
                <div className="flex align-items-center">
                    <div>{option.name}</div>
                </div>
            );
        }

        return <span>{props.placeholder}</span>;
    };

    const categoryOptionTemplate = (option) => {
        return (
            <div className="flex align-items-center">
                <div>{option.name}</div>
            </div>
        );
    };

    const selectedProviderTemplate = (option, props) => {
        if (option) {
            return (
                <div className="flex align-items-center">
                    <div>{option.name}</div>
                </div>
            );
        }

        return <span>{props.placeholder}</span>;
    };

    const providerOptionTemplate = (option) => {
        return (
            <div className="flex align-items-center">
                <div>{option.name}</div>
            </div>
        );
    };

    return (
        <div>
            <Toast ref={toast} />
            <div className="card">
                <Toolbar className="mb-4" left={leftToolbarTemplate} right={rightToolbarTemplate}></Toolbar>

                <DataTable ref={dt} value={products} selection={selectedProducts} onSelectionChange={(e) => setSelectedProducts(e.value)}
                    dataKey="id" paginator rows={10} rowsPerPageOptions={[5, 10, 25]}
                    paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
                    currentPageReportTemplate="Mostrando {first} de {last} de {totalRecords} productos" globalFilter={globalFilter} header={header}>
                    <Column selectionMode="multiple" exportable={false}></Column>
                    <Column field="name" header="Nombre" sortable style={{ minWidth: '12rem' }}></Column>
                    <Column field="brand" header="Marca" sortable style={{ minWidth: '16rem' }}></Column>
                    {/* <Column field="image" header="Image" body={imageBodyTemplate}></Column> */}
                    <Column field="salePrice" header="Precio de Venta" body={priceBodyTemplate} sortable style={{ minWidth: '8rem' }}></Column>
                    <Column field="expiryDate" header="Fecha de Vencimiento" sortable style={{ minWidth: '10rem' }}></Column>
                    <Column field="category.name" header="Categoria" sortable style={{ minWidth: '10rem' }}></Column>
                    <Column field="provider.name" header="Proveedor" sortable style={{ minWidth: '10rem' }}></Column>
                    {/* <Column field="inventoryStatus" header="Status" body={statusBodyTemplate} sortable style={{ minWidth: '12rem' }}></Column> */}
                    <Column body={actionBodyTemplate} exportable={false} style={{ minWidth: '12rem' }}></Column>
                </DataTable>
            </div>

            <Dialog visible={productDialog} style={{ width: '40rem' }} breakpoints={{ '960px': '75vw', '641px': '90vw' }} header={title} modal className="p-fluid" footer={productDialogFooter} onHide={hideDialog}>
                {/* {product.image && <img src={`https://primefaces.org/cdn/primereact/images/product/${product.image}`} alt={product.image} className="product-image block m-auto pb-3" />} */}
                <div className="field">
                    <label htmlFor="name" className="font-bold">
                        Nombre
                    </label>
                    <InputText id="name" value={product.name} onChange={(e) => onInputChange(e, 'name')} required autoFocus className={classNames({ 'p-invalid': submitted && !product.name })} />
                    {submitted && !product.name && <small className="p-error">Nombre es requerido.</small>}
                </div>
                <div className="field">
                    <label htmlFor="brand" className="font-bold">
                        Marca
                    </label>
                    <InputText id="brand" value={product.brand} onChange={(e) => onInputChange(e, 'brand')} required className={classNames({ 'p-invalid': submitted && !product.brand })} />
                    {submitted && !product.brand && <small className="p-error">Marca es requerida.</small>}
                </div>

                <div className="field">
                    <label htmlFor="expiryDate" className="font-bold">
                        Fecha de Vencimiento
                    </label>
                    <InputMask id="expiryDate" value={product.expiryDate} onChange={(e) => onInputChange(e, 'expiryDate')} mask="9999-99-99" placeholder="9999-99-99" slotChar="yyyy-mm-dd" required className={classNames({ 'p-invalid': submitted && !product.expiryDate })} />
                    {/* <Calendar id="expiryDate" value={product.expiryDate} onChange={(e) => onInputChange(e, 'expiryDate')} required className={classNames({ 'p-invalid': submitted && !product.expiryDate })} showButtonBar placeholder="mm/dd/yyyy" showIcon/> */}
                    {submitted && !product.expiryDate && <small className="p-error">Fecha de vencimiento es requerida.</small>}
                </div>

                <div className="formgrid grid">
                    <div className="field col">
                        <label htmlFor="salePrice" className="font-bold">
                            Precio de venta
                        </label>
                        <div className="p-inputgroup">
                            <span className="p-inputgroup-addon" style={{ backgroundColor: 'blueviolet', color: 'white' }}>$</span>
                            <InputNumber id="salePrice" value={product.salePrice} onValueChange={(e) => onInputNumberChange(e, 'salePrice')} mode="decimal" currency="COP" locale="es-CO" required className={classNames({ 'p-invalid': submitted && !product.salePrice })} />
                        </div>
                        {submitted && !product.salePrice && <small className="p-error">Precio de venta es requerido.</small>}
                    </div>
                    {(operation === 1) &&
                        <div className="field col">
                            <label htmlFor="stock" className="font-bold">
                                Stock Inicial
                            </label>
                            <InputNumber id="stock" value={product.stock} onValueChange={(e) => onInputNumberChange(e, 'stock')} required className={classNames({ 'p-invalid': submitted && !product.stock })} />
                            {submitted && !product.stock && <small className="p-error">Stock inicial es requerido.</small>}
                        </div>
                    }
                </div>

                <div className="formgrid grid">
                    <div className="field col">
                        <label htmlFor="category" className="font-bold">
                            Categoria
                        </label>
                        <Dropdown id="category" value={selectedCategory} onChange={(e) => { handleCategoryChange(e.target.value); onInputNumberChange(e, 'category'); }} options={categories} optionLabel="name" placeholder="Seleccionar categoria"
                            filter valueTemplate={selectedCategoryTemplate} itemTemplate={categoryOptionTemplate} required className={`w-full md:w-16.5rem ${classNames({ 'p-invalid': submitted && !product.category && !selectedCategory })}`} />

                        {submitted && !product.category && !selectedCategory && <small className="p-error">Categoria es requerida.</small>}
                    </div>
                    <div className="field col">
                        <label htmlFor="provider" className="font-bold">
                            Proveedor
                        </label>
                        <Dropdown id="provider" value={selectedProvider} onChange={(e) => { handleProviderChange(e.target.value); onInputNumberChange(e, 'provider'); }} options={providers} optionLabel="name" placeholder="Seleccionar proveedor"
                            filter valueTemplate={selectedProviderTemplate} itemTemplate={providerOptionTemplate} required className={`w-full md:w-16.5rem ${classNames({ 'p-invalid': submitted && !product.provider && !selectedProvider })}`} />
                        {submitted && !product.provider && !selectedProvider && <small className="p-error">Proveedor es requerido.</small>}
                    </div>
                </div>
            </Dialog>

            <Dialog visible={deleteProductDialog} style={{ width: '32rem' }} breakpoints={{ '960px': '75vw', '641px': '90vw' }} header="Eliminar Producto" modal footer={deleteProductDialogFooter} onHide={hideDeleteProductDialog}>
                <div className="confirmation-content">
                    <i className="pi pi-exclamation-triangle mr-3" style={{ fontSize: '2rem' }} />
                    {product && (
                        <span>
                            ¿Está seguro de eliminar el producto <b>{product.name}</b>?
                        </span>
                    )}
                </div>
            </Dialog>

            <Dialog visible={deleteProductsDialog} style={{ width: '32rem' }} breakpoints={{ '960px': '75vw', '641px': '90vw' }} header="Eliminar Productos" modal footer={deleteProductsDialogFooter} onHide={hideDeleteProductsDialog}>
                <div className="confirmation-content">
                    <i className="pi pi-exclamation-triangle mr-3" style={{ fontSize: '2rem' }} />
                    {product && <span>¿Está seguro de eliminar el producto seleccionado?</span>}
                </div>
            </Dialog>
        </div>
    );
}