import React, { useState, useEffect, useRef } from 'react';
import { DialogDelete, DialogFooter, actionBodyTemplate, confirmDelete, confirmDialog, confirmDialogFooter, deleteDialogFooter, exportCSV, exportExcel, exportPdf, formatCurrency, header, inputChange, inputNumberChange, leftToolbarTemplate, rightToolbarTemplateExport } from '../../functionsDataTable';
import { classNames } from 'primereact/utils';
import { Toast } from 'primereact/toast';
import { FileUpload } from 'primereact/fileupload';
import { Toolbar } from 'primereact/toolbar';
import { Dialog } from 'primereact/dialog';
import { InputText } from 'primereact/inputtext';
import CustomDataTable from '../CustomDataTable';
import { Image } from 'primereact/image';
import { FloatDropdownSearchIcon, FloatInputNumberIcon, FloatInputNumberMoneyIcon, FloatInputTextIcon } from '../Inputs';
import Request_Service from '../service/Request_Service';

export default function Products() {
    let emptyProduct = {
        idProduct: null,
        image: '',
        typeImg: '',
        name: '',
        brand: '',
        salePrice: null,
        expiryDate: '',
        stock: null,
        category: '',
        provider: ''
    };

    const URL = '/product/';
    const [product, setProduct] = useState(emptyProduct);
    const [file, setFile] = useState(null);
    const [products, setProducts] = useState([]);
    const [categories, setCategories] = useState([]);
    const [providers, setProviders] = useState([]);
    const [selectedCategory, setSelectedCategory] = useState(null);
    const [selectedProvider, setSelectedProvider] = useState(null);
    const [selectedImage, setSelectedImage] = useState(null);
    const [productDialog, setProductDialog] = useState(false);
    const [confirmDialogVisible, setConfirmDialogVisible] = useState(false);
    const [deleteProductDialog, setDeleteProductDialog] = useState(false);
    const [submitted, setSubmitted] = useState(false);
    const [globalFilter, setGlobalFilter] = useState(null);
    const [operation, setOperation] = useState();
    const [title, setTitle] = useState('');
    const toast = useRef(null);
    const dt = useRef(null);

    useEffect(() => {
        Request_Service.getData(URL.concat('all'), setProducts);
        getCategories();
        getProviders();
    }, []);

    const getCategories = () => {
        return Request_Service.getData('/category/all', setCategories);
    }

    const getProviders = () => {
        return Request_Service.getData('/provider/all', setProviders);
    }

    const handleCategoryChange = (categoryId) => {
        setSelectedCategory(categoryId);
        if (categoryId) {
            Request_Service.getData(`/provider/providersByCategory/${categoryId.idCategory}`, setProviders);
        }
        if (selectedCategory) {
            setSelectedProvider('');
            product.provider = '';
        }
    };

    const handleProviderChange = (providerId) => {
        setSelectedProvider(providerId);
        if (providerId) {
            Request_Service.getData(`/category/categoriesByProvider/${providerId.idProvider}`, setCategories);
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
        getCategories();
        getProviders();
        setOperation(1);
        setSubmitted(false);
        setProductDialog(true);
    };

    const editProduct = (product) => {
        setProduct({ ...product });
        getCategories();
        getProviders();
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

    const saveProduct = async () => {
        setSubmitted(true);
        setConfirmDialogVisible(false);
    
        // Verificar si todos los campos requeridos están presentes
        const isValid = product.name.trim() && 
                        product.brand.trim() &&
                        product.expiryDate &&
                        product.salePrice &&
                        product.category &&
                        product.provider &&
                        (operation === 1 ? file : true);
    
        // Mostrar mensaje de error si algún campo requerido falta
        if (!isValid) {
            toast.current.show({ severity: 'error', summary: 'Error', detail: 'Por favor complete todos los campos requeridos', life: 3000 });
            return;
        }
    
        let url, method;
        const formData = new FormData();
    
        if (product.idProduct && operation === 2) {
            // Asegurarse de que los campos no estén vacíos al editar
            formData.append('idProduct', product.idProduct);
            formData.append('name', product.name.trim());
            formData.append('brand', product.brand.trim());
            formData.append('expiryDate', product.expiryDate);
            formData.append('salePrice', product.salePrice);
            formData.append('category', product.category.idCategory);
            formData.append('provider', product.provider.idProvider);
            if (file) {
                formData.append('image', file);
            }
            url = URL + 'update/' + product.idProduct;
            method = 'PUT';
        } else {
            // Verificar que el stock inicial está presente solo al crear
            if (operation === 1 && product.stock) {
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
    
        if (isValid) {
            await Request_Service.sendRequest(method, formData, url, operation, toast, 'Producto ', URL.concat('all'), setProducts);
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
        Request_Service.deleteData(URL, product.idProduct, setProducts, toast, setDeleteProductDialog, setProduct, emptyProduct, 'Producto ', URL.concat('all'));
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
            return <Image src={`data:${imageType};base64,${imageData}`} alt={`Imagen del producto ${rowData.name}`} className="shadow-2 border-round" width="80" height="80" preview />;
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
        { field: 'category.name', header: 'Categoría', sortable: true, style: { minWidth: '10rem' } },
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
                    currentPageReportTemplate="Mostrando {first} de {last} de {totalRecords} Productos"
                    globalFilter={globalFilter}
                    header={header('Productos', setGlobalFilter)}
                    columns={columns}
                />
            </div>

            <Dialog visible={productDialog} style={{ width: '40rem' }} breakpoints={{ '960px': '75vw', '641px': '90vw' }} header={title} modal className="p-fluid" footer={productDialogFooter} onHide={hideDialog}>
                {operation === 2 && product.image && <img src={`data:${product.typeImg};base64,${product.image}`} alt={`Imagen producto ${product.name}`} className="shadow-2 border-round product-image block m-auto pb-3" style={{ width: '120px', height: '120px' }} />}
                <FloatInputTextIcon
                    className="field mt-4"
                    icon='inventory_2'
                    value={product.name}
                    onInputChange={onInputChange} field='name'
                    maxLength={30} required autoFocus
                    submitted={submitted}
                    label='Nombre'
                    errorMessage='Nombre es requerido.'
                />
                <FloatInputTextIcon
                    className="field mt-5"
                    icon='shoppingmode'
                    value={product.brand}
                    onInputChange={onInputChange} field='brand'
                    maxLength={30} required
                    submitted={submitted}
                    label='Marca'
                    errorMessage='Marca es requerida.'
                />
                <div className="field mt-3">
                    <label htmlFor="expiryDate" className="font-bold">Fecha de Vencimiento</label>
                    <InputText id="expiryDate" value={product.expiryDate} onChange={(e) => onInputChange(e, 'expiryDate')} type="date" required className={classNames({ 'p-invalid': submitted && !product.expiryDate })} />
                    {submitted && !product.expiryDate && <small className="p-error">Fecha de vencimiento es requerida.</small>}
                </div>
                <div className="formgrid grid mt-5">
                    <FloatInputNumberMoneyIcon
                        className="field col"
                        value={product.salePrice}
                        onInputNumberChange={onInputNumberChange} field='salePrice'
                        maxLength={9} required
                        submitted={submitted}
                        label='Precio de venta'
                        errorMessage='Precio de venta es requerido.'
                    />
                    {(operation === 1) &&
                        <FloatInputNumberIcon
                            className="field col"
                            icon='inventory'
                            value={product.stock}
                            onInputNumberChange={onInputNumberChange} field='stock'
                            maxLength={5} required
                            submitted={submitted}
                            label='Stock Inicial'
                            errorMessage='Stock inicial es requerido.'
                        />
                    }
                </div>
                <div className="formgrid grid mt-3">
                    <FloatDropdownSearchIcon
                        className="field col"
                        icon='stacks' field='category' required
                        value={selectedCategory}
                        handleChange={handleCategoryChange}
                        onInputNumberChange={onInputNumberChange}
                        options={categories} optionLabel="name"
                        placeholder="Seleccionar categoría"
                        valueTemplate={selectedCategoryTemplate}
                        itemTemplate={categoryOptionTemplate}
                        submitted={submitted} fieldForeign={product.category}
                        label="Categoría" errorMessage="Categoría es requerida."
                    />
                    <FloatDropdownSearchIcon
                        className="field col"
                        icon='local_shipping' field='provider' required
                        value={selectedProvider}
                        handleChange={handleProviderChange}
                        onInputNumberChange={onInputNumberChange}
                        options={providers} optionLabel="name"
                        placeholder="Seleccionar proveedor"
                        valueTemplate={selectedProviderTemplate}
                        itemTemplate={providerOptionTemplate}
                        submitted={submitted} fieldForeign={product.provider}
                        label="Proveedor" errorMessage="Proveedor es requerido."
                    />
                </div>
                <div className="formgrid grid">
                    <div className="field col">
                        <label htmlFor="image" className="font-bold">Imagen Producto</label>
                        <FileUpload
                            id='image'
                            mode="basic"
                            name="image"
                            chooseLabel="Seleccionar Imagen"
                            url="http://localhost:8086/api/product/create"
                            accept="image/*"
                            maxFileSize={2000000}
                            onSelect={handleFileUpload}
                            required
                            className={`${classNames({ 'p-invalid': submitted && !product.image && !selectedImage })}`}
                        />
                        {submitted && !product.image && !selectedImage && <small className="p-error">Imagen es requerida.</small>}
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
};
