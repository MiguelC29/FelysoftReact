import React, { useState, useEffect, useRef } from 'react';
import { DialogDelete, DialogFooter, InputChange, actionBodyTemplate, confirmDelete, deleteData, deleteDialogFooter, getData, getOneData, header, inputChange, inputNumberChange, leftToolbarTemplate, rightToolbarTemplate, sendRequest } from '../functions2'
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

    // quizas se puede poner en el archivo functions
    const hideDialog = () => {
        setSubmitted(false);
        setProductDialog(false);
    };

    const hideDeleteProductDialog = () => {
        setDeleteProductDialog(false);
    };

    //

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

            sendRequest(method, parameters, url, setProducts, URL, operation, toast);
            setProductDialog(false);
            setProduct(emptyProduct);
        }
    };

    const confirmDeleteProduct = (product) => {
        confirmDelete(product, setProduct, setDeleteProductDialog);
    };

    const deleteProduct = () => {
        deleteData(URL, product.idProduct, setProducts, toast, setDeleteProductDialog, setProduct, emptyProduct);
    };

    const exportCSV = () => (
        dt.current.exportCSV()
    );

    const confirmDeleteSelected = () => {
        setDeleteProductsDialog(true);
    };

    // TODO: ORGANIZAR EL CONTROLADOR PARA PODER ELIMINAR MAS DE UNO
    const deleteSelectedProducts = () => {
        let _products = products.filter((val) => !selectedProducts.includes(val));

        setProducts(_products);
        setDeleteProductsDialog(false);
        setSelectedProducts(null);
        toast.current.show({ severity: 'success', summary: 'Exitoso', detail: 'Productos Eliminados', life: 3000 });
    };

    const onInputChange = (e, name) => {
        inputChange(e, name, product, setProduct);
    };

    const onInputNumberChange = (e, name) => {
        inputNumberChange(e, name, product, setProduct);
    };

    // const imageBodyTemplate = (rowData) => {
    //     return <img src={`https://primefaces.org/cdn/primereact/images/product/${rowData.image}`} alt={rowData.image} className="shadow-2 border-round" style={{ width: '64px' }} />;
    // };

    const priceBodyTemplate = (rowData) => {
        return formatCurrency(rowData.salePrice);
    };

    const actionBodyTemplateP = (rowData) => {
        return actionBodyTemplate(rowData, editProduct, confirmDeleteProduct);
    };

    const productDialogFooter = (
        DialogFooter(hideDialog, saveProduct)
    );
    const deleteProductDialogFooter = (
        deleteDialogFooter(hideDeleteProductDialog, deleteProduct)
    );
    const deleteProductsDialogFooter = ( // si lo usamos tambien se puede reducir
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
                <Toolbar className="mb-4" left={leftToolbarTemplate(openNew, confirmDeleteSelected, selectedProducts)} right={rightToolbarTemplate(exportCSV)}></Toolbar>

                <DataTable ref={dt} value={products} selection={selectedProducts} onSelectionChange={(e) => setSelectedProducts(e.value)}
                    dataKey="id" paginator rows={10} rowsPerPageOptions={[5, 10, 25]}
                    paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
                    currentPageReportTemplate="Mostrando {first} de {last} de {totalRecords} productos" globalFilter={globalFilter} header={header('Productos', setGlobalFilter)}>
                    <Column selectionMode="multiple" exportable={false}></Column>
                    <Column field="name" header="Nombre" sortable style={{ minWidth: '12rem' }}></Column>
                    <Column field="brand" header="Marca" sortable style={{ minWidth: '16rem' }}></Column>
                    {/* <Column field="image" header="Image" body={imageBodyTemplate}></Column> */}
                    <Column field="salePrice" header="Precio de Venta" body={priceBodyTemplate} sortable style={{ minWidth: '8rem' }}></Column>
                    <Column field="expiryDate" header="Fecha de Vencimiento" sortable style={{ minWidth: '10rem' }}></Column>
                    <Column field="category.name" header="Categoria" sortable style={{ minWidth: '10rem' }}></Column>
                    <Column field="provider.name" header="Proveedor" sortable style={{ minWidth: '10rem' }}></Column>
                    {/* <Column field="inventoryStatus" header="Status" body={statusBodyTemplate} sortable style={{ minWidth: '12rem' }}></Column> */}
                    <Column body={actionBodyTemplateP} exportable={false} style={{ minWidth: '12rem' }}></Column>
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

            {DialogDelete(deleteProductDialog, 'Producto', deleteProductDialogFooter, hideDeleteProductDialog, product, product.name, 'el producto')}

            {/* si lo usamos tambien se puede reducir */}
            <Dialog visible={deleteProductsDialog} style={{ width: '32rem' }} breakpoints={{ '960px': '75vw', '641px': '90vw' }} header="Eliminar Productos" modal footer={deleteProductsDialogFooter} onHide={hideDeleteProductsDialog}>
                <div className="confirmation-content">
                    <i className="pi pi-exclamation-triangle mr-3" style={{ fontSize: '2rem' }} />
                    {product && <span>¿Está seguro de eliminar el producto seleccionado?</span>}
                </div>
            </Dialog>
        </div>
    );
}