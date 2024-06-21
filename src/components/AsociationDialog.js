import React from 'react';
import { Dialog } from 'primereact/dialog';
import { confirmDialogAsc, inputNumberChange } from '../functionsDataTable';
import { FloatDropdownSearch } from './Inputs';

export default function AsociationDialog({ ...props }) {

    const onInputNumberChange = (e, name) => {
        inputNumberChange(e, name, props.asociation, props.setAsociation);
    };

    return (
        <>
            <Dialog visible={props.visible} style={{ width: '40rem' }} breakpoints={{ '960px': '75vw', '641px': '90vw' }} header={props.title} modal className="p-fluid" footer={props.footer} onHide={props.onHide}>
                <div className="formgrid grid mt-5">
                    {/* corregir el tamaño de los inputs */}
                    <FloatDropdownSearch
                        className="field col"
                        field={props.idOnInputNumberOne}
                        value={props.selectedOne}
                        handleChange={props.setSelectedOne}
                        onInputNumberChange={onInputNumberChange}
                        options={props.options} optionLabel={props.optionLabel}
                        placeholder={`Seleccionar ${props.nameTable}`}
                        valueTemplate={props.valueTemplate}
                        itemTemplate={props.itemTemplate}
                        required autoFocus
                        submitted={props.submitted} fieldForeign={props.idOne}
                        label={props.nameTable} errorMessage={props.errorMessageOne}
                    />
                    <FloatDropdownSearch
                        className="field col"
                        field={props.idOnInputNumberTwo}
                        value={props.selectedTwo}
                        handleChange={props.setSelectedTwo}
                        onInputNumberChange={onInputNumberChange}
                        options={props.optionsTwo} optionLabel={props.optionLabel}
                        placeholder={`Seleccionar ${props.nameTableTwo}`}
                        valueTemplate={props.valueTemplateTwo}
                        itemTemplate={props.itemTemplateTwo}
                        required
                        submitted={props.submitted} fieldForeign={props.idTwo}
                        label={props.nameTableTwo} errorMessage={props.errorMessageTwo}
                    />
                </div>
            </Dialog>
            {confirmDialogAsc(props.confirmDialogVisible, `${props.nameTable} y ${props.nameTableTwo}`, props.confirmAsociationDialogFooter, props.hideConfirmAsociationDialog, props.asociation)}
        </>
    );
}