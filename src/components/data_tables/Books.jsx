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

export default function Books() {
    let emptyBook = {
        idBook: null,
        image: '',
        typeImg: '',
        title: '',
        description: '',
        yearPublication: null,
        priceTime: null,
        genre: '',
        author: '',
        editorial: '',
    };

    const URL = '/book/';
    const [file, setFile] = useState(null);
    const [book, setBook] = useState(emptyBook);
    const [books, setBooks] = useState([]);
    const [genres, setGenres] = useState([]);
    const [authors, setAuthors] = useState([]);
    const [editorials, setEditorials] = useState([]);
    const [selectedImage, setSelectedImage] = useState(null);
    const [selectedGenre, setSelectedGenre] = useState(null);
    const [selectedAuthor, setSelectedAuthor] = useState(null);
    const [selectedEditorial, setSelectedEditorial] = useState(null);
    const [bookDialog, setBookDialog] = useState(false);
    const [confirmDialogVisible, setConfirmDialogVisible] = useState(false);
    const [deleteBookDialog, setDeleteBookDialog] = useState(false);
    const [submitted, setSubmitted] = useState(false);
    const [globalFilter, setGlobalFilter] = useState(null);
    const [operation, setOperation] = useState();
    const [onlyDisabled, setOnlyDisabled] = useState(false); // Estado para el botón
    const [title, setTitle] = useState('');
    const toast = useRef(null);
    const dt = useRef(null);

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
        setBook(emptyBook);
        setTitle('Registrar Libro');
        setSelectedAuthor('');
        setSelectedGenre('');
        setSelectedEditorial('');
        setSelectedImage('')
        setFile('');
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
        getGenres();
        getAuthors();
        getEditorials();
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
    };

    const hideConfirmBookDialog = () => {
        setConfirmDialogVisible(false);
    };

    const hideDeleteBookDialog = () => {
        setDeleteBookDialog(false);
    };

    const saveBook = async () => {
        setSubmitted(true);
        setConfirmDialogVisible(false);

        // Verificar si todos los campos requeridos están presentes
        const isValid = book.title.trim() &&
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

        let url, method;
        const formData = new FormData();

        if (book.idBook && operation === 2) {
            // Asegurarse de que los campos no estén vacíos al editar
            formData.append('idBook', book.idBook);
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
                        left={leftToolbarTemplate(openNew, onlyDisabled, toggleDisabled, icon)} right={rightToolbarTemplateExport(handleExportCsv, handleExportExcel, handleExportPdf)}></Toolbar>
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

            <Dialog visible={bookDialog} style={{ width: '40rem' }} breakpoints={{ '960px': '75vw', '641px': '90vw' }} header={title} modal className="p-fluid" footer={bookDialogFooter} onHide={hideDialog}>
                {operation === 2 && book.image && <img src={`data:${book.typeImg};base64,${book.image}`} alt={`Imagen Libro ${book.title}`} className="shadow-2 border-round product-image block m-auto pb-3" style={{ width: '120px', height: '120px' }} />}
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
                            id='image'
                            mode="basic"
                            name="image"
                            chooseLabel="Seleccionar Imagen"
                            url="https://felysoftspring-production.up.railway.app/api/book/create"
                            accept="image/*"
                            maxFileSize={2000000}
                            onSelect={handleFileUpload}
                            required
                            className={`${classNames({ 'p-invalid': submitted && !book.image && !selectedImage })}`}
                        />
                        {submitted && !book.image && !selectedImage && <small className="p-error">Imagen es requerida.</small>}
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
