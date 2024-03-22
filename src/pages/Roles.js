import React, { useEffect, useState } from 'react'
import axios from 'axios'
import { getData, modalDelte, sendRequest, show_alert } from '../functions'

export default function Roles() {
    // TODO: nos falta hacer una logica, para si el registro ya marca como eliminado, y yo quiero agregar de nuevo esa categoria, la quite de eliminada - esto aplica para los campos unicos como rol
    const URL = 'http://localhost:8086/api/role/';
    const [roles, setRoles] = useState([]);
    const [id, setId] = useState('');
    const [name, setName] = useState('');
    const [operation, setOperation] = useState(1);
    const [title, setTitle] = useState('');

    useEffect(() => {
        getData(URL, setRoles);
    }, []);

    const openModal = (op, id, name) => {
        setId('');
        setName('');
        setOperation(op);
        switch (op) {
            case 1:
                setTitle('Registrar Rol');
                break;
            case 2:
                setTitle('Editar Rol');
                setId(id);
                setName(name);
                break;
            default:
                break;
        }
        window.setTimeout(() => { document.getElementById('nombre').focus(); }, 500);
    }

    // const openModal = (op, id, name) => {
    //     openModals(op, id, name, setId, setName, setOperation, setTitle, 'Rol','nombre');
    // }

    const validate = () => {
        let parameters;
        let method;
        let url;

        if (name.trim() === '') {
            show_alert('Escribe el nombre del rol', 'warning');
        } else {
            if (operation === 1) {
                parameters = { name: name.trim() };
                url = URL + 'create';
                method = 'POST';
            } else {
                parameters = { idRole: id, name: name.trim() };
                url = URL + 'update/' + id;
                method = 'PUT';
            }
            sendRequest(method, parameters, url, setRoles, URL);
        }
    }

    const deleteRole = (id, name) => {
        modalDelte('el rol', name, setId, id, setRoles, URL);
    }

    return (
        <div className="App">
            <div className="container-fluid">
                <div className="row mt-3">
                    <div className="col-md-4 offset-md-4">
                        <div className="d-grid mx-auto">
                            <button onClick={() => openModal(1)} className='btn btn-dark' data-bs-toggle='modal' data-bs-target='#modalRoles'>
                                <i className='fa-solid fa-circle-plus'></i> Añadir
                            </button>
                        </div>
                    </div>
                </div>
                <div className="row mt-3">
                    <div className="col-12 col-lg-8 offset-0 offset-lg-2">
                        <div className="table-responsive">
                            <table className='table table-bordered'>
                                <thead>
                                    <tr>
                                        <th>#</th>
                                        <th>ROL</th>
                                        <th>ACCIONES</th>
                                    </tr>
                                </thead>
                                <tbody className='table-group-divider'>
                                    {roles.map((role, i) => (
                                        <tr key={role.idRole}>
                                            <td>{(i + 1)}</td>
                                            <td>{role.name}</td>
                                            <td>
                                                <button onClick={() => openModal(2, role.idRole, role.name)} className='btn btn-warning' data-bs-toggle='modal' data-bs-target='#modalRoles'>
                                                    <i className='fa-solid fa-edit'></i>
                                                </button>
                                                &nbsp;
                                                <button onClick={() => deleteRole(role.idRole, role.name)} className='btn btn-danger'>
                                                    <i className='fa-solid fa-trash'></i>
                                                </button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </div>
            <div id='modalRoles' className="modal fade" aria-hidden='true'>
                <div className="modal-dialog">
                    <div className="modal-content">
                        <div className="modal-header">
                            <label className="h5">{title}</label>
                            <button type='button' id='btnCerrar' className="btn-close" data-bs-dismiss='modal' aria-label='Close'></button>
                        </div>
                        <div className="modal-body">
                            <input type="hidden" id="id" />
                            <div className="input-group mb-3">
                                <span className="input-group-text"><i className="fa-solid fa-gift"></i></span>
                                <input type="text" id='nombre' className='form-control' placeholder='Nombre' value={name} onChange={(e) => setName(e.target.value)} />
                            </div>
                            <div onClick={() => validate()} className="d-grid col-6 mx-auto">
                                <button className='btn btn-success'>
                                    <i className='fa-solid fa-floppy-disk'></i> Guardar
                                </button>
                            </div>
                        </div>
                        <div className="modal-footer">
                            {/* <button type='button' id='btnCerrar' className='btn btn-secondary' data-bs-dismiss='modal'>Cerrar</button> */}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}