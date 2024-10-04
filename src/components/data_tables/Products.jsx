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
import Barcode from 'react-barcode';

export default function Products() {
    const [barcode, setBarcode] = useState('');

    let emptyProduct = {
        idProduct: null,
        barcode: barcode,
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
    const [categories, setCategories] = useState([]);
    const [providers, setProviders] = useState([]);
    const [brands, setBrands] = useState([]);
    const [selectedCategory, setSelectedCategory] = useState(null);
    const [selectedProvider, setSelectedProvider] = useState(null);
    const [selectedBrand, setSelectedBrand] = useState(null);
    const [barcodeDialogVisible, setBarcodeDialogVisible] = useState(false);
    const [barcodeValid, setBarcodeValid] = useState(true);
    const [productDialog, setProductDialog] = useState(false);
    const [confirmDialogVisible, setConfirmDialogVisible] = useState(false);
    const [deleteProductDialog, setDeleteProductDialog] = useState(false);
    const [submitted, setSubmitted] = useState(false);
    const [globalFilter, setGlobalFilter] = useState(null);
    const [operation, setOperation] = useState();
    const [onlyDisabled, setOnlyDisabled] = useState(false); // Estado para el botón
    const [expiryDateError, setExpiryDateError] = useState(''); // Estado para el error de la fecha
    const [title, setTitle] = useState('');
    const [file, setFile] = useState(null);
    const [selectedImage, setSelectedImage] = useState(null);
    const [imageError, setImageError] = useState('');
    const [imageSuccess, setImageSuccess] = useState(''); // Mensaje de éxito
    const [uploadKey, setUploadKey] = useState(0); // Para forzar el refresco del componente FileUpload
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

        if (file) {
            // Validar el tipo de archivo
            const validImageTypes = ['image/jpeg', 'image/png', 'image/jpg', 'image/webp'];
            if (!validImageTypes.includes(file.type)) {
                setImageError('El archivo seleccionado no es una imagen válida. Solo se permiten imágenes JPEG, JPG, PNG, WEBP.');
                setSelectedImage(null);
                setImageSuccess(''); // Limpiar el mensaje de éxito
                return;
            }

            setImageError(''); // Limpiar el mensaje de error si la imagen es válida
            setImageSuccess('Imagen seleccionada correctamente'); // Mostrar mensaje de éxito

            const reader = new FileReader();
            reader.onloadend = () => {
                setSelectedImage(reader.result);
                setFile(file); // Guardar el archivo solo después de obtener la vista previa
            };
            reader.readAsDataURL(file);
        }
    };

    const calculateEAN13Checksum = (barcode) => {
        if (barcode.length !== 12) {
            return null;  // Necesitamos exactamente 12 dígitos para calcular el dígito de control
        }

        const digits = barcode.split('').map(Number);
        let sum = 0;

        // Sumar los dígitos pares multiplicados por 3 y los impares normalmente
        digits.forEach((digit, index) => {
            sum += (index % 2 === 0) ? digit : digit * 3;
        });

        // El dígito de control es el número que hace que la suma sea un múltiplo de 10
        const checksum = (10 - (sum % 10)) % 10;
        return checksum;
    };

    // Maneja el cambio de valor del código de barras y realiza validaciones
    const handleBarcodeChange = (e) => {
        const newBarcode = e.target.value.replace(/[^0-9]/g, '');  // Solo permite números
        // Verificar si la longitud es correcta (por ejemplo, 13 caracteres)
        setBarcodeValid(validateBarcode(e.target.value)); // Valida el código de barras
        setBarcode(newBarcode);
    };

    // Función para validar el código de barras (debe tener exactamente 13 dígitos)
    const validateBarcode = (barcode) => {
        const barcodeStr = barcode ? barcode.toString() : '';

        // Verificamos si tiene exactamente 13 dígitos
        if (barcodeStr.length !== 13) return false;

        // Obtenemos los primeros 12 dígitos y calculamos el dígito de control
        const baseBarcode = barcodeStr.slice(0, 12);
        const providedChecksum = parseInt(barcodeStr[12], 10);
        const calculatedChecksum = calculateEAN13Checksum(baseBarcode);

        // Comparamos el dígito de control proporcionado con el calculado
        return providedChecksum === calculatedChecksum;
    };

    // Forzar reinicio al hacer clic en "Seleccionar Imagen"
    const resetUploadOnClick = () => {
        setFile(null);
        setSelectedImage(null);
        setImageError('');
        setImageSuccess(''); // Limpiar el mensaje de éxito al reiniciar
        setUploadKey(prevKey => prevKey + 1); // Forzar la recreación del FileUpload
    };

    const handleAddProduct = () => {
        setBarcodeDialogVisible(true); // Mostrar el modal para ingresar el código de barras
        setBarcode('');
        setSubmitted(false);
    };

    const openNew = () => {
        setProduct(emptyProduct);
        setTitle('Registrar Producto');
        setSelectedCategory('');
        setSelectedProvider('');
        setSelectedBrand('');
        setFile('');
        setImageSuccess('');
        setImageError('');
        setSelectedImage('');
        getCategories();
        getProviders();
        getBrands();
        setOperation(1);
        setSubmitted(false);
        setProductDialog(true);
        setExpiryDateError('');
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
        setImageSuccess('');
        setImageError('');
        setSelectedImage('');
        setImageError('');
        setBarcodeValid(true);
        setTitle('Editar Producto');
        setOperation(2);
        setProductDialog(true);
        setExpiryDateError('');
    };

    const toggleDisabled = () => {
        setOnlyDisabled(!onlyDisabled);
    };

    const hideDialog = () => {
        setSubmitted(false);
        setProductDialog(false);
        setBarcodeDialogVisible(false);
    };

    const hideConfirmProductDialog = () => {
        setConfirmDialogVisible(false);
    };

    const hideDeleteProductDialog = () => {
        setDeleteProductDialog(false);
    };

    const handleBarcodeSubmit = async () => {
        setSubmitted(true);
        if (!barcode || !validateBarcode(barcode)) {
            return;
        }

        setBarcodeDialogVisible(false); // Cierra el modal de código de barras

        await Request_Service.getProductByCode(barcode, toast, openNew);
    };

    const saveProduct = async () => {
        setSubmitted(true);
        setConfirmDialogVisible(false);

        // Verificar si todos los campos requeridos están presentes
        const isValid =
            product.barcode.trim() &&
            product.name.trim() &&
            product.expiryDate &&
            product.brand &&
            product.category &&
            product.provider &&
            // Si la operación es de registro (1), el archivo es obligatorio
            (operation === 1 ? file : true) &&
            // Si el producto NO es nuevo y la operación es 1 (registro), entonces el stock y el precio de venta son obligatorios
            (operation === 1 && !product.isNew ? (product.stock && product.salePrice) : true);

        // Mostrar mensaje de error si algún campo requerido falta
        if (!isValid) {
            toast.current.show({ severity: 'error', summary: 'Error', detail: 'Por favor complete todos los campos requeridos', life: 3000 });
            return;
        }

        if(!validateBarcode(product.barcode.trim())) {
            return;
        }

        if (imageError) {
            return;
        }

        let url, method;
        const formData = new FormData();

        if (product.idProduct && operation === 2) {
            // Asegurarse de que los campos no estén vacíos al editar
            formData.append('idProduct', product.idProduct);
            formData.append('barcode', product.barcode.trim());
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
                formData.append('barcode', product.barcode.trim());
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

    const barcodeBodyTemplate = (rowData) => {
        return <Barcode value={rowData.barcode} format='EAN13' width={1.2} height={30} />
    }

    const productBarcodeDialogFooter = (
        DialogFooter(hideDialog, handleBarcodeSubmit)
    );

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

    // Función para obtener la fecha actual + 7 días en formato 'YYYY-MM-DD'
    const getMinExpiryDate = () => {
        const today = new Date();
        today.setDate(today.getDate() + 7); // Sumar 7 días
        return today.toISOString().split('T')[0]; // Convertir a 'YYYY-MM-DD'
    };

    const handleDateValidation = (e) => {
        const inputDate = e.target.value; // Obtener la fecha ingresada
        const minDate = getMinExpiryDate(); // Obtener la fecha mínima (hoy + 7 días)

        // Validar si la fecha ingresada es válida
        if (inputDate && inputDate < minDate) {
            // Si la fecha es anterior a la mínima, mostrar error o resetear
            setExpiryDateError('La fecha debe ser al menos una semana después de hoy.'); // Establecer el error
            onInputChange({ target: { value: '' } }, 'expiryDate'); // Resetear el campo si la fecha no es válida
        } else {
            setExpiryDateError(''); // Limpiar el error si la fecha es válida
        }
    };

    const columns = [
        { field: 'barcode', header: 'Código', body: barcodeBodyTemplate, sortable: true, style: { minWidth: '12rem' } },
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
                <Toolbar className="mb-4" style={{ background: 'linear-gradient( rgba(221, 217, 217, 0.824), #f3f0f0d2)', border: 'none' }} left={leftToolbarTemplate(handleAddProduct, onlyDisabled, toggleDisabled)} right={rightToolbarTemplateExport(handleExportCsv, handleExportExcel, handleExportPdf)}></Toolbar>

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

            <Dialog visible={barcodeDialogVisible} footer={productBarcodeDialogFooter} onHide={hideDialog} header="Ingresar Código de Barras" modal>
                <FloatInputTextIcon
                    className="field mt-4"
                    icon='barcode_scanner'
                    value={barcode}
                    onInputChange={(e) => setBarcode(e.target.value)} field='barcode'
                    handle={handleBarcodeChange}
                    maxLength={13} required autoFocus
                    submitted={submitted}
                    label='Código de barras'
                    errorMessage='Código de barras es requerido.'
                    valid={barcodeValid}
                    validMessage='El código de barras no es válido. Debe tener 13 dígitos y un dígito de control correcto.'
                />
                {/* Mostrar el código de barras solo si hay un valor en barcode */}
                {barcode && barcodeValid && (
                    <div className="mt-4">
                        <Barcode value={barcode} format='EAN13' />
                    </div>
                )}
            </Dialog>


            <Dialog visible={productDialog} style={{ width: '40rem' }} breakpoints={{ '960px': '75vw', '641px': '90vw' }} header={title} modal className="p-fluid" footer={productDialogFooter} onHide={hideDialog}>
                {operation === 2 && product.image && <img src={`data:${product.typeImg};base64,${product.image}`} alt={`Imagen producto ${product.name}`} className="shadow-2 border-round product-image block m-auto pb-3" style={{ width: '120px', height: '120px' }} />}

                <FloatInputTextIcon
                    className="field mt-4"
                    icon='barcode_scanner'
                    value={product.barcode}
                    onInputChange={onInputChange} field='barcode'
                    handle={handleBarcodeChange}
                    maxLength={13} required autoFocus
                    submitted={submitted}
                    label='Código de barras'
                    errorMessage='Código de barras es requerido.'
                    valid={barcodeValid}
                    validMessage='El código de barras no es válido. Debe tener 13 dígitos y un dígito de control correcto.'
                    disabled={(operation === 1) && 'disabled'}
                />

                <FloatInputTextIcon
                    className="field mt-5"
                    icon='inventory_2'
                    value={product.name}
                    onInputChange={onInputChange} field='name'
                    maxLength={40} required autoFocus
                    submitted={submitted}
                    label='Nombre'
                    errorMessage='Nombre es requerido.'
                />

                <div className='formgrid grid mt-4'>
                    <FloatDropdownSearchIcon
                        className="field col mt-5"
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

                    <div className="field col">
                        <label htmlFor="expiryDate" className="font-bold ms-1" style={{ fontSize: "0.84rem", color: 'rgb(75, 85, 99)' }}>Fecha de Vencimiento</label>
                        <InputText
                            id="expiryDate"
                            value={product.expiryDate}
                            onChange={(e) => onInputChange(e, 'expiryDate')} // Cambiar el valor sin validación inmediata
                            onBlur={(e) => handleDateValidation(e)} // Validación cuando se pierde el foco
                            type="date"
                            min={getMinExpiryDate()} // Definir la fecha mínima en el calendario
                            required
                            style={{ height: '3.4rem' }}
                            className={classNames({ 'p-invalid': submitted && !product.expiryDate })}
                        />
                        {submitted && !product.expiryDate && (
                            <small className="p-error">Fecha de vencimiento es requerida.</small>
                        )}
                        <br />
                        {/* Mostrar mensaje de error personalizado */}
                        {expiryDateError && (
                            <small className="p-error">{expiryDateError}</small>
                        )}
                    </div>
                </div>

                {(operation === 1) && (
                    <div className="formgrid grid mt-5">
                        {/* Solo mostrar el campo de precio de venta si el producto no es nuevo */}
                        {!product.isNew && (
                            <FloatInputNumberMoneyIcon
                                className="field col"
                                value={product.salePrice}
                                onInputNumberChange={onInputNumberChange} field='salePrice'
                                maxLength={9} required
                                min={50}
                                submitted={submitted}
                                label='Precio de venta'
                                errorMessage='Precio de venta es requerido.'
                            />
                        )}
                        {/* Contenedor para el checkbox y el campo de stock */}
                        <div className="field col">
                            {/* Mostrar el campo de stock solo si el checkbox está desmarcado */}
                            {!product.isNew && (
                                <>
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
                                        small={!product.stock}
                                        smallMessage='El stock debe ser mayor a 0'
                                    />
                                </>
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
                    </div>
                )}
                <div className={`formgrid grid ${(operation === 1) ? 'mt-3' : 'mt-5'}`}>
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
                            key={uploadKey} // Forzamos recrear el componente cuando se selecciona una nueva imagen
                            id='image'
                            mode="basic"
                            name="image"
                            chooseLabel={(selectedImage) ? "Cambiar Imagen" : "Seleccionar Imagen"}
                            url="https://felysoftspring-production.up.railway.app/api/product/create"
                            accept=".png,.jpg,.jpeg,.webp"
                            maxFileSize={3145728}
                            onSelect={handleFileUpload}
                            onBeforeSelect={resetUploadOnClick}  // Restablece el estado antes de seleccionar un nuevo archivo
                            required
                            className={`${classNames({ 'p-invalid': submitted && !product.image && !selectedImage })}`}
                        />
                        {submitted && product.image && !selectedImage && <small className="p-error">Imagen es requerida.</small>}
                        {imageError && <small className="p-error">{imageError}</small>}
                        {imageSuccess && <small className="p-success">{imageSuccess}</small>} {/* Mensaje de éxito */}
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
