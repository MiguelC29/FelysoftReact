import React, { useState, useRef, useEffect, useCallback } from 'react';
import { DialogDelete, DialogFooter, actionBodyTemplate, confirmDelete, confirmDialog, confirmDialogFooter, deleteDialogFooter, exportCSV, exportExcel, exportPdf, header, inputChange, inputNumberChange, leftToolbarTemplate, rightToolbarTemplateExport } from '../../functionsDataTable';
import { classNames } from 'primereact/utils';
import { Toast } from 'primereact/toast';
import { Toolbar } from 'primereact/toolbar';
import { Dialog } from 'primereact/dialog';
import { InputText } from 'primereact/inputtext';
import CustomDataTable from '../CustomDataTable';
import { Image } from 'primereact/image';
import { InputNumber } from 'primereact/inputnumber';
import { Dropdown } from 'primereact/dropdown';
import { FloatLabel } from 'primereact/floatlabel';
import Request_Service from '../service/Request_Service';
import UserService from '../service/UserService';
import { FileUpload } from 'primereact/fileupload';
import Barcode from 'react-barcode';
import Quagga from 'quagga';  // Biblioteca para leer códigos de barras desde imágenes
import { FloatInputTextIcon } from '../Inputs';

export default function Books() {
    const [barcode, setBarcode] = useState('');

    let emptyBook = {
        idBook: null,
        barcode: barcode,
        image: '',
        typeImg: '',
        title: '',
        description: '',
        yearPublication: null,
        priceTime: null,
        genre: '',
        author: '',
        editorial: '',
        isNew: true // Agregar el campo para controlar si el libro es nuevo
    };

    const URL = '/book/';
    const [book, setBook] = useState(emptyBook);
    const [books, setBooks] = useState([]);
    const [genres, setGenres] = useState([]);
    const [authors, setAuthors] = useState([]);
    const [editorials, setEditorials] = useState([]);
    const [selectedGenre, setSelectedGenre] = useState(null);
    const [selectedAuthor, setSelectedAuthor] = useState(null);
    const [selectedEditorial, setSelectedEditorial] = useState(null);
    const [barcodeDialogVisible, setBarcodeDialogVisible] = useState(false);
    const [barcodeValid, setBarcodeValid] = useState(true);
    const [bookDialog, setBookDialog] = useState(false);
    const [confirmDialogVisible, setConfirmDialogVisible] = useState(false);
    const [deleteBookDialog, setDeleteBookDialog] = useState(false);
    const [submitted, setSubmitted] = useState(false);
    const [globalFilter, setGlobalFilter] = useState(null);
    const [operation, setOperation] = useState();
    const [onlyDisabled, setOnlyDisabled] = useState(false); // Estado para el botón
    const [title, setTitle] = useState('');
    const [file, setFile] = useState(null);
    const [selectedImage, setSelectedImage] = useState(null);
    const [imageError, setImageError] = useState('');
    const [imageSuccess, setImageSuccess] = useState(''); // Mensaje de éxito
    const [uploadKey, setUploadKey] = useState(0); // Para forzar el refresco del componente FileUpload
    const [scanning, setScanning] = useState(false);
    const [scannerTimeout, setScannerTimeout] = useState(null); // Estado para el timeout
    const toast = useRef(null);
    const dt = useRef(null);
    const fileInputRef = useRef(null); // Referencia para el input de imagen
    const qrReaderRef = useRef(null);


    // ROLES
    const isAdmin = UserService.isAdmin();
    const isInventoryManager = UserService.isInventoryManager();

    const fetchBooks = useCallback(async () => {
        try {
            const url = onlyDisabled ? `${URL}disabled` : `${URL}all`;
            await Request_Service.getData(url, setBooks);
        } catch (error) {
            console.error("Fallo al recuperar Libros:", error);
        }
    }, [onlyDisabled, URL]);

    useEffect(() => {
        fetchBooks();
        getGenres();
        getAuthors();
        getEditorials();
    }, [onlyDisabled, fetchBooks]);

    const getGenres = () => {
        return Request_Service.getData('/genre/all', setGenres);
    }

    const getAuthors = () => {
        return Request_Service.getData('/author/all', setAuthors);
    }

    const getEditorials = () => {
        return Request_Service.getData('/editorial/all', setEditorials);
    }

    const handleGenreChange = (genreId) => {
        setSelectedGenre(genreId);
        if (genreId) {
            Request_Service.getData(`/author/authorsByGenre/${genreId.idGenre}`, setAuthors);
        }
        if (selectedGenre) {
            setSelectedAuthor('');
            book.author = '';
        }
    };

    const handleAuthorChange = (authorId) => {
        setSelectedAuthor(authorId);
        if (authorId) {
            Request_Service.getData(`/genre/genresByAuthor/${authorId.idAuthor}`, setGenres);
        }
        if (selectedAuthor) {
            setSelectedGenre('');
            book.genre = '';
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

        // Función para procesar la imagen cargada
        const handleImageUpload = (e) => {
            const file = e.target.files[0];
            if (!file) return;
    
            setFile(true);
            const reader = new FileReader();
            reader.onload = function () {
                // Inicializar Quagga para leer el código de barras desde la imagen
                Quagga.decodeSingle({
                    src: reader.result,
                    numOfWorkers: 0,  // Deshabilitar web workers (opcional)
                    inputStream: {
                        size: 800,  // Escalar imagen
                    },
                    decoder: {
                        readers: ['ean_reader'],  // Especificar el formato EAN
                    },
                }, function (result) {
                    if (result && result.codeResult) {
                        setBarcode(result.codeResult.code); // Asigna el valor del código de barras
                        setBarcodeValid(validateBarcode(result.codeResult.code));
                    } else {
                        setBarcodeValid(false);
                    }
                    setFile(false);
                });
            };
            reader.readAsDataURL(file);  // Leer el archivo como base64
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

    const startScanner = () => {
        setBarcode('');
        if (qrReaderRef.current) {
            Quagga.init({
                inputStream: {
                    type: 'LiveStream',
                    target: qrReaderRef.current, // Usa la referencia del contenedor
                    constraints: {
                        facingMode: 'environment', // Usa la cámara trasera
                        width: { ideal: 400 },     // Ajusta el ancho del video
                        height: { ideal: 200 },    // Ajusta la altura del video
                    },
                    area: {
                        top: '0%',    // Iniciar el escaneo en la parte superior
                        right: '0%',  // Iniciar el escaneo a la derecha
                        left: '0%',   // Iniciar el escaneo a la izquierda
                        bottom: '0%'   // Iniciar el escaneo en la parte inferior
                    },
                },
                decoder: {
                    readers: ['ean_reader'], // Tipos de códigos de barras a decodificar // Solo lector para códigos de barras EAN-13
                    multiple: false, // Desactiva la lectura de múltiples códigos a la vez para evitar confusiones
                },
            }, (err) => {
                if (err) {
                    console.error(err);
                    return;
                }
                Quagga.start();
                setScanning(true);

                // Establecer un timeout para detener el escáner después de 10 segundos
                setScannerTimeout(setTimeout(() => {
                    stopScanner();
                    alert("No se detectó ningún código. El escáner se detuvo.");
                }, 30000)); // 30000 ms = 30 segundos
            });

            Quagga.onDetected((data) => {
                setBarcode(data.codeResult.code);
                stopScanner(); // Detiene el escáner después de una lectura exitosa

                // Limpiar el timeout cuando se detecte un código
                if (scannerTimeout) {
                    clearTimeout(scannerTimeout);
                    setScannerTimeout(null);
                }
            });
        }
    };

    const stopScanner = useCallback(() => {
        Quagga.stop();
        setScanning(false);
        // Oculta el recuadro del escáner
        qrReaderRef.current.style.display = 'none';

        // Limpiar el timeout si se detiene el escáner manualmente
        if (scannerTimeout) {
            clearTimeout(scannerTimeout);
            setScannerTimeout(null);
        }
    }, [scannerTimeout]);

    useEffect(() => {
        if (scanning) {
            return () => {
                stopScanner(); // Detiene el escáner al desmontar el componente
            };
        }
    }, [scanning, stopScanner]);

    // Forzar reinicio al hacer clic en "Seleccionar Imagen"
    const resetUploadOnClick = () => {
        setFile(null);
        setSelectedImage(null);
        setImageError('');
        setImageSuccess(''); // Limpiar el mensaje de éxito al reiniciar
        setUploadKey(prevKey => prevKey + 1); // Forzar la recreación del FileUpload
    };

    const handleAddBook = () => {
        setBarcodeDialogVisible(true); // Mostrar el modal para ingresar el código de barras
        setBarcode('');
        setSubmitted(false);
    };

    const openNew = () => {
        setBook(emptyBook);
        setTitle('Registrar Libro');
        setSelectedAuthor('');
        setSelectedGenre('');
        setSelectedEditorial('');
        setSelectedImage('')
        setFile('');
        setImageSuccess('');
        setImageError('');
        getGenres();
        getAuthors();
        getEditorials();
        setOperation(1);
        setSubmitted(false);
        setBookDialog(true);
    };

    const editBook = (book) => {
        setBook({ ...book });
        setSelectedAuthor(book.author);
        setSelectedGenre(book.genre);
        setSelectedEditorial(book.editorial);
        setSelectedImage('')
        setFile('');
        setImageSuccess('');
        setImageError('');
        getGenres();
        getAuthors();
        getEditorials();
        setBarcodeValid(true);
        setTitle('Editar Libro');
        setOperation(2);
        setBookDialog(true);
    };

    const toggleDisabled = () => {
        setOnlyDisabled(!onlyDisabled);
    };

    const hideDialog = () => {
        setSubmitted(false);
        setBookDialog(false);
        setBarcodeDialogVisible(false);
        (scanning) && stopScanner();
    };

    const hideConfirmBookDialog = () => {
        setConfirmDialogVisible(false);
    };

    const hideDeleteBookDialog = () => {
        setDeleteBookDialog(false);
    };

    const handleBarcodeSubmit = async () => {
        setSubmitted(true);
        if (!barcode || !validateBarcode(barcode)) {
            return;
        }

        setBarcodeDialogVisible(false); // Cierra el modal de código de barras

        await Request_Service.getBookByCode(barcode, toast, openNew);
    };

    const saveBook = async () => {
        setSubmitted(true);
        setConfirmDialogVisible(false);

        // Verificar si todos los campos requeridos están presentes
        const isValid =
            book.barcode.trim() &&
            book.title.trim() &&
            book.editorial &&
            book.description.trim() &&
            book.yearPublication &&
            //book.priceTime &&
            book.genre &&
            book.author &&
            ((operation === 1) ? file : book.image);

        // Mostrar mensaje de error si algún campo requerido falta
        if (!isValid) {
            toast.current.show({ severity: 'error', summary: 'Error', detail: 'Por favor complete todos los campos requeridos', life: 3000 });
            return;
        }

        if (imageError) {
            return;
        }

        let url, method;
        const formData = new FormData();

        if (book.idBook && operation === 2) {
            // Asegurarse de que los campos no estén vacíos al editar
            formData.append('idBook', book.idBook);
            formData.append('barcode', book.barcode.trim());
            formData.append('title', book.title.trim());
            formData.append('editorial', book.editorial.idEditorial);
            formData.append('description', book.description.trim());
            formData.append('yearPublication', book.yearPublication);
            //formData.append('priceTime', book.priceTime);
            formData.append('genre', book.genre.idGenre);
            formData.append('author', book.author.idAuthor);
            formData.append('image', file);

            url = URL + 'update/' + book.idBook;
            method = 'PUT';
        } else {
            // Verificar que los campos requeridos están presentes al crear
            formData.append('barcode', book.barcode.trim());
            formData.append('title', book.title.trim());
            formData.append('editorial', book.editorial.idEditorial);
            formData.append('description', book.description.trim());
            formData.append('yearPublication', book.yearPublication);
            //formData.append('priceTime', book.priceTime);
            formData.append('genre', book.genre.idGenre);
            formData.append('author', book.author.idAuthor);
            formData.append('image', file);

            url = URL + 'create';
            method = 'POST';
        }

        if (isValid) {
            await Request_Service.sendRequest(method, formData, url, operation, toast, 'Libro ', URL.concat('all'), setBooks);
            setBookDialog(false);
        }
    };

    const confirmSave = () => {
        setConfirmDialogVisible(true);
    };

    const confirmDeleteBook = (book) => {
        confirmDelete(book, setBook, setDeleteBookDialog);
    };

    const deleteBook = () => {
        Request_Service.deleteData(URL, book.idBook, setBooks, toast, setDeleteBookDialog, setBook, emptyBook, 'Libro ', URL.concat('all'));
    };

    const handleEnable = (book) => {
        Request_Service.sendRequestEnable(URL, book.idBook, setBooks, toast, 'Libro ');
    }

    const onInputNumberChange = (e, title) => {
        inputNumberChange(e, title, book, setBook);
    };

    const onInputChange = (e, title) => {
        inputChange(e, title, book, setBook);
    };

    const imageBodyTemplate = (rowData) => {
        const imageData = rowData.image;
        const imageType = rowData.imageType;
        if (imageData) {
            return <Image src={`data:${imageType};base64,${imageData}`} alt={`Imagen del Libro ${rowData.name}`} className="shadow-2 border-round" width="80" height="80" preview />;
        } else {
            return <p>No hay imagen</p>;
        }
    };


    const actionBodyTemplateB = (rowData) => {
        return actionBodyTemplate(rowData, editBook, confirmDeleteBook, onlyDisabled, handleEnable);
    };

    const barcodeBodyTemplate = (rowData) => {
        return <Barcode value={rowData.barcode} format='EAN13' width={1.2} height={30} />
    }

    const bookBarcodeDialogFooter = (
        DialogFooter(hideDialog, handleBarcodeSubmit)
    );

    const bookDialogFooter = (
        DialogFooter(hideDialog, confirmSave)
    );

    const confirmBookDialogFooter = (
        confirmDialogFooter(hideConfirmBookDialog, saveBook)
    );

    const deleteBookDialogFooter = (
        deleteDialogFooter(hideDeleteBookDialog, deleteBook)
    );

    const selectedGenreTemplate = (option, props) => {
        if (option) {
            return (
                <div className="flex align-items-center">
                    <div>{option.name}</div>
                </div>
            );
        }
        return <span>{props.placeholder}</span>;
    };

    const genreOptionTemplate = (option) => {
        return (
            <div className="flex align-items-center">
                <div>{option.name}</div>
            </div>
        );
    };

    const selectedAuthorTemplate = (option, props) => {
        if (option) {
            return (
                <div className="flex align-items-center">
                    <div>{option.name}</div>
                </div>
            );
        }
        return <span>{props.placeholder}</span>;
    };

    const authorOptionTemplate = (option) => {
        return (
            <div className="flex align-items-center">
                <div>{option.name}</div>
            </div>
        );
    };


    const selectedEditorialTemplate = (option, props) => {
        if (option) {
            return (
                <div className="flex align-items-center">
                    <div>{option.name}</div>
                </div>
            );
        }
        return <span>{props.placeholder}</span>;
    };

    const editorialOptionTemplate = (option) => {
        return (
            <div className="flex align-items-center">
                <div>{option.name}</div>
            </div>
        );
    };

    const columns = [
        { field: 'barcode', header: 'Código', body: barcodeBodyTemplate, sortable: true, style: { minWidth: '12rem' } },
        { field: 'title', header: 'Título', sortable: true, style: { minWidth: '12rem' } },
        { field: 'editorial.name', header: 'Editorial', sortable: true, style: { minWidth: '12rem' } },
        { field: 'description', header: 'Descripción', sortable: true, style: { minWidth: '16rem' } },
        { field: 'yearPublication', header: 'Año de Publicación', sortable: true, style: { minWidth: '10rem' } },
        { field: 'genre.name', header: 'Género', sortable: true, style: { minWidth: '10rem' } },
        { field: 'author.name', header: 'Autor', sortable: true, style: { minWidth: '10rem' } },
        { field: 'image', header: 'Imagen', body: imageBodyTemplate, exportable: false, style: { minWidth: '8rem' } },
        (isAdmin || isInventoryManager) && { body: actionBodyTemplateB, exportable: false, style: { minWidth: '12rem' } },
    ];

    const icon = (!onlyDisabled) ? 'pi-eye-slash' : 'pi-eye';

    // EXPORT DATA
    const handleExportPdf = () => { exportPdf(columns, authors, 'Reporte_Libros') };
    const handleExportExcel = () => { exportExcel(authors, columns, 'Libros') };
    const handleExportCsv = () => { exportCSV(false, dt) };

    return (
        <div>
            <Toast ref={toast} position="bottom-right" />
            <div className="card" style={{ background: '#9bc1de' }}>
                {
                    (isAdmin || isInventoryManager) &&
                    <Toolbar className="mb-4" style={{ background: 'linear-gradient( rgba(221, 217, 217, 0.824), #f3f0f0d2)', border: 'none' }}
                        left={leftToolbarTemplate(handleAddBook, onlyDisabled, toggleDisabled, icon)} right={rightToolbarTemplateExport(handleExportCsv, handleExportExcel, handleExportPdf)}></Toolbar>
                }
                <CustomDataTable
                    dt={dt}
                    data={books}
                    dataKey="idBook"
                    currentPageReportTemplate="Mostrando {first} de {last} de {totalRecords} Libros"
                    globalFilter={globalFilter}
                    header={header('Libros', setGlobalFilter)}
                    columns={columns}
                />
            </div>

            <Dialog visible={barcodeDialogVisible} footer={bookBarcodeDialogFooter} onHide={hideDialog} header="Ingresar Código de Barras" modal>
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

                {/* Botón para iniciar el escaneo */}
                {!scanning && (
                    <button onClick={startScanner} className="p-button p-component mt-4 me-3">
                        Iniciar Escaneo
                    </button>
                )}

                {/* Botón para cargar una imagen */}
                <button onClick={() => { fileInputRef.current.click(); setBarcode('') }} className="p-button mt-4">
                    {file ? "Cargando..." : "Cargar Imagen"}
                </button>

                {/* Input para cargar la imagen (oculto) */}
                <input
                    type="file"
                    accept="image/*"
                    ref={fileInputRef}
                    style={{ display: 'none' }}
                    onChange={handleImageUpload}
                />

                {/* Contenedor para el escáner con un tamaño ajustado */}
                <div ref={qrReaderRef}
                    style={{
                        width: '100%',
                        display: scanning ? 'block' : 'none',
                        position: 'relative',
                        margin: '0 auto', // Centrar el escáner
                        marginTop: '1rem'
                    }}
                >
                    {/* Línea de referencia */}
                    <div className="scanner-line"></div>

                    {/* Marco de escaneo */}
                    <div className="scanner-frame" style={{
                        position: 'absolute',
                        top: '15%',   // Ajusta la posición superior
                        left: '10%',  // Ajusta la posición izquierda
                        right: '10%', // Ajusta la posición derecha
                        bottom: '15%',// Ajusta la posición inferior
                        border: '2px dashed rgba(255, 0, 0, 0.8)', // Color y estilo del borde
                        borderRadius: '8px', // Bordes redondeados
                        pointerEvents: 'none', // Evita que este div intercepte los clics
                        zIndex: 9
                    }}></div>
                </div>

                {/* Mostrar el código de barras solo si hay un valor en barcode */}
                {barcode && barcodeValid && (
                    <div className="mt-4">
                        <Barcode value={barcode} format='EAN13' />
                    </div>
                )}
            </Dialog>

            <Dialog visible={bookDialog} style={{ width: '40rem' }} breakpoints={{ '960px': '75vw', '641px': '90vw' }} header={title} modal className="p-fluid" footer={bookDialogFooter} onHide={hideDialog}>
                {operation === 2 && book.image && <img src={`data:${book.typeImg};base64,${book.image}`} alt={`Imagen Libro ${book.title}`} className="shadow-2 border-round book-image block m-auto pb-3" style={{ width: '120px', height: '120px' }} />}
                <FloatInputTextIcon
                    className="field mt-4"
                    icon='barcode_scanner'
                    value={book.barcode}
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

                <div className="field mt-4">
                    <div className="p-inputgroup flex-1">
                        <span className="p-inputgroup-addon">
                            <span className="material-symbols-outlined">title</span>
                        </span>
                        <FloatLabel>
                            <InputText id="title" value={book.title} onChange={(e) => onInputChange(e, 'title')} required autoFocus className={classNames({ 'p-invalid': submitted && !book.title })} />
                            <label htmlFor="title" className="font-bold">Título</label>
                        </FloatLabel>
                    </div>
                    {submitted && !book.title && <small className="p-error">Título es requerido.</small>}
                </div>
                <div className="field mt-5">
                    <div className="p-inputgroup flex-1">
                        <span className="p-inputgroup-addon">
                            <span className="material-symbols-outlined">collections_bookmark</span>
                        </span>
                        <FloatLabel>
                            <Dropdown id="editorial" value={selectedEditorial} onChange={(e) => { setSelectedEditorial(e.value); onInputNumberChange(e, 'editorial'); }} options={editorials} optionLabel="name" placeholder="Seleccionar Editorial"
                                filter valueTemplate={selectedEditorialTemplate} itemTemplate={editorialOptionTemplate} emptyMessage="No hay datos" emptyFilterMessage="No hay resultados encontrados" required className={`w-full md:w-16.5rem ${classNames({ 'p-invalid': submitted && !book.genre && !selectedGenre })}`} />
                            <label htmlFor="editorial" className="font-bold">Editorial</label>
                        </FloatLabel>
                    </div>
                    {submitted && !book.editorial && <small className="p-error">Editorial es requerida.</small>}
                </div>
                <div className="field mt-5">
                    <div className="p-inputgroup flex-1">
                        <span className="p-inputgroup-addon">
                            <span className="material-symbols-outlined">description</span>
                        </span>
                        <FloatLabel>
                            <InputText id="description" value={book.description} onChange={(e) => onInputChange(e, 'description')} required className={classNames({ 'p-invalid': submitted && !book.description })} />
                            <label htmlFor="description" className="font-bold">Descripción</label>
                        </FloatLabel>
                    </div>
                    {submitted && !book.description && <small className="p-error">Descripción es requerida.</small>}
                </div>
                <div className="formgrid grid mt-5">
                    <div className="field col">
                        <div className="p-inputgroup flex-1">
                            <span className="p-inputgroup-addon">
                                <span className="material-symbols-outlined">today</span>
                            </span>
                            <FloatLabel>
                                <InputNumber id="yearPublication" value={book.yearPublication} onValueChange={(e) => onInputNumberChange(e, 'yearPublication')} placeholder="yyyy" required maxLength="4" minLength="4" className={classNames({ 'p-invalid': submitted && !book.yearPublication })} useGrouping={false} />
                                <label htmlFor="yearPublication" className="font-bold">Año de Publicación</label>
                            </FloatLabel>
                        </div>
                        {submitted && !book.yearPublication && <small className="p-error">Año de Publicación es requerida.</small>}
                    </div>
                </div>
                <div className="formgrid grid mt-3">
                    <div className="field col">
                        <div className="p-inputgroup flex-1">
                            <span className="p-inputgroup-addon">
                                <span className="material-symbols-outlined">book_3</span>
                            </span>
                            <FloatLabel>
                                <Dropdown id="genre" value={selectedGenre} onChange={(e) => { handleGenreChange(e.target.value); onInputNumberChange(e, 'genre'); }} options={genres} optionLabel="name" placeholder="Seleccionar Género"
                                    filter valueTemplate={selectedGenreTemplate} itemTemplate={genreOptionTemplate} emptyMessage="No hay datos" emptyFilterMessage="No hay resultados encontrados" required className={`w-full md:w-16.5rem ${classNames({ 'p-invalid': submitted && !book.genre && !selectedGenre })}`} />
                                <label htmlFor="genre" className="font-bold">Género</label>
                            </FloatLabel>
                        </div>
                        {submitted && !book.genre && !selectedGenre && <small className="p-error">Género es requerido.</small>}
                    </div>
                    <div className="field col">
                        <div className="p-inputgroup flex-1">
                            <span className="p-inputgroup-addon">
                                <span className="material-symbols-outlined">stylus_note</span>
                            </span>
                            <FloatLabel>
                                <Dropdown id="author" value={selectedAuthor} onChange={(e) => { handleAuthorChange(e.target.value); onInputNumberChange(e, 'author'); }} options={authors} optionLabel="name" placeholder="Seleccionar Author"
                                    filter valueTemplate={selectedAuthorTemplate} itemTemplate={authorOptionTemplate} emptyMessage="No hay datos" emptyFilterMessage="No hay resultados encontrados" required className={`w-full md:w-16.5rem ${classNames({ 'p-invalid': submitted && !book.author && !selectedAuthor })}`} />
                                <label htmlFor="author" className="font-bold">Autor</label>
                            </FloatLabel>
                        </div>
                        {submitted && !book.author && !selectedAuthor && <small className="p-error">Autor es requerido.</small>}
                    </div>
                </div>
                <div className="formgrid grid">
                    <div className="field col">
                        <label htmlFor="image" className="font-bold">Imagen Libro</label>
                        <FileUpload
                            key={uploadKey} // Forzamos recrear el componente cuando se selecciona una nueva imagen
                            id='image'
                            mode="basic"
                            name="image"
                            chooseLabel={(selectedImage) ? "Cambiar Imagen" : "Seleccionar Imagen"}
                            url="https://felysoftspring-production.up.railway.app/api/book/create"
                            accept=".png,.jpg,.jpeg,.webp"
                            maxFileSize={3145728}
                            onSelect={handleFileUpload}
                            onBeforeSelect={resetUploadOnClick}  // Restablece el estado antes de seleccionar un nuevo archivo
                            required
                            className={`${classNames({ 'p-invalid': submitted && !book.image && !selectedImage })}`}
                        />
                        {submitted && book.image &&!selectedImage && <small className="p-error">Imagen es requerida.</small>}
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

            {DialogDelete(deleteBookDialog, 'Libro', deleteBookDialogFooter, hideDeleteBookDialog, book, book.title, 'el Libro')}

            {confirmDialog(confirmDialogVisible, 'Libro', confirmBookDialogFooter, hideConfirmBookDialog, book, operation)}
        </div >
    );
};
