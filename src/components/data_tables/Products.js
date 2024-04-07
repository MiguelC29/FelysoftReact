import React, { useState, useEffect, useRef } from 'react';
import { DialogDelete, DialogFooter, actionBodyTemplate, confirmDelete, confirmDialog, confirmDialogFooter, deleteData, deleteDialogFooter, exportCSV, exportExcel, exportPdf, formatCurrency, getData, getOneData, header, inputChange, inputNumberChange, leftToolbarTemplate, rightToolbarTemplateExport, sendRequest } from '../../functionsDataTable'
import { classNames } from 'primereact/utils';
import { Toast } from 'primereact/toast';
import { FileUpload } from 'primereact/fileupload';
import { Toolbar } from 'primereact/toolbar';
import { InputNumber } from 'primereact/inputnumber';
import { Dialog } from 'primereact/dialog';
import { InputText } from 'primereact/inputtext';
import { Dropdown } from 'primereact/dropdown';
import CustomDataTable from '../CustomDataTable';
import { Image } from 'primereact/image';

export default function Products() {
    let emptyProduct = {
        idProduct: null,
        image: '',
        typeImg: '',
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
    const [product, setProduct] = useState(emptyProduct);
    const [file, setFile] = useState(null);
    const [selectedImage, setSelectedImage] = useState(null);
    const [submitted, setSubmitted] = useState(false);
    const [confirmDialogVisible, setConfirmDialogVisible] = useState(false);
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

    const handleFileUpload = (event) => {
        const file = event.files[0];
        setFile(file);
        const reader = new FileReader();

        reader.onloadend = () => {
            setSelectedImage(reader.result);
        };

        if (file) {
            reader.readAsDataURL(file);
        }
    };

    const openNew = () => {
        setProduct(emptyProduct);
        setTitle('Registrar Producto');
        setSelectedCategory('');
        setSelectedProvider('');
        setFile('');
        setSelectedImage('');
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
        setFile('');
        setSelectedImage('');
        setTitle('Editar Producto');
        setOperation(2);
        setProductDialog(true);
    };

    const hideDialog = () => {
        setSubmitted(false);
        setProductDialog(false);
    };

    const hideConfirmProductDialog = () => {
        setConfirmDialogVisible(false);
    };

    const hideDeleteProductDialog = () => {
        setDeleteProductDialog(false);
    };

    const saveProduct = () => {
        setSubmitted(true);
        setConfirmDialogVisible(false);

        if (product.name.trim() && product.brand.trim() && product.expiryDate && product.salePrice && product.category && product.provider) {
            let url, method;
            const formData = new FormData();

            if (product.idProduct && operation === 2) {
                formData.append('idProduct', product.idProduct);
                formData.append('name', product.name.trim());
                formData.append('brand', product.brand.trim());
                formData.append('expiryDate', product.expiryDate);
                formData.append('salePrice', product.salePrice);
                formData.append('category', product.category.idCategory);
                formData.append('provider', product.provider.idProvider);
                formData.append('image', file);
                url = URL + 'update/' + product.idProduct;
                method = 'PUT';
            } else {
                if (operation === 1 && product.stock) {
                    // FALTA VER QUE AL ENVIAR LA SOLICITUD PONE ERROR EN LOS CAMPOS DEL FORM, SOLO QUE SE VE POR MILESIMAS DE SEG
                    formData.append('name', product.name.trim());
                    formData.append('brand', product.brand.trim());
                    formData.append('expiryDate', product.expiryDate);
                    formData.append('salePrice', product.salePrice);
                    formData.append('category', product.category.idCategory);
                    formData.append('provider', product.provider.idProvider);
                    formData.append('stockInicial', product.stock);
                    formData.append('image', file);
                    url = URL + 'create';
                    method = 'POST';
                }
            }

            sendRequest(method, formData, url, setProducts, URL, operation, toast, 'Producto ');
            setProductDialog(false);
            setProduct(emptyProduct);
        }
    };

    const confirmSave = () => {
        setConfirmDialogVisible(true);
    };

    const confirmDeleteProduct = (product) => {
        confirmDelete(product, setProduct, setDeleteProductDialog);
    };

    const deleteProduct = () => {
        deleteData(URL, product.idProduct, setProducts, toast, setDeleteProductDialog, setProduct, emptyProduct, 'Producto');
    };

    const onInputChange = (e, name) => {
        inputChange(e, name, product, setProduct);
    };

    const onInputNumberChange = (e, name) => {
        inputNumberChange(e, name, product, setProduct);
    };

    const imageBodyTemplate = (rowData) => {
        const imageData = rowData.image;
        const imageType = rowData.imageType;
        if (imageData) {
            return <Image src={`data:${imageType};base64,${imageData}`} alt={`Imagen producto ${rowData.name}`} className="shadow-2 border-round" width="80" height="80" preview/>;
        } else {
            return <p>No hay imagen</p>;
        }
    };

    const priceBodyTemplate = (rowData) => {
        return formatCurrency(rowData.salePrice);
    };

    const actionBodyTemplateP = (rowData) => {
        return actionBodyTemplate(rowData, editProduct, confirmDeleteProduct);
    };

    const productDialogFooter = (
        DialogFooter(hideDialog, confirmSave)
    );
    const confirmProductDialogFooter = (
        confirmDialogFooter(hideConfirmProductDialog, saveProduct)
    );
    const deleteProductDialogFooter = (
        deleteDialogFooter(hideDeleteProductDialog, deleteProduct)
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

    const columns = [
        { field: 'name', header: 'Nombre', sortable: true, style: { minWidth: '12rem' } },
        { field: 'brand', header: 'Marca', sortable: true, style: { minWidth: '10rem' } },
        { field: 'salePrice', header: 'Precio de Venta', body: priceBodyTemplate, sortable: true, style: { minWidth: '8rem' } },
        { field: 'expiryDate', header: 'Fecha de Vencimiento', sortable: true, style: { minWidth: '8rem' } },
        { field: 'category.name', header: 'Categoria', sortable: true, style: { minWidth: '10rem' } },
        { field: 'provider.name', header: 'Proveedor', sortable: true, style: { minWidth: '10rem' } },
        { field: 'image', header: 'Imagen', body: imageBodyTemplate, exportable: false, style: { minWidth: '8rem' } },
        { body: actionBodyTemplateP, exportable: false, style: { minWidth: '12rem' } },
    ];

    // EXPORT DATA
    const handleExportPdf = () => { exportPdf(columns.slice(0, -2), products, 'Reporte_Productos') };
    const handleExportExcel = () => { exportExcel(products, columns.slice(0, -2), 'Productos') };
    const handleExportCsv = () => { exportCSV(false, dt) };

    return (
        <div>
            <Toast ref={toast} position="bottom-right" />
            <div className="card" style={{ background: '#9bc1de' }}>
                <Toolbar className="mb-4" style={{ background: 'linear-gradient( rgba(221, 217, 217, 0.824), #f3f0f0d2)', border: 'none' }} left={leftToolbarTemplate(openNew)} right={rightToolbarTemplateExport(handleExportCsv, handleExportExcel, handleExportPdf)}></Toolbar>

                <CustomDataTable
                    dt={dt}
                    data={products}
                    dataKey="id"
                    currentPageReportTemplate="Mostrando {first} de {last} de {totalRecords} productos"
                    globalFilter={globalFilter}
                    header={header('Productos', setGlobalFilter)}
                    columns={columns}
                />
            </div>

            <Dialog visible={productDialog} style={{ width: '40rem' }} breakpoints={{ '960px': '75vw', '641px': '90vw' }} header={title} modal className="p-fluid" footer={productDialogFooter} onHide={hideDialog}>
                {product.image && <img src={`data:${product.typeImg};base64,${product.image}`} alt={`Imagen producto ${product.name}`} className="shadow-2 border-round product-image block m-auto pb-3" style={{ width: '120px', height: '120px' }} />}
                <div className="field">
                    <label htmlFor="name" className="font-bold">
                        Nombre
                    </label>
                    <InputText id="name" value={product.name} onChange={(e) => onInputChange(e, 'name')} required autoFocus className={classNames({ 'p-invalid': submitted && !product.name })} maxLength={30} />
                    {submitted && !product.name && <small className="p-error">Nombre es requerido.</small>}
                </div>
                <div className="field">
                    <label htmlFor="brand" className="font-bold">
                        Marca
                    </label>
                    <InputText id="brand" value={product.brand} onChange={(e) => onInputChange(e, 'brand')} required className={classNames({ 'p-invalid': submitted && !product.brand })} maxLength={30} />
                    {submitted && !product.brand && <small className="p-error">Marca es requerida.</small>}
                </div>

                <div className="field">
                    <label htmlFor="expiryDate" className="font-bold">
                        Fecha de Vencimiento
                    </label>
                    <InputText id="expiryDate" value={product.expiryDate} onChange={(e) => onInputChange(e, 'expiryDate')} type="date" required className={classNames({ 'p-invalid': submitted && !product.expiryDate })} />
                    {submitted && !product.expiryDate && <small className="p-error">Fecha de vencimiento es requerida.</small>}
                </div>

                <div className="formgrid grid">
                    <div className="field col">
                        <label htmlFor="salePrice" className="font-bold">
                            Precio de venta
                        </label>
                        <div className="p-inputgroup">
                            <span className="p-inputgroup-addon" style={{ backgroundColor: 'blueviolet', color: 'white' }}>$</span>
                            <InputNumber id="salePrice" value={product.salePrice} onValueChange={(e) => onInputNumberChange(e, 'salePrice')} mode="decimal" currency="COP" locale="es-CO" required className={classNames({ 'p-invalid': submitted && !product.salePrice })} maxLength={9} />
                        </div>
                        {submitted && !product.salePrice && <small className="p-error">Precio de venta es requerido.</small>}
                    </div>
                    {(operation === 1) &&
                        <div className="field col">
                            <label htmlFor="stock" className="font-bold">
                                Stock Inicial
                            </label>
                            <InputNumber id="stock" value={product.stock} onValueChange={(e) => onInputNumberChange(e, 'stock')} required className={classNames({ 'p-invalid': submitted && !product.stock })} maxLength={5} />
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
                            filter valueTemplate={selectedCategoryTemplate} itemTemplate={categoryOptionTemplate} emptyMessage="No hay datos" emptyFilterMessage="No hay resultados encontrados" required className={`w-full md:w-16.5rem ${classNames({ 'p-invalid': submitted && !product.category && !selectedCategory })}`} />

                        {submitted && !product.category && !selectedCategory && <small className="p-error">Categoria es requerida.</small>}
                    </div>
                    <div className="field col">
                        <label htmlFor="provider" className="font-bold">
                            Proveedor
                        </label>
                        <Dropdown id="provider" value={selectedProvider} onChange={(e) => { handleProviderChange(e.target.value); onInputNumberChange(e, 'provider'); }} options={providers} optionLabel="name" placeholder="Seleccionar proveedor"
                            filter valueTemplate={selectedProviderTemplate} itemTemplate={providerOptionTemplate} emptyMessage="No hay datos" emptyFilterMessage="No hay resultados encontrados" required className={`w-full md:w-16.5rem ${classNames({ 'p-invalid': submitted && !product.provider && !selectedProvider })}`} />
                        {submitted && !product.provider && !selectedProvider && <small className="p-error">Proveedor es requerido.</small>}
                    </div>
                </div>
                <div className="formgrid grid">
                    <div className="field col">
                        <label htmlFor="image" className="font-bold">
                            Imagen Producto
                        </label>
                        <FileUpload
                            id='image'
                            mode="basic"
                            name="image"
                            chooseLabel="Seleccionar Imagen"
                            url="http://localhost:8086/api/product/create"
                            accept="image/*"
                            maxFileSize={2000000}
                            onSelect={handleFileUpload}
                        />
                    </div>
                    <div className="field col">
                        {selectedImage && (
                            <img src={selectedImage} alt="Selected" width={'100px'} height={'120px'} className='mt-4 shadow-2 border-round' />
                        )}
                    </div>
                </div>
            </Dialog >

            {DialogDelete(deleteProductDialog, 'Producto', deleteProductDialogFooter, hideDeleteProductDialog, product, product.name, 'el producto')}

            {confirmDialog(confirmDialogVisible, 'Producto', confirmProductDialogFooter, hideConfirmProductDialog, product, operation)}
        </div >
    );
}