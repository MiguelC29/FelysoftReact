import React, { useState, useRef, useEffect } from 'react';
import { DialogDelete, DialogFooter, actionBodyTemplate, confirmDelete, confirmDialog, confirmDialogFooter, deleteData, deleteDialogFooter, exportCSV, exportExcel, exportPdf, formatCurrency, getData, getOneData, header, inputChange, inputNumberChange, leftToolbarTemplate, rightToolbarTemplateExport, sendRequest } from '../../functionsDataTable'
import { classNames } from 'primereact/utils';
import { Toast } from 'primereact/toast';
import { Toolbar } from 'primereact/toolbar';
import { Dialog } from 'primereact/dialog';
import { InputText } from 'primereact/inputtext';
import CustomDataTable from '../CustomDataTable';
import { InputNumber } from 'primereact/inputnumber';
import { Dropdown } from 'primereact/dropdown';
import { FloatLabel } from 'primereact/floatlabel';

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

    const URL = 'http://localhost:8086/api/book/';
    const [books, setBooks] = useState([]);

    const [genres, setGenres] = useState([]);
    const [selectedGenre, setSelectedGenre] = useState(null);
    const [authors, setAuthors] = useState([]);
    const [selectedAuthor, setSelectedAuthor] = useState(null);

    const [bookDialog, setBookDialog] = useState(false);
    const [deleteBookDialog, setDeleteBookDialog] = useState(false);
    const [book, setBook] = useState(emptyBook);
    const [submitted, setSubmitted] = useState(false);
    const [confirmDialogVisible, setConfirmDialogVisible] = useState(false);
    const [globalFilter, setGlobalFilter] = useState(null);
    const [operation, setOperation] = useState();
    const [title, setTitle] = useState('');
    const toast = useRef(null);
    const dt = useRef(null);

    useEffect(() => {
        getData(URL, setBooks);
        getData('http://localhost:8086/api/genre/', setGenres);
        getData('http://localhost:8086/api/author/', setAuthors);
    }, []);

    const handleGenreChange = (genreId) => {
        setSelectedGenre(genreId);
        if (genreId) {
            getOneData(`${'http://localhost:8086/api/author/authorsByGenre/'}${genreId.idGenre}`, setAuthors);
        }
        if (selectedGenre) {
            setSelectedAuthor('');
            book.author = '';
        }
    };

    const handleAuthorChange = (authorId) => {
        setSelectedAuthor(authorId);
        if (authorId) {
            getOneData(`${'http://localhost:8086/api/genre/genresByAuthor/'}${authorId.idAuthor}`, setGenres);
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
        getData('http://localhost:8086/api/genre/', setGenres);
        getData('http://localhost:8086/api/author/', setAuthors);

        setOperation(1);
        setSubmitted(false);
        setBookDialog(true);
    };

    const editBook = (book) => {
        setBook({ ...book });
        setSelectedAuthor(book.author);
        setSelectedGenre(book.genre);

        getData('http://localhost:8086/api/genre/', setGenres);
        getData('http://localhost:8086/api/author/', setAuthors);

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

    const saveBook = () => {
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

            sendRequest(method, parameters, url, setBooks, URL, operation, toast, 'Libro ');
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
        deleteData(URL, book.idBook, setBooks, toast, setDeleteBookDialog, setBook, emptyBook, 'Libro ');
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
        { field: 'title', header: 'Titulo', sortable: true, style: { minWidth: '12rem' } },
        { field: 'editorial', header: 'Editorial', sortable: true, style: { minWidth: '12rem' } },
        { field: 'description', header: 'Descripcion', sortable: true, style: { minWidth: '16rem' } },
        { field: 'yearPublication', header: 'Año de Publicacion', sortable: true, style: { minWidth: '10rem' } },
        { field: 'priceTime', header: 'Precio Tiempo', body: priceBodyTemplate, sortable: true, style: { minWidth: '8rem' } },

        { field: 'genre.name', header: 'Genero', sortable: true, style: { minWidth: '10rem' } },
        { field: 'author.name', header: 'Author', sortable: true, style: { minWidth: '10rem' } },

        { body: actionBodyTemplateB, exportable: false, style: { minWidth: '12rem' } },
    ];

    // EXPORT DATA
    const handleExportPdf = () => { exportPdf(columns, authors, 'Reporte_Libros') };
    const handleExportExcel = () => { exportExcel(authors, columns, 'Libros') };
    const handleExportCsv = () => { exportCSV(false, dt) };

    return (
        <div>
            <Toast ref={toast} />
            <div className="card" style={{ background: '#9bc1de' }}>
                <Toolbar className="mb-4" style={{ background: 'linear-gradient( rgba(221, 217, 217, 0.824), #f3f0f0d2)', border: 'none' }} left={leftToolbarTemplate(openNew)} right={rightToolbarTemplateExport(handleExportCsv, handleExportExcel, handleExportPdf)}></Toolbar>

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
                            <label for="title" className="font-bold">Titulo</label>
                        </FloatLabel>
                    </div>
                    {submitted && !book.title && <small className="p-error">Titulo es requerido.</small>}
                </div>
                <div className="field mt-5">
                    <div className="p-inputgroup flex-1">
                        <span className="p-inputgroup-addon">
                            <span class="material-symbols-outlined">collections_bookmark</span>
                        </span>
                        <FloatLabel>
                            <InputText id="editorial" value={book.editorial} onChange={(e) => onInputChange(e, 'editorial')} required className={classNames({ 'p-invalid': submitted && !book.editorial })} />
                            <label for="editorial" className="font-bold">Editorial</label>
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
                            <label for="description" className="font-bold">Descripción</label>
                        </FloatLabel>
                    </div>
                    {submitted && !book.description && <small className="p-error">Descripcion es requerida.</small>}
                </div>
                <div className="formgrid grid mt-5">
                    <div className="field col">
                        <div className="p-inputgroup flex-1">
                            <span className="p-inputgroup-addon">
                                <span class="material-symbols-outlined">today</span>
                            </span>
                            <FloatLabel>
                                <InputNumber id="yearPublication" value={book.yearPublication} onValueChange={(e) => onInputNumberChange(e, 'yearPublication')} placeholder="yyyy" required maxLength="4" className={classNames({ 'p-invalid': submitted && !book.yearPublication })} useGrouping={false} />
                                <label for="yearPublication" className="font-bold">Año de Publicacion</label>
                            </FloatLabel>
                        </div>
                        {submitted && !book.yearPublication && <small className="p-error">Año de Publicacion es requerida.</small>}
                    </div>
                    <div className="field col">
                        <div className="p-inputgroup flex-1">
                            <span className="p-inputgroup-addon">
                                <span class="material-symbols-outlined">monetization_on</span>
                            </span>
                            <FloatLabel>
                                <InputNumber id="priceTime" value={book.priceTime} onValueChange={(e) => onInputNumberChange(e, 'priceTime')} mode="decimal" currency="COP" locale="es-CO" required className={classNames({ 'p-invalid': submitted && !book.priceTime })} />
                                <label for="priceTime" className="font-bold">Precio de venta</label>
                            </FloatLabel>
                        </div>
                        {submitted && !book.priceTime && <small className="p-error">Precio Tiempo es requerido.</small>}
                    </div>
                </div>
                <div className="formgrid grid mt-4">
                    <div className="field col">
                        <FloatLabel>
                            <Dropdown id="genre" value={selectedGenre} onChange={(e) => { handleGenreChange(e.target.value); onInputNumberChange(e, 'genre'); }} options={genres} optionLabel="name" placeholder="Seleccionar Género"
                                filter valueTemplate={selectedGenreTemplate} itemTemplate={genreOptionTemplate} emptyMessage="No hay datos" emptyFilterMessage="No hay resultados encontrados" required className={`w-full md:w-16.5rem ${classNames({ 'p-invalid': submitted && !book.genre && !selectedGenre })}`} />
                            <label for="genre" className="font-bold">Género</label>
                        </FloatLabel>
                        {submitted && !book.genre && !selectedGenre && <small className="p-error">Genero es requerido.</small>}
                    </div>
                    <div className="field col">
                        <FloatLabel>
                            <Dropdown id="author" value={selectedAuthor} onChange={(e) => { handleAuthorChange(e.target.value); onInputNumberChange(e, 'author'); }} options={authors} optionLabel="name" placeholder="Seleccionar Author"
                                filter valueTemplate={selectedAuthorTemplate} itemTemplate={authorOptionTemplate} emptyMessage="No hay datos" emptyFilterMessage="No hay resultados encontrados" required className={`w-full md:w-16.5rem ${classNames({ 'p-invalid': submitted && !book.author && !selectedAuthor })}`} />
                            <label for="author" className="font-bold">Autor</label>
                        </FloatLabel>
                        {submitted && !book.author && !selectedAuthor && <small className="p-error">Autor es requerido.</small>}
                    </div>
                </div>
            </Dialog >

            {DialogDelete(deleteBookDialog, 'Libro', deleteBookDialogFooter, hideDeleteBookDialog, book, book.title, 'el Libro')}

            {confirmDialog(confirmDialogVisible, 'Libro', confirmBookDialogFooter, hideConfirmBookDialog, book, operation)}
        </div >
    );
}