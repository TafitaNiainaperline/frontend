'use client';
import { useState } from 'react';
import { Mail, MapPin, Phone, Send } from 'lucide-react';
import toast from 'react-hot-toast';

export default function ContactPage() {
  const [form, setForm] = useState({ name: '', email: '', subject: '', message: '' });
  const [loading, setLoading] = useState(false);

  const set = (field: string) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) =>
    setForm((f) => ({ ...f, [field]: e.target.value }));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    await new Promise((r) => setTimeout(r, 1000));
    toast.success('Message envoyé ! Nous vous répondrons sous 24h.');
    setForm({ name: '', email: '', subject: '', message: '' });
    setLoading(false);
  };

  return (
    <div>
      {/* Hero */}
      <section className="bg-gradient-to-br from-primary-600 to-primary-700 text-white py-20 px-4 text-center">
        <h1 className="text-4xl font-bold mb-4">Contactez-nous</h1>
        <p className="text-primary-100 text-lg max-w-xl mx-auto">
          Une question, une suggestion ou besoin d'aide ? Notre équipe vous répond rapidement.
        </p>
      </section>

      <section className="max-w-6xl mx-auto px-4 py-16">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">

          {/* Infos */}
          <div className="space-y-6">
            <h2 className="text-xl font-bold mb-6">Nos coordonnées</h2>
            {[
              { icon: Mail, label: 'Email', value: 'support@learnplatform.fr' },
              { icon: Phone, label: 'Téléphone', value: '+33 1 23 45 67 89' },
              { icon: MapPin, label: 'Adresse', value: '12 rue de l\'Innovation, 75001 Paris' },
            ].map(({ icon: Icon, label, value }) => (
              <div key={label} className="flex items-start gap-4">
                <div className="w-10 h-10 bg-primary-50 rounded-xl flex items-center justify-center flex-shrink-0">
                  <Icon className="w-5 h-5 text-primary-600" />
                </div>
                <div>
                  <div className="text-sm font-medium text-gray-500">{label}</div>
                  <div className="text-gray-900 mt-0.5">{value}</div>
                </div>
              </div>
            ))}

            <div className="card p-5 mt-8 bg-primary-50 border-primary-100">
              <h3 className="font-semibold text-primary-800 mb-2">Horaires du support</h3>
              <p className="text-sm text-primary-700">Lun – Ven : 9h – 18h</p>
              <p className="text-sm text-primary-700">Sam : 10h – 14h</p>
              <p className="text-sm text-primary-500 mt-2">Réponse sous 24h en moyenne</p>
            </div>
          </div>

          {/* Form */}
          <div className="lg:col-span-2">
            <h2 className="text-xl font-bold mb-6">Envoyer un message</h2>
            <form onSubmit={handleSubmit} className="card p-8 space-y-5">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <div>
                  <label className="text-sm font-medium text-gray-700 block mb-1">Nom complet</label>
                  <input className="input" value={form.name} onChange={set('name')} required placeholder="Jean Dupont" />
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-700 block mb-1">Email</label>
                  <input type="email" className="input" value={form.email} onChange={set('email')} required placeholder="vous@exemple.com" />
                </div>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-700 block mb-1">Sujet</label>
                <select className="input" value={form.subject} onChange={set('subject')} required>
                  <option value="">Choisir un sujet</option>
                  <option>Question sur un cours</option>
                  <option>Problème technique</option>
                  <option>Facturation</option>
                  <option>Devenir instructeur</option>
                  <option>Autre</option>
                </select>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-700 block mb-1">Message</label>
                <textarea
                  className="input resize-none"
                  rows={5}
                  value={form.message}
                  onChange={set('message')}
                  required
                  placeholder="Décrivez votre question ou problème..."
                />
              </div>
              <button type="submit" className="btn-primary w-full py-3 flex items-center justify-center gap-2" disabled={loading}>
                <Send className="w-4 h-4" />
                {loading ? 'Envoi en cours...' : 'Envoyer le message'}
              </button>
            </form>
          </div>
        </div>
      </section>
    </div>
  );
}
