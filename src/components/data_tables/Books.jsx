import React, { useState, useRef, useEffect } from 'react';
import { DialogDelete, DialogFooter, actionBodyTemplate, confirmDelete, confirmDialog, confirmDialogFooter, deleteDialogFooter, exportCSV, exportExcel, exportPdf, formatCurrency, header, inputChange, inputNumberChange, leftToolbarTemplate, rightToolbarTemplateExport } from '../../functionsDataTable';
import { classNames } from 'primereact/utils';
import { Toast } from 'primereact/toast';
import { Toolbar } from 'primereact/toolbar';
import { Dialog } from 'primereact/dialog';
import { InputText } from 'primereact/inputtext';
import CustomDataTable from '../CustomDataTable';
import { InputNumber } from 'primereact/inputnumber';
import { Dropdown } from 'primereact/dropdown';
import { FloatLabel } from 'primereact/floatlabel';
import Request_Service from '../service/Request_Service';
import UserService from '../service/UserService';

export default function Books() {
    // TODO: A LOS LIBROS TAMBIEN TOCA AGREGARLE LO DE AGREGAR IMG
    let emptyBook = {
        idBook: null,
        title: '',
        editorial: '',
        description: '',
        yearPublication: null,
        priceTime: null,
        genre: '',
        author: ''
    };

    const URL = '/book/';
    const [book, setBook] = useState(emptyBook);
    const [books, setBooks] = useState([]);
    const [genres, setGenres] = useState([]);
    const [authors, setAuthors] = useState([]);
    const [selectedGenre, setSelectedGenre] = useState(null);
    const [selectedAuthor, setSelectedAuthor] = useState(null);
    const [bookDialog, setBookDialog] = useState(false);
    const [confirmDialogVisible, setConfirmDialogVisible] = useState(false);
    const [deleteBookDialog, setDeleteBookDialog] = useState(false);
    const [submitted, setSubmitted] = useState(false);
    const [globalFilter, setGlobalFilter] = useState(null);
    const [operation, setOperation] = useState();
    const [title, setTitle] = useState('');
    const toast = useRef(null);
    const dt = useRef(null);

      // ROLES
        const isAdmin = UserService.isAdmin();
        const isInventoryManager = UserService.isInventoryManager();

    useEffect(() => {
        Request_Service.getData(URL.concat('all'), setBooks);
        getGenres();
        getAuthors();
    }, []);

    const getGenres = () => {
        return Request_Service.getData('/genre/all', setGenres);
    }

    const getAuthors = () => {
        return Request_Service.getData('/author/all', setAuthors);
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

    const openNew = () => {
        setBook(emptyBook);
        setTitle('Registrar Libro');
        setSelectedAuthor('');
        setSelectedGenre('');
        getGenres();
        getAuthors();
        setOperation(1);
        setSubmitted(false);
        setBookDialog(true);
    };

    const editBook = (book) => {
        setBook({ ...book });
        setSelectedAuthor(book.author);
        setSelectedGenre(book.genre);
        getGenres();
        getAuthors();
        setTitle('Editar Libro');
        setOperation(2);
        setBookDialog(true);
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
        if (
            book.title.trim() &&
            book.editorial.trim() &&
            book.description.trim() &&
            book.yearPublication &&
            book.priceTime &&
            book.genre &&
            book.author
        ) {
            let url, method, parameters;

            if (book.idBook && operation === 2) {
                parameters = {
                    idBook: book.idBook,
                    title: book.title.trim(),
                    editorial: book.editorial.trim(),
                    description: book.description.trim(),
                    yearPublication: book.yearPublication,
                    priceTime: book.priceTime,
                    fkIdGenre: book.genre.idGenre,
                    fkIdAuthor: book.author.idAuthor
                };
                url = URL + 'update/' + book.idBook;
                method = 'PUT';
            } else {
                parameters = {
                    title: book.title.trim(),
                    editorial: book.editorial.trim(),
                    description: book.description.trim(),
                    yearPublication: book.yearPublication,
                    priceTime: book.priceTime,
                    fkIdGenre: book.genre.idGenre,
                    fkIdAuthor: book.author.idAuthor
                };
                url = URL + 'create';
                method = 'POST';
            }
            await Request_Service.sendRequest(method, parameters, url, operation, toast, 'Libro ', URL.concat('all'), setBooks);
            setBookDialog(false);
            setBook(emptyBook);
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

    const onInputNumberChange = (e, title) => {
        inputNumberChange(e, title, book, setBook);
    };

    const onInputChange = (e, title) => {
        inputChange(e, title, book, setBook);
    };

    const priceBodyTemplate = (rowData) => {
        return formatCurrency(rowData.priceTime);
    };

    const actionBodyTemplateB = (rowData) => {
        return actionBodyTemplate(rowData, editBook, confirmDeleteBook);
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

    const columns = [
        { field: 'title', header: 'Título', sortable: true, style: { minWidth: '12rem' } },
        { field: 'editorial', header: 'Editorial', sortable: true, style: { minWidth: '12rem' } },
        { field: 'description', header: 'Descripción', sortable: true, style: { minWidth: '16rem' } },
        { field: 'yearPublication', header: 'Año de Publicación', sortable: true, style: { minWidth: '10rem' } },
        { field: 'priceTime', header: 'Precio Tiempo', body: priceBodyTemplate, sortable: true, style: { minWidth: '8rem' } },
        { field: 'genre.name', header: 'Género', sortable: true, style: { minWidth: '10rem' } },
        { field: 'author.name', header: 'Autor', sortable: true, style: { minWidth: '10rem' } },
        (isAdmin || isInventoryManager) && { body: actionBodyTemplateB, exportable: false, style: { minWidth: '12rem' } },
    ];

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
                    <Toolbar className="mb-4" style={{ background: 'linear-gradient( rgba(221, 217, 217, 0.824), #f3f0f0d2)', border: 'none' }} left={leftToolbarTemplate(openNew)} right={rightToolbarTemplateExport(handleExportCsv, handleExportExcel, handleExportPdf)}></Toolbar>
                }
                <CustomDataTable
                    dt={dt}
                    data={books}
                    dataKey="id"
                    currentPageReportTemplate="Mostrando {first} de {last} de {totalRecords} Libros"
                    globalFilter={globalFilter}
                    header={header('Libros', setGlobalFilter)}
                    columns={columns}
                />
            </div>

            <Dialog visible={bookDialog} style={{ width: '40rem' }} breakpoints={{ '960px': '75vw', '641px': '90vw' }} header={title} modal className="p-fluid" footer={bookDialogFooter} onHide={hideDialog}>
                <div className="field mt-4">
                    <div className="p-inputgroup flex-1">
                        <span className="p-inputgroup-addon">
                            <span class="material-symbols-outlined">title</span>
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
                            <span class="material-symbols-outlined">collections_bookmark</span>
                        </span>
                        <FloatLabel>
                            <InputText id="editorial" value={book.editorial} onChange={(e) => onInputChange(e, 'editorial')} required className={classNames({ 'p-invalid': submitted && !book.editorial })} />
                            <label htmlFor="editorial" className="font-bold">Editorial</label>
                        </FloatLabel>
                    </div>
                    {submitted && !book.editorial && <small className="p-error">Editorial es requerida.</small>}
                </div>
                <div className="field mt-5">
                    <div className="p-inputgroup flex-1">
                        <span className="p-inputgroup-addon">
                            <span class="material-symbols-outlined">description</span>
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
                                <span class="material-symbols-outlined">today</span>
                            </span>
                            <FloatLabel>
                                <InputNumber id="yearPublication" value={book.yearPublication} onValueChange={(e) => onInputNumberChange(e, 'yearPublication')} placeholder="yyyy" required maxLength="4" className={classNames({ 'p-invalid': submitted && !book.yearPublication })} useGrouping={false} />
                                <label htmlFor="yearPublication" className="font-bold">Año de Publicación</label>
                            </FloatLabel>
                        </div>
                        {submitted && !book.yearPublication && <small className="p-error">Año de Publicación es requerida.</small>}
                    </div>
                    <div className="field col">
                        <div className="p-inputgroup flex-1">
                            <span className="p-inputgroup-addon">
                                <span class="material-symbols-outlined">monetization_on</span>
                            </span>
                            <FloatLabel>
                                <InputNumber id="priceTime" value={book.priceTime} onValueChange={(e) => onInputNumberChange(e, 'priceTime')} mode="decimal" currency="COP" locale="es-CO" required className={classNames({ 'p-invalid': submitted && !book.priceTime })} />
                                <label htmlFor="priceTime" className="font-bold">Precio de venta</label>
                            </FloatLabel>
                        </div>
                        {submitted && !book.priceTime && <small className="p-error">Precio Tiempo es requerido.</small>}
                    </div>
                </div>
                <div className="formgrid grid mt-3">
                    <div className="field col">
                        <div className="p-inputgroup flex-1">
                            <span className="p-inputgroup-addon">
                                <span class="material-symbols-outlined">book_3</span>
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
                                <span class="material-symbols-outlined">stylus_note</span>
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
            </Dialog >

            {DialogDelete(deleteBookDialog, 'Libro', deleteBookDialogFooter, hideDeleteBookDialog, book, book.title, 'el Libro')}

            {confirmDialog(confirmDialogVisible, 'Libro', confirmBookDialogFooter, hideConfirmBookDialog, book, operation)}
        </div >
    );
};
