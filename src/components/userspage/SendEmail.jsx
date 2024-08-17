import React, { useState } from 'react';
import axios from 'axios';

const EmailSender = () => {
  const [to, setTo] = useState('');
  const [subject, setSubject] = useState('');
  const [text, setText] = useState('');
  const [message, setMessage] = useState('');

  const handleSendEmail = async () => {
    try {
        const response = await axios.post('http://localhost:8086/api/email/send', {
            to,
            subject,
            text,
          });
      setMessage(response.data);
    } catch (error) {
      setMessage('Error al enviar el correo: ' + error.response?.data || error.message);
    }
  };
 
  

  return (
    <div>
      <h2>Enviar Correo</h2>
      <div>
        <label>
          Para:
          <input
            type="email"
            value={to}
            onChange={(e) => setTo(e.target.value)}
            required
          />
        </label>
      </div>
      <div>
        <label>
          Asunto:
          <input
            type="text"
            value={subject}
            onChange={(e) => setSubject(e.target.value)}
            required
          />
        </label>
      </div>
      <div>
        <label>
          Mensaje:
          <textarea
            value={text}
            onChange={(e) => setText(e.target.value)}
            required
          />
        </label>
      </div>
      <button onClick={handleSendEmail}>Enviar</button>
      {message && <p>{message}</p>}
    </div>
  );
};

export default EmailSender;
