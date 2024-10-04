import { Dropdown } from 'primereact/dropdown';
import { FloatLabel } from 'primereact/floatlabel';
import { InputNumber } from 'primereact/inputnumber';
import { InputText } from 'primereact/inputtext';
import { classNames } from 'primereact/utils';
import React from 'react';

// Componentes base
const BaseFloatInputText = (props) => {
    return (
        <FloatLabel>
            <InputText
                id={props.field}
                value={props.value}
                onChange={(e) => { props.onInputChange(e, props.field); (props.handle && props.handle(e))}}
                required={props.required}
                autoFocus={props.autoFocus}
                placeholder={props.placeholder}
                className={classNames({ 'p-invalid': props.submitted && !props.value })}
                maxLength={props.maxLength}
                disabled={props.disabled}
            />
            <label htmlFor={props.field} className="font-bold">{props.label}</label>
        </FloatLabel>
    );
};

const BaseFloatInputNumber = (props) => {
    return (
        <FloatLabel>
            <InputNumber
                id={props.field}
                value={props.value}
                onChange={(props.onChange) && props.onChange}
                onValueChange={(e) => props.onInputNumberChange(e, props.field)}
                useGrouping={props.useGrouping}
                min={1}
                maxLength={props.maxLength}
                required={props.required}
                autoFocus={props.autoFocus}
                placeholder={props.placeholder}
                className={classNames({ 'p-invalid': props.submitted && !props.value })}
            />
            <label htmlFor={props.field} className="font-bold">{props.label}</label>
        </FloatLabel>
    );
};

const MoneyFloatInputNumber = (props) => {
    return (
        <FloatLabel>
            <InputNumber
                id={props.field}
                value={props.value}
                onValueChange={((e) => props.onInputNumberChange(e, props.field))}
                useGrouping={props.useGrouping}
                min={props.min}
                maxLength={props.maxLength}
                required={props.required}
                autoFocus={props.autoFocus}
                disabled={props.disabled}
                placeholder={props.placeholder}
                mode="decimal" currency="COP" locale="es-CO"
                className={classNames({ 'p-invalid': props.submitted && !props.value })}
            />
            <label htmlFor={props.field} className="font-bold">{props.label}</label>
        </FloatLabel>
    );
};

const BaseFloatDropdownSearch = (props) => {
    return (
        <FloatLabel>
            <Dropdown
                id={props.field}
                value={props.value}
                onChange={(e) => { props.onInputNumberChange(e, props.field); ((props.handleChange) && props.handleChange(e.target.value)); ((props.setSelected) && props.setSelected(e.value)); }}
                options={props.options}
                optionLabel={props.optionLabel}
                placeholder={props.placeholder}
                filter
                valueTemplate={props.valueTemplate}
                itemTemplate={props.itemTemplate}
                emptyMessage="No hay datos"
                emptyFilterMessage="No hay resultados encontrados"
                required={props.required}
                autoFocus={props.autoFocus}
                disabled={props.disabled}
                className={`w-full md:w-13rem rounded ${classNames({ 'p-invalid': props.submitted && !props.fieldForeign && !props.value })}`}
            />
            <label htmlFor={props.field} className="font-bold">{props.label}</label>
        </FloatLabel>
    );
};

const BaseFloatDropdown = (props) => {
    return (
        <FloatLabel>
            <Dropdown
                id={props.field}
                value={props.value}
                onChange={(e) => { ((props.handleChange) && props.handleChange(e.target.value)); props.onInputNumberChange(e, props.field); ((props.setSelected) && props.setSelected(e.value));}}
                options={props.options}
                optionLabel={props.optionLabel}
                placeholder={props.placeholder}
                emptyMessage="No hay datos"
                emptyFilterMessage="No hay resultados encontrados"
                required={props.required}
                autoFocus={props.autoFocus}
                className={`w-full md:w-13rem rounded ${classNames({ 'p-invalid': props.submitted && !props.fieldForeign && !props.value })}`}
            />
            <label htmlFor={props.field} className="font-bold">{props.label}</label>
        </FloatLabel>
    );
};

//-------
export const FloatInputTextIcon = (props) => {
    return (
        <div className={props.className}>
            <div className="p-inputgroup flex-1">
                <span className="p-inputgroup-addon">
                    <span className="material-symbols-outlined">{props.icon}</span>
                </span>
                <BaseFloatInputText {...props} />
            </div>
            {props.submitted && !props.value && <small className="p-error">{props.errorMessage}</small>}
            {(props.value && !props.valid && <small className="p-error">{props.validMessage}</small>)}
        </div>
    );
};

export const FloatInputText = (props) => {
    return (
        <div className={props.className}>
            <BaseFloatInputText {...props} />
            {props.submitted && !props.value && <small className="p-error">{props.errorMessage}</small>}
        </div>
    );
};

export const FloatInputNumber = (props) => {
    return (
        <div className={props.className}>
            <BaseFloatInputNumber {...props} />
            {props.submitted && !props.value && <small className="p-error">{props.errorMessage}</small>}
        </div>
    );
};

export const FloatInputNumberIcon = (props) => {
    return (
        <div className={props.className}>
            <div className="p-inputgroup flex-1">
                <span className="p-inputgroup-addon">
                    <span className="material-symbols-outlined">{props.icon}</span>
                </span>
                <BaseFloatInputNumber {...props} />
            </div>
            {props.submitted && !props.value && <small className="p-error">{props.errorMessage}</small>}
            {props.small && <small className="p-error">{props.smallMessage}</small>}
        </div>
    );
};

export const FloatInputNumberMoneyIcon = (props) => {
    return (
        <div className={props.className}>
            <div className="p-inputgroup flex-1">
                <span className="p-inputgroup-addon">
                    <span className="material-symbols-outlined">monetization_on</span>
                </span>
                <MoneyFloatInputNumber {...props} />
            </div>
            {props.submitted && !props.value && <small className="p-error">{props.errorMessage}</small>}
        </div>
    );
};

export const FloatDropdownIcon = (props) => {
    return (
        <div className={props.className}>
            <div className="p-inputgroup flex-1">
                <span className="p-inputgroup-addon">
                    <span className="material-symbols-outlined">{props.icon}</span>
                </span>
                <BaseFloatDropdown {...props} />
            </div>
            {props.submitted && !props.fieldForeign && !props.value && <small className="p-error">{props.errorMessage}</small>}
        </div>
    );
};

// DROPDOWN - with search
export const FloatDropdownSearchIcon = (props) => {
    return (
        <div className={props.className}>
            <div className="p-inputgroup flex-1">
                <span className="p-inputgroup-addon">
                    <span className="material-symbols-outlined">{props.icon}</span>
                </span>
                <BaseFloatDropdownSearch {...props} />
            </div>
            {props.submitted && !props.fieldForeign && !props.value && <small className="p-error">{props.errorMessage}</small>}
        </div>
    );
};
export const FloatDropdownSearch = (props) => {
    return (
        <div className={props.className}>
            <BaseFloatDropdownSearch {...props} />
            {props.submitted && !props.fieldForeign && !props.value && <small className="p-error">{props.errorMessage}</small>}
        </div>
    );
};