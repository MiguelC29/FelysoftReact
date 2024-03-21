import React, { useEffect, useState } from 'react'
import axios from 'axios'
import { modalDelete, show_alert } from '../functions'

export default function Genres() {
  const URL = "http://localhost:8086/api/author/";
  const [authors, setAuthors] = useState([]);
  const [id, setId] = useState('');
  const [name, setName] = useState('');
  const [dateBirth, setDateBirth] = useState('');
  const [nationality, setNationality] = useState('');
  const [biography, setBiography] = useState('');
  const [operation, setOperation] = useState(1);
  const [title, setTitle] = useState('');

      useEffect(() => {
          getAuthors();
      }, []);
  
      const getAuthors = async () => {
          await axios.get(URL + 'all')
              .then((response) => {
                  setAuthors(response.data.data);
              })
      }
  
      const openModal = (op, id, name, dateBirth, nationality, biography) => {
        setId('');
        setName('');
        setDateBirth('');
        setNationality('');
        setBiography('');
        setOperation(op);
        switch (op) {
            case 1:
                setTitle('Registrar Autor');
                break;
            case 2:
                setTitle('Editar Autor');
                setId(id);
                setName(name);
                setDateBirth(dateBirth);
                setNationality(nationality);
                setBiography(biography);
                break;
            default:
                break;
        }
        window.setTimeout(() => { document.getElementById('nombre').focus(); }, 500);
    }
    
  
      const validate = () => {
        let parameters;
        let method;
        let url;
    
        if (name.trim() === '') {
            show_alert('Escribe el nombre del Author', 'warning');
        } else if (dateBirth.trim() === '') {
            show_alert('Escribe la Fecha de Nacimiento del autor', 'warning');
        } else if (nationality.trim() === '') {
            show_alert('Escribe la Nacionalidad del autor', 'warning');
        } else if (biography.trim() === '') {
            show_alert('Escribe la Biografia del autor', 'warning');
        } else {
            if (operation === 1) {
                parameters = { name: name.trim(), dateBirth: dateBirth.trim(), nationality: nationality.trim(), biography: biography.trim() };
                url = URL + 'create';
                method = 'POST';
            } else {
                parameters = { idAuthor: id, name: name.trim(), dateBirth: dateBirth.trim(), nationality: nationality.trim(), biography: biography.trim() };
                url = URL + 'update/' + id;
                method = 'PUT';
            }
            sendRequest(method, parameters, url);
        }
    }
  
      const sendRequest = (method, parameters, url) => {
          axios({ method: method, url: url, data: parameters }).then((response) => {
              let type = response.data['status'];
              let msg = response.data['data'];
              show_alert(msg, type);
              if (type === 'success') {
                  document.getElementById('btnCerrar').click();
                  getAuthors();
              }
          })
              .catch((error) => {
                  show_alert('Error en la solicitud', 'error');
                  console.log(error);
              });
      }
  
      const deleteAuthor = (id, name,) => {
        modalDelete('el Autor', name, setId, id, sendRequest, URL);
    }
    
  
      return (
          <div className="App">
              <div className="container-fluid">
                  <div className="row mt-3">
                      <div className="col-md-4 offset-md-4">
                          <div className="d-grid mx-auto">
                              <button onClick={() => openModal(1)} className='btn btn-dark' data-bs-toggle='modal' data-bs-target='#modalAuthors'>
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
                                          <th>AUTOR</th>
                                          <th>FECHA DE NACIMIENTO</th>
                                          <th>NACIONALIDAD</th>
                                          <th>BIOGRAFIA</th>
                                          <th>ACCIONES</th>
                                      </tr>
                                  </thead>
                                  <tbody className='table-group-divider'>
                                      {authors.map((author, i) => (
                                          <tr key={author.idAuthor}>
                                              <td>{(i + 1)}</td>
                                              <td>{author.name}</td>
                                              <td>{author.dateBirth}</td>
                                              <td>{author.nationality}</td>
                                              <td>{author.biography}</td>
                                              <td>
                                                  <button onClick={() => openModal(2, author.idAuthor, author.name, author.dateBirth,author.nationality,author.biography)} className='btn btn-warning' data-bs-toggle='modal' data-bs-target='#modalAuthors'>
                                                      <i className='fa-solid fa-edit'></i>
                                                  </button>
                                                  &nbsp;
                                                  <button onClick={() => deleteAuthor(author.idAuthor, author.name, author.dateBirth,author.nationality,author.biography)} className='btn btn-danger'>
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
              <div id='modalAuthors' className="modal fade" aria-hidden='true'>
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
                                    <input type="text" id='nombre' className='form-control' placeholder='Nombre' value={name} onChange={(e) => setName(e.target.value)} required />
                                    <input type="text" id='fechaNacimiento' className='form-control' placeholder='Fecha de Nacimiento' value={dateBirth} onChange={(e) => setDateBirth(e.target.value)} required />
                                    <input type="text" id='nacionalidad' className='form-control' placeholder='Nacionalidad' value={nationality} onChange={(e) => setNationality(e.target.value)} required />
                                    <input type="text" id='biografia' className='form-control' placeholder='Biografia' value={biography} onChange={(e) => setBiography(e.target.value)} required />
                                </div>
                                <div onClick={() => validate()} className="d-grid col-6 mx-auto">
                                    <button className='btn btn-success'>
                                        <i className='fa-solid fa-floppy-disk'></i> Guardar
                                    </button>
                                </div>
                            </div>
                          <div className="modal-footer">
                          </div>
                      </div>
                  </div>
              </div>
          </div>
      )
  }
