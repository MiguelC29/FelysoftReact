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

function RegistrationPage() {

    const navigate = useNavigate();

    const emptyUser = useState({
        numIdentification: '',
        typeDoc: '',
        names: '',
        lastNames: '',
        address: '',
        phoneNumber: '',
        gender: '',
        email: '',
        user_name: '',
        password: ''
    });

    const TypeDoc = {
        CC: 'Cédula de Ciudadania',
        TI: 'Tarjeta de Identidad',
        CE: 'Cédula de Extranjeria'
    };

    const Gender = {
        FEMENINO: 'FEMENINO',
        MASCULINO: 'MASCULINO'
    };

    const [user, setUser] = useState(emptyUser);
    const [selectedTypeId, setSelectedTypeId] = useState(null);
    const [selectedGender, setSelectedGender] = useState(null);
    const [confirmDialogVisible, setConfirmDialogVisible] = useState(false);
    const [submitted, setSubmitted] = useState(false);
    const toast = useRef(null);

    const hideConfirmUserDialog = () => {
        setConfirmDialogVisible(false);
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
                user.address.trim() &&
                user.phoneNumber &&
                user.email.trim() &&
                user.gender &&
                user.user_name.trim() &&
                user.password.trim();

            // Mostrar mensaje de error si algún campo requerido falta
            if (!isValid) {
                toast.current.show({ severity: 'error', summary: 'Error', detail: 'Por favor complete todos los campos requeridos', life: 3000 });
                return;
            }

            // Verificar que los campos requeridos están presentes al crear
            const parameters = {
                numIdentification: user.numIdentification,
                typeDoc: user.typeDoc,
                names: user.names.trim(),
                lastNames: user.lastNames.trim(),
                address: user.address.trim(),
                phoneNumber: user.phoneNumber,
                email: user.email.trim(),
                gender: user.gender,
                user_name: user.user_name.trim(),
                password: user.password.trim(),
                role: "CUSTOMER"
            }

            await UserService.register(parameters, toast, () => setUser(emptyUser), navigate)
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

    const genderOptions = Object.keys(Gender).map(key => ({
        label: Gender[key],
        value: key
    }));

    const onPasswordChange = (e) => {
        const val = (e.target && e.target.value) || '';
        let _user = { ...user };
        _user.password = val;
        setUser(_user);
    };


    return (
        <div className='container auth-container bg-black mt-3 p-4 rounded-5'>
            <h2 className='text-white text-center pt-2'>Registro Clientes</h2>
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
                                placeholder="Seleccionar el tipo de identificación"
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
                            <InputNumber inputId="numIdentification" name='numIdentification' value={user.numIdentification} onChange={(e) => onInputNumberChange(e, 'numIdentification')} useGrouping={false} maxLength={10} className={classNames({ 'p-invalid': submitted && !user.numIdentification })} />
                            <label htmlFor="numIdentification" className="font-bold">Número de Identificación</label>
                        </FloatLabel>
                    </div>
                    {submitted && !user.numIdentification && <small className="p-error">Número de identificación es requerido.</small>}
                </div>
            </div>
            <div className="formgrid grid mt-4">
                <div className="field col">
                    <div className="p-inputgroup flex-1">
                        <span className="p-inputgroup-addon">
                            <span className="material-symbols-outlined">wc</span>
                        </span>
                        <FloatLabel>
                            <Dropdown
                                id="gender"
                                name='gender'
                                value={selectedGender}
                                onChange={(e) => { setSelectedGender(e.value); onInputNumberChange(e, 'gender'); }}
                                options={genderOptions}
                                placeholder="Seleccionar el género"
                                emptyMessage="No hay datos"

                                className={`w-full md:w-14rem rounded ${classNames({ 'p-invalid': submitted && !user.gender && !selectedGender })}`}
                            />
                            <label htmlFor="gender" className="font-bold">Género</label>
                        </FloatLabel>
                    </div>
                    {submitted && !user.gender && !selectedGender && <small className="p-error">Tipo de Identificación es requerido.</small>}
                </div>
                <div className="field col">
                    <div className="p-inputgroup flex-1">
                        <span className="p-inputgroup-addon">
                            <span className="material-symbols-outlined">call</span>
                        </span>
                        <FloatLabel>
                            <InputNumber inputId="phoneNumber" name='phoneNumber' value={user.phoneNumber} onValueChange={(e) => onInputNumberChange(e, 'phoneNumber')} useGrouping={false} maxLength={10} className={classNames({ 'p-invalid': submitted && !user.phoneNumber })} />
                            <label htmlFor="phoneNumber" className="font-bold block mb-2">Número de celular</label>
                        </FloatLabel>
                    </div>
                    {submitted && !user.phoneNumber && <small className="p-error">Número de celular es requerido.</small>}
                </div>
            </div>
            <div className="formgrid grid mt-4">
                <div className="field col">
                    <div className="p-inputgroup flex-1">
                        <span className="p-inputgroup-addon">
                            <span className="material-symbols-outlined">home</span>
                        </span>
                        <FloatLabel>
                            <InputText id="address" name='address' value={user.address} onChange={(e) => onInputChange(e, 'address')} className={classNames({ 'p-invalid': submitted && !user.address })} maxLength={50} />
                            <label htmlFor="address" className="font-bold">Dirección</label>
                        </FloatLabel>
                    </div>
                    {submitted && !user.address && <small className="p-error">Dirección es requerida.</small>}
                </div>
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
                </div>
            </div>
            <div className="formgrid grid mt-4">
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
                <div className="field col">
                    <div className="p-inputgroup flex-1">
                        <span className="p-inputgroup-addon">
                            <span className="material-symbols-outlined">key</span>
                        </span>
                        <FloatLabel>
                            <Password id="password" name='password' value={user.password} onChange={onPasswordChange} toggleMask className={classNames({ 'p-invalid': submitted && !user.password })} promptLabel='Ingrese una contraseña' weakLabel='Débil' mediumLabel='Media' strongLabel='Fuerte' autoComplete="new-password" />
                            <label htmlFor="password" className="font-bold">Contraseña</label>
                        </FloatLabel>
                    </div>
                    {submitted && !user.password && <small className="p-error">Contraseña es requerido.</small>}
                </div>
            </div>
            {confirmDialog(confirmDialogVisible, 'Usuario', confirmUserDialogFooter, hideConfirmUserDialog, user, 1)}

            <div className="text-center">
                <Button label="Registrar" className='mb-2 me-5 rounded-3' severity="info" onClick={confirmSave} />
                {/* <Button label="Iniciar sesión" className='rounded-3' severity="warning" onClick={() => navigate("/login")} /> */}
                <br />
                <span className='text-white'>¿Ya tiene una cuenta?  </span><Link to="/login" replace>Iniciar Sesión</Link>
            </div>
        </div>
    )
}
export default RegistrationPage;