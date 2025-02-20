"use client";

import { useStore } from '@nanostores/react';
import { currentLang } from '../../i18n/store'; 
import { useState } from 'react';

import { translations } from '../../i18n/translations';

const ContactForm = () => {
  const lang = useStore(currentLang); // Obtiene el idioma actual

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: '',
  });

  const [responseMessage, setResponseMessage] = useState<string | null>(null);

  // Manejar cambio en los inputs
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // Manejar envío del formulario
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      const result = await response.json();
      setResponseMessage(result.message || result.error);

      // Limpiar formulario tras el envío exitoso
      if (response.ok) {
        setFormData({ name: '', email: '', message: '' });
      }
    } catch (error) {
      console.error('Error:', error);
      setResponseMessage('Something went wrong');
    }
  };

  return (
    <section id="contact" className="py-20">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <h2 className="text-3xl font-bold mb-4">{translations.contact.title[lang]}</h2>
          <p className="text-gray-600 dark:text-gray-400 mb-12">{translations.contact.subtitle[lang]}</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-medium mb-2">{translations.contact.form.name[lang]}</label>
            <input
              type="text"
              name="name"
              required
              value={formData.name}
              onChange={handleChange}
              className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 focus:ring-2 focus:ring-primary-light dark:focus:ring-primary-dark focus:border-transparent"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">{translations.contact.form.email[lang]}</label>
            <input
              type="email"
              name="email"
              required
              value={formData.email}
              onChange={handleChange}
              className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 focus:ring-2 focus:ring-primary-light dark:focus:ring-primary-dark focus:border-transparent"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">{translations.contact.form.message[lang]}</label>
            <textarea
              name="message"
              rows={4}
              required
              value={formData.message}
              onChange={handleChange}
              className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 focus:ring-2 focus:ring-primary-light dark:focus:ring-primary-dark focus:border-transparent"
            ></textarea>
          </div>

          <button
            type="submit"
            className="w-full px-8 py-3 border bg-[color:var(--color-primary)] text-white dark:bg-[color:var(--color-primary-dark)] rounded-lg hover:opacity-90 transition-opacity"
          >
            {translations.contact.form.submit[lang]}
          </button>
        </form>

        {responseMessage && <div className="mt-4 text-green-500">{responseMessage}</div>}
      </div>
    </section>
  );
};

export default ContactForm;
