import React, { useState, useEffect, useRef, useCallback } from 'react';
import { DialogDelete, DialogFooter, actionBodyTemplate, confirmDelete, confirmDialog, confirmDialogFooter, deleteDialogFooter, exportCSV, exportExcel, exportPdf, header, inputChange, inputNumberChange, leftToolbarTemplate, rightToolbarTemplateExport } from '../../functionsDataTable';
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
import { Checkbox } from 'primereact/checkbox';

export default function Products() {
    let emptyProduct = {
        idProduct: null,
        image: '',
        typeImg: '',
        name: '',
        salePrice: null,
        expiryDate: '',
        stock: null,
        brand: '',
        category: '',
        provider: '',
        isNew: true // Agregar el campo para controlar si el producto es nuevo

    };

    const URL = '/product/';
    const [product, setProduct] = useState(emptyProduct);
    const [products, setProducts] = useState([]);
    const [file, setFile] = useState(null);
    const [categories, setCategories] = useState([]);
    const [providers, setProviders] = useState([]);
    const [brands, setBrands] = useState([]);
    const [selectedCategory, setSelectedCategory] = useState(null);
    const [selectedProvider, setSelectedProvider] = useState(null);
    const [selectedBrand, setSelectedBrand] = useState(null);
    const [selectedImage, setSelectedImage] = useState(null);
    const [imageError, setImageError] = useState('');
    const [productDialog, setProductDialog] = useState(false);
    const [confirmDialogVisible, setConfirmDialogVisible] = useState(false);
    const [deleteProductDialog, setDeleteProductDialog] = useState(false);
    const [submitted, setSubmitted] = useState(false);
    const [globalFilter, setGlobalFilter] = useState(null);
    const [operation, setOperation] = useState();
    const [onlyDisabled, setOnlyDisabled] = useState(false); // Estado para el botón
    const [title, setTitle] = useState('');
    const toast = useRef(null);
    const dt = useRef(null);

    const fetchProducts = useCallback(async () => {
        try {
            const url = onlyDisabled ? `${URL}disabled` : `${URL}all`;
            await Request_Service.getData(url, setProducts);
        } catch (error) {
            console.error("Fallo al recuperar productos:", error);
        }
    }, [onlyDisabled, URL]);

    useEffect(() => {
        fetchProducts();
    }, [onlyDisabled, fetchProducts]);

    const getCategories = () => {
        return Request_Service.getData('/category/all', setCategories);
    }

    const getProviders = () => {
        return Request_Service.getData('/provider/all', setProviders);
    }

    const getBrands = () => {
        return Request_Service.getData('/brand/all', setBrands);
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
        if (file) {
            // Validar el tipo de archivo
            const validImageTypes = ['image/jpeg', 'image/png', 'image/jpg', 'image/webp'];
            if (!validImageTypes.includes(file.type)) {
                setImageError('El archivo seleccionado no es una imagen válida. Solo se permiten imágenes JPEG, JPG, PNG, WEBP.');
                setSelectedImage(null); // Limpiar la vista previa
                return;
            }
            setImageError(''); // Limpiar mensaje de error si la imagen es válida

            const reader = new FileReader();
            reader.onloadend = () => {
                setSelectedImage(reader.result);
            };
            reader.readAsDataURL(file);
        }
    };

    const openNew = () => {
        setProduct(emptyProduct);
        setTitle('Registrar Producto');
        setSelectedCategory('');
        setSelectedProvider('');
        setSelectedBrand('');
        setFile('');
        setSelectedImage('');
        getCategories();
        getProviders();
        getBrands();
        setOperation(1);
        setSubmitted(false);
        setProductDialog(true);
    };

    const editProduct = (product) => {
        setProduct({ ...product });
        getCategories();
        getProviders();
        getBrands();
        setSelectedCategory(product.category);
        setSelectedProvider(product.provider);
        setSelectedBrand(product.brand);
        setFile('');
        setSelectedImage('');
        setTitle('Editar Producto');
        setOperation(2);
        setProductDialog(true);
    };

    const toggleDisabled = () => {
        setOnlyDisabled(!onlyDisabled);
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
            product.expiryDate &&
            product.brand &&
            product.category &&
            product.provider &&
            (operation === 1 ? file : true) &&
            // Si el producto NO es nuevo, el precio de venta y el stock son obligatorios
            (!product.isNew ? product.salePrice && product.stock : true);


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
            formData.append('expiryDate', product.expiryDate);
            formData.append('salePrice', product.salePrice);
            formData.append('brand', product.brand.idBrand);
            formData.append('category', product.category.idCategory);
            formData.append('provider', product.provider.idProvider);
            if (file) {
                formData.append('image', file);
            }
            url = URL + 'update/' + product.idProduct;
            method = 'PUT';
        } else {
            // Verificar que el stock inicial está presente solo al crear
            if (operation === 1) {
                formData.append('name', product.name.trim());
                formData.append('expiryDate', product.expiryDate);
                formData.append('salePrice', (!product.isNew && product.salePrice) ? product.salePrice : 0);
                formData.append('brand', product.brand.idBrand);
                formData.append('category', product.category.idCategory);
                formData.append('provider', product.provider.idProvider);
                if (!product.isNew && product.stock) {
                    formData.append('stockInicial', product.stock); // Solo agregar stock si no es un producto nuevo
                }
                formData.append('image', file);
                url = URL + 'create';
                method = 'POST';
            }
        }

        if (isValid) {
            await Request_Service.sendRequest(method, formData, url, operation, toast, 'Producto ', URL.concat('all'), setProducts);
            setProductDialog(false);
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

    const handleEnable = (product) => {
        Request_Service.sendRequestEnable(URL, product.idProduct, setProducts, toast, 'Producto ');
    };

    const onInputChange = (e, name) => {
        inputChange(e, name, product, setProduct);
    };

    const onInputNumberChange = (e, name) => {
        inputNumberChange(e, name, product, setProduct);
    };

    const onCheckboxChange = (e) => {
        setProduct({ ...product, isNew: e.checked });
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

    const actionBodyTemplateP = (rowData) => {
        return actionBodyTemplate(rowData, editProduct, confirmDeleteProduct, onlyDisabled, handleEnable);
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

    const selectedBrandTemplate = (option, props) => {
        if (option) {
            return (
                <div className="flex align-items-center">
                    <div>{option.name}</div>
                </div>
            );
        }
        return <span>{props.placeholder}</span>;
    };

    const brandOptionTemplate = (option) => {
        return (
            <div className="flex align-items-center">
                <div>{option.name}</div>
            </div>
        );
    };

    const columns = [
        { field: 'name', header: 'Nombre', sortable: true, style: { minWidth: '12rem' } },
        { field: 'brand.name', header: 'Marca', sortable: true, style: { minWidth: '10rem' } },
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
                <Toolbar className="mb-4" style={{ background: 'linear-gradient( rgba(221, 217, 217, 0.824), #f3f0f0d2)', border: 'none' }} left={leftToolbarTemplate(openNew, onlyDisabled, toggleDisabled)} right={rightToolbarTemplateExport(handleExportCsv, handleExportExcel, handleExportPdf)}></Toolbar>

                <CustomDataTable
                    dt={dt}
                    data={products}
                    dataKey="idProduct"
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

                <FloatDropdownSearchIcon
                    className="field mt-5"
                    icon='shoppingmode' field='brand' required
                    value={selectedBrand}
                    onInputNumberChange={onInputNumberChange}
                    options={brands} optionLabel="name"
                    setSelected={setSelectedBrand}
                    placeholder="Seleccionar marca"
                    valueTemplate={selectedBrandTemplate}
                    itemTemplate={brandOptionTemplate}
                    submitted={submitted} fieldForeign={product.brand}
                    label="Marca" errorMessage="Marca es requerida."
                />

                <div className="field mt-4">
                    <label htmlFor="expiryDate" className="font-bold">Fecha de Vencimiento</label>
                    <InputText id="expiryDate" value={product.expiryDate} onChange={(e) => onInputChange(e, 'expiryDate')} type="date" required className={classNames({ 'p-invalid': submitted && !product.expiryDate })} />
                    {submitted && !product.expiryDate && <small className="p-error">Fecha de vencimiento es requerida.</small>}
                </div>


                <div className="formgrid grid mt-5">
                    {/* Solo mostrar el campo de precio de venta si el producto no es nuevo */}
                    {!product.isNew && (
                        <FloatInputNumberMoneyIcon
                            className="field col"
                            value={product.salePrice}
                            onInputNumberChange={onInputNumberChange} field='salePrice'
                            maxLength={9} required
                            submitted={submitted}
                            label='Precio de venta'
                            errorMessage='Precio de venta es requerido.'
                        />
                    )}
                    {/* Contenedor para el checkbox y el campo de stock */}
                    {(operation === 1) && (
                        <div className="field col">
                            {/* Mostrar el campo de stock solo si el checkbox está desmarcado */}
                            {!product.isNew && (
                                <FloatInputNumberIcon
                                    className="field"
                                    icon='inventory'
                                    value={product.stock}
                                    onInputNumberChange={onInputNumberChange}
                                    field='stock'
                                    maxLength={5}
                                    required
                                    submitted={submitted}
                                    label='Stock Actual'
                                    errorMessage='Stock actual es requerido.'
                                />
                            )}
                            <div className="field-checkbox">
                                <Checkbox
                                    inputId="isNew"
                                    checked={product.isNew}
                                    onChange={onCheckboxChange}
                                />
                                <label htmlFor="isNew">¿Es un producto realmente nuevo?</label>
                            </div>
                        </div>
                    )}
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
                            url="https://felysoftspring-production.up.railway.app/api/product/create"
                            accept=".png,.jpg,.jpeg,.webp"
                            maxFileSize={3145728}
                            onSelect={handleFileUpload}
                            required
                            className={`${classNames({ 'p-invalid': submitted && !product.image && !selectedImage })}`}
                        />
                        {(!imageError) && <small>Solo se permiten imágenes JPEG, JPG, PNG, WEBP.</small>}
                        {imageError && <small className="p-error">{imageError}</small>}
                        {/*TODO: desplegar modal con información detallada de los productos*/}
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
