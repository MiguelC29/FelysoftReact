import { DataView, DataViewLayoutOptions } from 'primereact/dataview';
import { InputText } from 'primereact/inputtext';
import { Tag } from 'primereact/tag';
import { classNames } from 'primereact/utils';
import React, { useEffect, useRef, useState } from 'react';
import { formatCurrency } from '../../functionsDataTable';
import Request_Service from '../service/Request_Service';
import AddToCartButton from './AddToCartButton';
import { useSale } from '../context/SaleContext';
import { useLocation } from 'react-router-dom';
import { Toast } from 'primereact/toast';

export default function Carrito() {
    const [products, setProducts] = useState([]);
    const [layout, setLayout] = useState('grid');
    const [globalFilter, setGlobalFilter] = useState('');
    const { saleConfirmed, setSaleConfirmed } = useSale();
    const location = useLocation(); // Hook para acceder al state de la navegación
    const toast = useRef(null);

    useEffect(() => {
        fetchProducts();

        // Escucha cuando la venta ha sido confirmada para actualizar los productos
        if (saleConfirmed) {
            fetchProducts();
            setSaleConfirmed(false); // Resetea el estado de venta confirmada
        }

        // Comprobar si hay un mensaje de toast en el estado de navegación
        if (location.state && location.state.toastMessage) {
            const { toastMessage } = location.state;
            if (toastMessage && !toast.current._lastMessage) {
                toast.current.show(toastMessage);
                toast.current._lastMessage = toastMessage;
            }
            // Limpiar el mensaje de toast en el estado de ubicación
            location.state.toastMessage = null;
        }
    }, [saleConfirmed, setSaleConfirmed, location.state]);

    const fetchProducts = () => {
        Request_Service.getData('/inventory/inventoryProducts', setProducts);
    };

    const getSeverity = (product) => {
        switch (product.state) {
            case 'DISPONIBLE':
                return '#0D9276';
            case 'BAJO':
                return '#ff9209';
            case 'AGOTADO':
                return '#e72929';
            default:
                return null;
        }
    };

    const getSeverityStock = (product) => {
        if (product.stock < 1) {
            return '#e72929';
        } else if (product.stock < 6) {
            return '#ff9209';
        } else {
            return '#0D9276';
        }
    };

    const priceBodyTemplate = (rowData) => {
        return formatCurrency(rowData).replace(/(\.00|,00)$/, '');
    };

    const listItem = (product, index) => {
        return (
            <div className="col-12" key={product.product.idProduct}>
                <div className={classNames('flex flex-column xl:flex-row xl:align-items-start p-4 gap-4', { 'border-top-1 surface-border': index !== 0 })}>
                    <img className="w-9 sm:w-16rem xl:w-10rem block xl:block mx-auto" src={`data:${product.product.typeImg};base64,${product.product.image}`} alt={`Imagen producto ${product.product.name}`} />
                    <div className="flex flex-column sm:flex-row justify-content-between align-items-center xl:align-items-start flex-1 gap-4">
                        <div className="flex flex-column align-items-center sm:align-items-start gap-3">
                            <div className="text-2xl font-bold text-900">{product.product.name}</div>
                            <div className="flex align-items-center gap-3">
                                <span className="flex align-items-center gap-2">
                                    <i className="pi pi-tag"></i>
                                    <span className="font-semibold">{product.product.category.name}</span>
                                </span>
                            </div>
                            <div className="flex align-items-center gap-3">
                                <Tag value={product.stock} style={{ background: getSeverityStock(product) }}></Tag>
                            </div>
                            <div className="flex align-items-center gap-3">
                                <Tag value={product.state} style={{ background: getSeverity(product) }}></Tag>
                            </div>
                        </div>
                        <div className="flex sm:flex-column align-items-center sm:align-items-end gap-3 sm:gap-2">
                            <span className="text-2xl font-semibold">{priceBodyTemplate(product.product.salePrice)}</span>
                            <AddToCartButton product={product} />
                        </div>
                    </div>
                </div>
            </div>
        );
    };

    const gridItem = (product) => {
        return (
            <div className="col-12 sm:col-6 lg:col-12 xl:col-4 p-2" key={product.product.idProduct}>
                <div className="p-4 border-1 surface-border border-round">
                    <div className="flex flex-wrap align-items-center justify-content-between gap-2">
                        <div className="flex align-items-center gap-2">
                            <i className="pi pi-tag"></i>
                            <span className="font-semibold">{product.product.category.name}</span>
                        </div>
                        <div className="flex align-items-center gap-2">
                            <Tag value={product.stock} style={{ background: getSeverityStock(product) }}></Tag>
                            <Tag value={product.state} style={{ background: getSeverity(product) }}></Tag>
                        </div>
                    </div>
                    <div className="flex flex-column align-items-center gap-3 py-5">
                        <img className="w-5 sm:w-16rem lg:10rem xl:w-10rem block xl:block mx-auto" src={`data:${product.product.typeImg};base64,${product.product.image}`} alt={`Imagen producto ${product.product.name}`} height={120} />
                        <div className="text-2xl font-bold">{product.product.name}</div>
                    </div>
                    <div className="flex align-items-center justify-content-between">
                        <span className="text-2xl font-semibold">{priceBodyTemplate(product.product.salePrice)}</span>
                        <AddToCartButton product={product} />
                    </div>
                </div>
            </div>
        );
    };

    const itemTemplate = (product, layout, index) => {
        if (!product) {
            return;
        }
        if (layout === 'list') return listItem(product, index);
        else if (layout === 'grid') return gridItem(product);
    };

    const listTemplate = (products, layout) => {
        return <div className="grid grid-nogutter">{products.map((product, index) => itemTemplate(product, layout, index))}</div>;
    };

    const filteredProducts = products.filter(product =>
        product.product.name.toLowerCase().includes(globalFilter.toLowerCase()) && (product.state !== 'AGOTADO' && product.stock !== 0)
    );

    const header = () => {
        return (
            <>
                <div className="flex justify-content-start">
                    <span className="p-input-icon-left">
                        <InputText type="search" onInput={(e) => setGlobalFilter(e.target.value)} placeholder="Buscar por nombre..." />
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
            <Toast ref={toast} position="bottom-right" />

            <DataView
                value={filteredProducts}
                layout={layout}
                header={header()}
                itemTemplate={itemTemplate}
                listTemplate={listTemplate}
                paginator
                rows={10}
                rowsPerPageOptions={[5, 10, 25]}
                paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
                currentPageReportTemplate={"Mostrando {first} de {last} de {totalRecords} productos"}
                emptyMessage="No hay datos disponibles"
            />
        </div>
    );
}
