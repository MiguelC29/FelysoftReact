import React, { useEffect, useState } from 'react';
import { Button } from 'primereact/button';
import { DataView, DataViewLayoutOptions } from 'primereact/dataview';
import { InputText } from 'primereact/inputtext';
import { Tag } from 'primereact/tag';
import { classNames } from 'primereact/utils';
import Request_Service from '../service/Request_Service'; 
import { formatCurrency } from '../../functionsDataTable';

export default function Reservar() {
    const [books, setBooks] = useState([]);
    const [layout, setLayout] = useState('grid');
    const [globalFilter, setGlobalFilter] = useState('');

    // Efecto para cargar datos de libros
    useEffect(() => {
        Request_Service.getData('/inventory/inventoryBooks', setBooks);
    }, []);

    const getSeverity = (book) => {
        switch (book.state) {
            case 'DISPONIBLE':
                return '#0D9276';
            case 'RESERVADO':
                return '#e72929';
            default:
                return null;
        }
    };

    const priceBodyTemplate = (rowData) => {
        return formatCurrency(rowData).replace(/(\.00|,00)$/, '');
    };

    const listItem = (book, index) => {
        return (
            <div className="col-12" key={book.id}>
                <div className={classNames('flex flex-column xl:flex-row xl:align-items-start p-4 gap-4', { 'border-top-1 surface-border': index !== 0 })}>
                    <img className="w-9 sm:w-16rem xl:w-10rem block xl:block mx-auto" src={`data:${book.book.typeImg};base64,${book.book.image}`} alt={`Imagen Libro ${book.book.title}`} />
                    <div className="flex flex-column sm:flex-row justify-content-between align-items-center xl:align-items-start flex-1 gap-4">
                        <div className="flex flex-column align-items-center sm:align-items-start gap-3">
                            <div className="text-2xl font-bold text-900">{book.book.title}</div>
                            <div className="flex align-items-center gap-3">
                                <span className="flex align-items-center gap-2">
                                    <i className="pi pi-tag"></i>
                                    <span className="font-semibold">{book.book.genre.name}</span>
                                </span>
                            </div>
                            <Tag value={book.state} style={{ background: getSeverity(book) }}></Tag>
                        </div>
                        <div className="flex sm:flex-column align-items-center sm:align-items-end gap-3 sm:gap-2">
                            <span className="text-2xl font-semibold">{priceBodyTemplate(book.book.priceTime)}</span>
                            <Button label="Reservar libro" icon="pi pi-book" className="rounded" style={{ background: 'rgb(14, 165, 233)', borderColor: 'rgb(14, 165, 233)' }} />
                        </div>
                    </div>
                </div>
            </div>
        );
    };

    const gridItem = (book) => {
        return (
            <div className="col-12 sm:col-6 lg:col-12 xl:col-4 p-2" key={book.id}>
                <div className="p-4 border-1 surface-border border-round">
                    <div className="flex flex-wrap align-items-center justify-content-between gap-2">
                        <div className="flex align-items-center gap-2">
                            <i className="pi pi-tag"></i>
                            <span className="font-semibold">{book.book.genre.name}</span>
                        </div>
                        <Tag value={book.state} style={{ background: getSeverity(book) }}></Tag>
                    </div>
                    <div className="flex flex-column align-items-center gap-3 py-5">
                        <img className="w-5 sm:w-16rem lg:10rem xl:w-10rem block xl:block mx-auto" src={`data:${book.book.typeImg};base64,${book.book.image}`} alt={`Imagen Libro ${book.book.title}`} />
                        <div className="text-2xl font-bold">{book.book.title}</div>
                    </div>
                    <div className="flex align-items-center justify-content-between">
                        <span className="text-2xl font-semibold">{priceBodyTemplate(book.book.priceTime)}</span>
                        <Button label="Reservar libro" icon="pi pi-book" className="rounded" style={{ background: 'rgb(14, 165, 233)', borderColor: 'rgb(14, 165, 233)' }} disabled={book.state === 'RESERVADO'} />
                    </div>
                </div>
            </div>
        );
    };

    const itemTemplate = (book, layout, index) => {
        if (!book) return;
        return layout === 'list' ? listItem(book, index) : gridItem(book);
    };

    const filteredBooks = books.filter(book => book?.book?.title?.toLowerCase().includes(globalFilter.toLowerCase()));


    const header = () => {
        return (
            <>
                <div className="flex justify-content-start">
                    <span className="p-input-icon-left">
                        <i className="pi pi-search" />
                        <InputText type="search" onInput={(e) => setGlobalFilter(e.target.value)} placeholder="Buscar libro..." />
                    </span>
                </div>
                <div className="flex justify-content-end">
                    <DataViewLayoutOptions layout={layout} onChange={(e) => setLayout(e.value)} />
                </div>
            </>
        );
    };

    return (
        <div className="card">
            <DataView
                value={filteredBooks}
                layout={layout}
                header={header()}
                itemTemplate={itemTemplate}
                paginator
                rows={10}
                rowsPerPageOptions={[5, 10, 25]}
                paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
                currentPageReportTemplate={"Mostrando {first} de {last} de {totalRecords} libros"}
                emptyMessage="No hay libros disponibles"
            />
        </div>
    );
}
