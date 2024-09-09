import React from 'react';
import { Dialog } from 'primereact/dialog';
import { Dropdown } from 'primereact/dropdown';
import { confirmDialogAsc, inputNumberChange } from '../functionsDataTable';
import { classNames } from 'primereact/utils';

export default function AsociationDialog({ ...props}) {

    const onInputNumberChange = (e, name) => {
        inputNumberChange(e, name, props.asociation, props.setAsociation);
    };

    return (
        <>
        <Dialog visible={props.visible} style={{ width: '40rem' }} breakpoints={{ '960px': '75vw', '641px': '90vw' }} header={props.title} modal className="p-fluid" footer={props.footer} onHide={props.onHide}>
            <div className="formgrid grid">
                <div className="field col">
                    <label htmlFor={props.labelId} className="font-bold">
                        {props.nameTable}
                    </label>
                    {/* mirar si tambien poner como props el optionLabel */}
                    <Dropdown 
                        id={props.labelId}
                        value={props.selectedOne}
                        onChange={(e) => { props.setSelectedOne(e.value); onInputNumberChange(e, props.idOnInputNumberOne); }}
                        options={props.options}
                        optionLabel="name"
                        placeholder={`Seleccionar ${props.nameTable}`}
                        filter={props.filter}
                        valueTemplate={props.valueTemplate}
                        itemTemplate={props.itemTemplate}
                        emptyMessage="No hay datos"
                        emptyFilterMessage="No hay resultados encontrados"
                        required
                        className={`w-full md:w-16.5rem ${classNames({ 'p-invalid': props.submitted && !props.id && !props.selectedOne })}`}
                    />

                    {props.submitted && !props.id && !props.selectedOne && <small className="p-error">{props.nameTable} es requerida.</small>}
                </div>
                <div className="field col">
                    <label htmlFor={props.labelIdTwo} className="font-bold">
                        {props.nameTableTwo}
                    </label>
                    {/* mirar si tambien poner como props el optionLabel */}
                    <Dropdown
                        id={props.labelId2}
                        value={props.selectedTwo}
                        onChange={(e) => { props.setSelected2(e.value); onInputNumberChange(e, props.idOnInputNumberTwo); }}
                        options={props.options2} optionLabel="name" placeholder={`Seleccionar ${props.nameTableTwo}`}
                        filter={props.filter} valueTemplate={props.valueTemplateTwo} itemTemplate={props.itemTemplateTwo}
                        emptyMessage="No hay datos"
                        emptyFilterMessage="No hay resultados encontrados"
                        required
                        className={`w-full md:w-16.5rem ${classNames({ 'p-invalid': props.submitted && !props.id2 && !props.selectedTwo })}`}
                    />

                    {props.submitted && !props.id2 && !props.selectedTwo && <small className="p-error">{props.nameTableTwo} es requerida.</small>}
                </div>
            </div>
        </Dialog>
        {confirmDialogAsc(props.confirmDialogVisible, `${props.nameTable} y ${props.nameTableTwo}`, props.confirmAsociationDialogFooter, props.hideConfirmAsociationDialog, props.asociation)}
        </>
    );
}