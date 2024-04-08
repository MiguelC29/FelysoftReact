import React, { useState, useEffect } from 'react';
import { Button } from 'primereact/button';
import { DataView, DataViewLayoutOptions } from 'primereact/dataview';
import { Tag } from 'primereact/tag';
import { classNames } from 'primereact/utils';
import { formatCurrency, getOneData } from '../../functionsDataTable';
import { useCart } from '../CartContext';
import { InputText } from 'primereact/inputtext';

export default function Carrito() {
    const [products, setProducts] = useState([]);
    const [layout, setLayout] = useState('grid');
    const { updateCartItems } = useCart();
    const [globalFilter, setGlobalFilter] = useState('');

    useEffect(() => {
        getOneData('http://localhost:8086/api/inventory/inventoryProducts', setProducts);
    }, []);

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

    const priceBodyTemplate = (rowData) => {
        return formatCurrency(rowData).replace(/(\.00|,00)$/, '');
    };

    const addToCart = () => {
        // Lógica para agregar productos al carrito
        // Aquí deberías implementar la lógica para agregar un producto al carrito
        // Por ejemplo, puedes tener un estado para mantener el número de productos en el carrito
        // y luego llamar a la función updateCartItems con el nuevo valor
        updateCartItems(prevCount => prevCount + 1); // Ejemplo: aumentar en 1 el número de productos en el carrito
    };

    const listItem = (product, index) => {
        return (
            <div className="col-12" key={product.id}>
                <div className={classNames('flex flex-column xl:flex-row xl:align-items-start p-4 gap-4', { 'border-top-1 surface-border': index !== 0 })}>
                    <img className="w-9 sm:w-16rem xl:w-10rem shadow-2 block xl:block mx-auto border-round" src={`data:${product.product.typeImg};base64,${product.product.image}`} alt={`Imagen producto ${product.product.name}`} />
                    <div className="flex flex-column sm:flex-row justify-content-between align-items-center xl:align-items-start flex-1 gap-4">
                        <div className="flex flex-column align-items-center sm:align-items-start gap-3">
                            <div className="text-2xl font-bold text-900">{product.product.name}</div>
                            <div className="flex align-items-center gap-3">
                                <span className="flex align-items-center gap-2">
                                    <i className="pi pi-tag"></i>
                                    <span className="font-semibold">{product.product.category.name}</span>
                                </span>
                                <Tag value={product.state} style={{ background: getSeverity(product) }} ></Tag>
                            </div>
                        </div>
                        <div className="flex sm:flex-column align-items-center sm:align-items-end gap-3 sm:gap-2">
                            <span className="text-2xl font-semibold">{priceBodyTemplate(product.product.salePrice)}</span>
                            <Button icon="pi pi-shopping-cart" className="rounded" style={{ background: 'rgb(14, 165, 233)', borderColor: 'rgb(14, 165, 233)' }} disabled={product.state === 'AGOTADO'}></Button>
                        </div>
                    </div>
                </div>
            </div>
        );
    };

    const gridItem = (product) => {
        return (
            <div className="col-12 sm:col-6 lg:col-12 xl:col-4 p-2" key={product.id}>
                <div className="p-4 border-1 surface-border surface-card border-round">
                    <div className="flex flex-wrap align-items-center justify-content-between gap-2">
                        <div className="flex align-items-center gap-2">
                            <i className="pi pi-tag"></i>
                            <span className="font-semibold">{product.product.category.name}</span>
                        </div>
                        <Tag value={product.state} style={{ background: getSeverity(product) }}></Tag>
                    </div>
                    <div className="flex flex-column align-items-center gap-3 py-5">
                        <img className="w-9 shadow-2 border-round" src={`data:${product.product.typeImg};base64,${product.product.image}`} alt={`Imagen producto ${product.product.name}`} width={100} height={200} />
                        <div className="text-2xl font-bold">{product.product.name}</div>
                    </div>
                    <div className="flex align-items-center justify-content-between">
                        <span className="text-2xl font-semibold">{priceBodyTemplate(product.product.salePrice)}</span>
                        <Button icon="pi pi-shopping-cart" className="rounded" style={{ background: 'rgb(14, 165, 233)', borderColor: 'rgb(14, 165, 233)' }} disabled={product.state === 'AGOTADO'} onClick={addToCart}></Button>
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
        product.product.name.toLowerCase().includes(globalFilter.toLowerCase())
    );

    const header = () => {
        return (
            <>
                <div className="flex justify-content-start">
                    <span className="p-input-icon-left">
                        <i className="pi pi-search" />
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