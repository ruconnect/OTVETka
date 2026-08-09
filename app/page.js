'use client';
import { useState } from 'react';

export default function Home() {
  const [formData, setFormData] = useState({ fullName: '', street: '', houseNumber: '' });
  const [status, setStatus] = useState({ loading: false, message: '', error: false });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus({ loading: true, message: '', error: false });

    try {
      const response = await fetch('/api/save', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (response.ok) {
        setStatus({ loading: false, message: 'Данные успешно отправлены!', error: false });
        setFormData({ fullName: '', street: '', houseNumber: '' }); // Очистка формы
      } else {
        setStatus({ loading: false, message: data.error || 'Что-то пошло не так', error: true });
      }
    } catch (err) {
      setStatus({ loading: false, message: 'Ошибка сети. Попробуйте позже.', error: true });
    }
  };

  return (
    <main style={{ maxWidth: '400px', margin: '50px auto', padding: '20px', fontFamily: 'sans-serif' }}>
      <h2>Заполнение данных</h2>
      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
        <div>
          <label style={{ display: 'block', marginBottom: '5px' }}>ФИО:</label>
          <input
            type="text"
            name="fullName"
            value={formData.fullName}
            onChange={handleChange}
            required
            style={{ width: '100%', padding: '8px', boxSizing: 'border-box' }}
          />
        </div>

        <div>
          <label style={{ display: 'block', marginBottom: '5px' }}>Улица:</label>
          <input
            type="text"
            name="street"
            value={formData.street}
            onChange={handleChange}
            required
            style={{ width: '100%', padding: '8px', boxSizing: 'border-box' }}
          />
        </div>

        <div>
          <label style={{ display: 'block', marginBottom: '5px' }}>Номер дома:</label>
          <input
            type="text"
            name="houseNumber"
            value={formData.houseNumber}
            onChange={handleChange}
            required
            style={{ width: '100%', padding: '8px', boxSizing: 'border-box' }}
          />
        </div>

        <button type="submit" disabled={status.loading} style={{ padding: '10px', cursor: 'pointer' }}>
          {status.loading ? 'Сохранение...' : 'Отправить'}
        </button>
      </form>

      {status.message && (
        <p style={{ marginTop: '20px', color: status.error ? 'red' : 'green', fontWeight: 'bold' }}>
          {status.message}
        </p>
      )}
    </main>
  );
}
