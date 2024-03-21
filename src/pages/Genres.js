import React, { useEffect, useState } from 'react'
import axios from 'axios'
import { modalDelete, show_alert } from '../functions'

export default function Genres() {
  const URL = "http://localhost:8086/api/genre/";
  const [genres, setGenres] = useState([]);
  const [id, setId] = useState('');
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [operation, setOperation] = useState(1);
  const [title, setTitle] = useState('');

      useEffect(() => {
          getGenres();
      }, []);
  
      const getGenres = async () => {
          await axios.get(URL + 'all')
              .then((response) => {
                  setGenres(response.data.data);
              })
      }
  
      const openModal = (op, id, name,description) => {
          setId('');
          setName('');
          setDescription('');
          setOperation(op);
          switch (op) {
              case 1:
                  setTitle('Registrar Género');
                  break;
              case 2:
                  setTitle('Editar Género');
                  setId(id);
                  setName(name);
                  setDescription(description);
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
            show_alert('Escribe el nombre del Género', 'warning');
        } else if (description.trim() === '') {
            show_alert('Escribe la descripción del Género', 'warning');
        } else {
            if (operation === 1) {
                parameters = { name: name.trim(), description: description.trim() };
                url = URL + 'create';
                method = 'POST';
            } else {
                parameters = { idGenre: id, name: name.trim(), description: description.trim() };
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
                  getGenres();
              }
          })
              .catch((error) => {
                  show_alert('Error en la solicitud', 'error');
                  console.log(error);
              });
      }
  
      const deleteGenre = (id, name,) => {
        modalDelete('el Género', name, setId, id, sendRequest, URL);
    }
    
  
      return (
          <div className="App">
              <div className="container-fluid">
                  <div className="row mt-3">
                      <div className="col-md-4 offset-md-4">
                          <div className="d-grid mx-auto">
                              <button onClick={() => openModal(1)} className='btn btn-dark' data-bs-toggle='modal' data-bs-target='#modalGenres'>
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
                                          <th>GENERO</th>
                                          <th>DESCRIPCIÓN</th>
                                          <th>ACCIONES</th>
                                      </tr>
                                  </thead>
                                  <tbody className='table-group-divider'>
                                      {genres.map((genre, i) => (
                                          <tr key={genre.idGenre}>
                                              <td>{(i + 1)}</td>
                                              <td>{genre.name}</td>
                                              <td>{genre.description}</td>
                                              <td>
                                                  <button onClick={() => openModal(2, genre.idGenre, genre.name, genre.description)} className='btn btn-warning' data-bs-toggle='modal' data-bs-target='#modalGenres'>
                                                      <i className='fa-solid fa-edit'></i>
                                                  </button>
                                                  &nbsp;
                                                  <button onClick={() => deleteGenre(genre.idGenre, genre.name, genre.description)} className='btn btn-danger'>
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
              <div id='modalGenres' className="modal fade" aria-hidden='true'>
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
                                  <input type="text" id='descripcion' className='form-control' placeholder='Descripcion' value={description} onChange={(e) => setDescription(e.target.value)} />
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
