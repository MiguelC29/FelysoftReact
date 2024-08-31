import React, { useState, useRef } from 'react';
import { confirmDialog, confirmDialogFooter, inputChange, inputNumberChange } from '../../functionsDataTable';
import { classNames } from 'primereact/utils';
import { Toast } from 'primereact/toast';
import { InputNumber } from 'primereact/inputnumber';
import { InputText } from 'primereact/inputtext';
import { Dropdown } from 'primereact/dropdown';
import { Password } from 'primereact/password';
import { FloatLabel } from 'primereact/floatlabel';
import UserService from '../service/UserService';
import { Button } from 'primereact/button';
import { Link, useNavigate } from 'react-router-dom';
import logo from "../../img/logo.svg";


function RegistrationPage() {

    const navigate = useNavigate();

    const emptyUser = useState({
        numIdentification: '',
        typeDoc: '',
        names: '',
        lastNames: '',
        phoneNumber: '',
        user_name: '',
        email: '',
        confirmEmail: '',
        password: '',
        confirmPassword: ''
    });

    const TypeDoc = {
        CC: 'Cédula de Ciudadania',
        TI: 'Tarjeta de Identidad',
        CE: 'Cédula de Extranjeria'
    };

    const [user, setUser] = useState(emptyUser);
    const [selectedTypeId, setSelectedTypeId] = useState(null);
    const [confirmDialogVisible, setConfirmDialogVisible] = useState(false);
    const [submitted, setSubmitted] = useState(false);
    const [emailValid, setEmailValid] = useState(true);
    const [numIdValid, setNumIdValid] = useState(true);
    const [phoneValid, setPhoneValid] = useState(true);
    const toast = useRef(null);

    const hideConfirmUserDialog = () => {
        setConfirmDialogVisible(false);
    };

    const validateEmail = (email) => {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    };

    const validateIdentification = (numIdentification) => {
        // Convierte el valor a cadena para evitar errores de longitud
        const numIdentificationStr = numIdentification ? numIdentification.toString() : '';
        return numIdentificationStr.length === 8 || numIdentificationStr.length === 10;
    };

    const validatePhone = (phoneNumber) => {
        const phoneNumberStr = phoneNumber ? phoneNumber.toString() : '';
        return phoneNumberStr.length === 10;
    };

    const handleSubmit = async () => {
        try {
            setSubmitted(true);
            setConfirmDialogVisible(false);

            const isValid =
                user.numIdentification &&
                user.typeDoc &&
                user.names.trim() &&
                user.lastNames.trim() &&
                user.phoneNumber &&
                user.email.trim() &&
                user.user_name.trim() &&
                user.confirmEmail.trim() &&
                user.password &&
                user.confirmPassword;

            // Mostrar mensaje de error si algún campo requerido falta
            if (!isValid) {
                toast.current.show({ severity: 'error', summary: 'Error', detail: 'Por favor complete todos los campos requeridos', life: 3000 });
                return;
            }

            if (!validateIdentification(user.numIdentification) || !validatePhone(user.phoneNumber) || !validateEmail(user.email) || (user.email !== user.confirmEmail) || (user.password !== user.confirmPassword)) {
                return;
            }

            // Verificar que los campos requeridos están presentes al crear
            const parameters = {
                numIdentification: user.numIdentification,
                typeDoc: user.typeDoc,
                names: user.names.trim(),
                lastNames: user.lastNames.trim(),
                phoneNumber: user.phoneNumber,
                email: user.email.trim(),
                user_name: user.user_name.trim(),
                password: user.password.trim()
            }

            await UserService.register(parameters, toast, navigate)
        } catch (error) {
            console.error('Error registrando usuario:', error)
            alert('Un error ocurrió mientras se registraba el usuario')
        }
    }

    const confirmSave = (e) => {
        e.preventDefault();
        setConfirmDialogVisible(true);
    };

    const onInputChange = (e, name) => {
        inputChange(e, name, user, setUser);
        if (name === 'email') {
            setEmailValid(validateEmail(e.target.value));
        }
    };

    const onInputNumberChange = (e, name) => {
        inputNumberChange(e, name, user, setUser);
    };

    const confirmUserDialogFooter = (
        confirmDialogFooter(hideConfirmUserDialog, handleSubmit)
    );

    const typeDocOptions = Object.keys(TypeDoc).map(key => ({
        label: TypeDoc[key],
        value: key
    }));

    return (
        <div className='container auth-container mt-3 p-4 rounded-5' style={{backgroundColor: '#19191a'}}>
            <div className='d-flex align-items-center'>
                <img src={logo} className='me-3' alt="Logo" width="70px" />
                <h2 className='text-white text-center flex-grow-1 pt-2'>Registro Clientes</h2>
            </div>

            <Toast ref={toast} position="bottom-right" />
            <div className="formgrid grid mt-5">
                <div className="field col">
                    <div className="p-inputgroup flex-1">
                        <span className="p-inputgroup-addon">
                            <span className="material-symbols-outlined">id_card</span>
                        </span>
                        <FloatLabel>
                            <InputText id="names" name='names' value={user.names} onChange={(e) => onInputChange(e, 'names')} autoFocus className={classNames({ 'p-invalid': submitted && !user.names })} maxLength={50} />
                            <label htmlFor="names" className="font-bold">Nombres</label>
                        </FloatLabel>
                    </div>
                    {submitted && !user.names && <small className="p-error">Nombres son requeridos.</small>}
                </div>
                <div className="field col">
                    <div className="p-inputgroup flex-1">
                        <span className="p-inputgroup-addon">
                            <span className="material-symbols-outlined">id_card</span>
                        </span>
                        <FloatLabel>
                            <InputText id="lastNames" name='lastNames' value={user.lastNames} onChange={(e) => onInputChange(e, 'lastNames')} className={classNames({ 'p-invalid': submitted && !user.lastNames })} maxLength={60} />
                            <label htmlFor="lastNames" className="font-bold">Apellidos</label>
                        </FloatLabel>
                    </div>
                    {submitted && !user.lastNames && <small className="p-error">Apellidos son requeridos.</small>}
                </div>
            </div>
            <div className="formgrid grid mt-4">
                <div className="field col">
                    <div className="p-inputgroup flex-1">
                        <span className="p-inputgroup-addon">
                            <span className="material-symbols-outlined">badge</span>
                        </span>
                        <FloatLabel>
                            <Dropdown
                                id="typeDoc"
                                name='typeDoc'
                                value={selectedTypeId}
                                onChange={(e) => { setSelectedTypeId(e.value); onInputNumberChange(e, 'typeDoc'); }}
                                options={typeDocOptions}
                                placeholder="Seleccionar el tipo de id"
                                emptyMessage="No hay datos"
                                className={`w-full md:w-14rem rounded ${classNames({ 'p-invalid': submitted && !user.typeDoc && !selectedTypeId })}`}
                            />
                            <label htmlFor="typeDoc" className="font-bold">Tipo de Identificación</label>
                        </FloatLabel>
                    </div>
                    {submitted && !user.typeDoc && !selectedTypeId && <small className="p-error">Tipo de Identificación es requerido.</small>}
                </div>
                <div className="field col">
                    <div className="p-inputgroup flex-1">
                        <span className="p-inputgroup-addon">
                            <span className="material-symbols-outlined">badge</span>
                        </span>
                        <FloatLabel>
                            <InputNumber inputId="numIdentification" name='numIdentification' value={user.numIdentification} onChange={(e) => {
                                setNumIdValid(validateIdentification(e.value));
                                onInputNumberChange(e, 'numIdentification');
                            }} useGrouping={false} className={classNames({ 'p-invalid': submitted && !user.numIdentification })} />
                            <label htmlFor="numIdentification" className="font-bold">Número de Identificación</label>
                        </FloatLabel>
                    </div>
                    {submitted && !user.numIdentification && <small className="p-error">Número de identificación es requerido.</small>}
                    {user.numIdentification && !numIdValid && <small className="p-error">El número de identificación debe tener 8 o 10 dígitos.</small>}
                </div>
            </div>
            <div className="formgrid grid mt-4">
                <div className="field col">
                    <div className="p-inputgroup flex-1">
                        <span className="p-inputgroup-addon">
                            <span className="material-symbols-outlined">call</span>
                        </span>
                        <FloatLabel>
                            <InputNumber inputId="phoneNumber" name='phoneNumber' value={user.phoneNumber} onChange={(e) => {
                                onInputNumberChange(e, 'phoneNumber');
                                setPhoneValid(validatePhone(e.value));
                            }} useGrouping={false} className={classNames({ 'p-invalid': submitted && !user.phoneNumber })}
                            />
                            <label htmlFor="phoneNumber" className="font-bold">Número de celular</label>
                        </FloatLabel>
                    </div>
                    {submitted && !user.phoneNumber && <small className="p-error">Número de celular es requerido.</small>}
                    {user.phoneNumber && !phoneValid && <small className="p-error">El número de celular debe tener 10 dígitos.</small>}
                </div>
                <div className="field col">
                    <div className="p-inputgroup flex-1">
                        <span className="p-inputgroup-addon">
                            <span className="material-symbols-outlined">person</span>
                        </span>
                        <FloatLabel>
                            <InputText id="user_name" name='user_name' value={user.user_name} onChange={(e) => onInputChange(e, 'user_name')} className={classNames({ 'p-invalid': submitted && !user.user_name })} autoComplete="new-username" />
                            <label htmlFor="user_name" className="font-bold">Nombre de Usuario</label>
                        </FloatLabel>
                    </div>
                    {submitted && !user.user_name && <small className="p-error">Nombre de Usuario es requerida.</small>}
                </div>
            </div>
            <div className="formgrid grid mt-4">
                <div className="field col">
                    <div className="p-inputgroup flex-1">
                        <span className="p-inputgroup-addon">
                            <span className="material-symbols-outlined">mail</span>
                        </span>
                        <FloatLabel>
                            <InputText id="email" name='email' value={user.email} onChange={(e) => onInputChange(e, 'email')} className={classNames({ 'p-invalid': submitted && !user.email })} placeholder='mi_correo@micorreo.com' maxLength={50} autoComplete="new-email" />
                            <label htmlFor="email" className="font-bold">Correo Eletrónico</label>
                        </FloatLabel>
                    </div>
                    {submitted && !user.email && <small className="p-error">Correo Eletrónico es requerido.</small>}
                    {submitted && user.email && !emailValid && <small className="p-error">Correo Eletrónico no es válido.</small>}
                </div>
                <div className="field col">
                    <div className="p-inputgroup flex-1">
                        <span className="p-inputgroup-addon">
                            <span className="material-symbols-outlined">alternate_email</span>
                        </span>
                        <FloatLabel>
                            <InputText id="confirmEmail" name='confirmEmail' value={user.confirmEmail} onChange={(e) => onInputChange(e, 'confirmEmail')} className={classNames({ 'p-invalid': submitted && !user.confirmEmail })} placeholder='Confirme el correo' maxLength={50} autoComplete="new-email" />
                            <label htmlFor="confirmEmail" className="font-bold">Confirmar Correo Eletrónico</label>
                        </FloatLabel>
                    </div>
                    {submitted && !user.confirmEmail && <small className="p-error">Confirmar Correo Eletrónico es requerido.</small>}
                    {user.confirmEmail && user.email !== user.confirmEmail && <small className="p-error">Los correos electrónicos no coinciden.</small>}
                </div>
            </div>
            <div className="formgrid grid mt-4">
                <div className="field col">
                    <div className="p-inputgroup flex-1">
                        <span className="p-inputgroup-addon">
                            <span className="material-symbols-outlined">lock</span>
                        </span>
                        <FloatLabel>
                            <Password id="password" name='password' value={user.password} onChange={(e) => onInputChange(e, 'password')} toggleMask className={classNames({ 'p-invalid': submitted && !user.password })} promptLabel='Ingrese una contraseña' weakLabel='Débil' mediumLabel='Media' strongLabel='Fuerte' autoComplete="new-password" />
                            <label htmlFor="password" className="font-bold">Contraseña</label>
                        </FloatLabel>
                    </div>
                    {submitted && !user.password && <small className="p-error">Contraseña es requerido.</small>}
                </div>
                <div className="field col">
                    <div className="p-inputgroup flex-1">
                        <span className="p-inputgroup-addon">
                            <span className="material-symbols-outlined">key</span>
                        </span>
                        <FloatLabel>
                            <Password id="confirmPassword" name='confirmPassword' value={user.confirmPassword} onChange={(e) => onInputChange(e, 'confirmPassword')} toggleMask className={classNames({ 'p-invalid': submitted && !user.confirmPassword })} placeholder='Confirme la contraseña' autoComplete="new-password" feedback={false} />
                            <label htmlFor="confirmPassword" className="font-bold">Confirmar Contraseña</label>
                        </FloatLabel>
                    </div>
                    {submitted && !user.confirmPassword && <small className="p-error">Confirmar contraseña es requerido.</small>}
                    {user.confirmPassword && user.password !== user.confirmPassword && <small className="p-error">Las contraseñas no coinciden.</small>}
                </div>
            </div>
            {confirmDialog(confirmDialogVisible, 'Usuario', confirmUserDialogFooter, hideConfirmUserDialog, user, 1)}

            <div className="text-center">
                <Button label="Registrar" className='mb-2 me-5 rounded-3' severity="info" onClick={confirmSave} />
                <br />
                <span className='text-white'>¿Ya tiene una cuenta?  </span><Link to="/login" replace>Iniciar Sesión</Link>
            </div>
        </div>
    )
}
export default RegistrationPage;