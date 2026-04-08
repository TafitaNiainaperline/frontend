import { BookOpen, Users, Award, Target } from 'lucide-react';

export default function AboutPage() {
  return (
    <div>
      {/* Hero */}
      <section className="bg-gradient-to-br from-primary-600 to-primary-700 text-white py-20 px-4 text-center">
        <h1 className="text-4xl font-bold mb-4">À propos de LearnPlatform</h1>
        <p className="text-primary-100 text-lg max-w-2xl mx-auto">
          Notre mission est de rendre l'apprentissage accessible à tous, partout et à tout moment.
        </p>
      </section>

      {/* Mission */}
      <section className="max-w-4xl mx-auto px-4 py-16 text-center">
        <h2 className="text-2xl font-bold mb-4">Notre mission</h2>
        <p className="text-gray-600 leading-relaxed text-lg">
          LearnPlatform est une plateforme d'apprentissage en ligne fondée avec une conviction simple :
          tout le monde mérite d'accéder à une éducation de qualité. Nous réunissons des instructeurs
          passionnés et des apprenants motivés pour créer une communauté d'apprentissage dynamique.
        </p>
      </section>

      {/* Values */}
      <section className="bg-green-50 py-16 px-4">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-2xl font-bold text-center mb-12">Nos valeurs</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { icon: Target, title: 'Excellence', desc: 'Des cours créés et vérifiés par des experts reconnus dans leur domaine.', color: 'bg-primary-50 text-primary-600' },
              { icon: Users, title: 'Communauté', desc: 'Un environnement bienveillant pour apprendre ensemble et progresser.', color: 'bg-green-50 text-green-600' },
              { icon: BookOpen, title: 'Accessibilité', desc: 'Des contenus adaptés à tous les niveaux, du débutant à l\'expert.', color: 'bg-yellow-50 text-yellow-600' },
              { icon: Award, title: 'Reconnaissance', desc: 'Des certificats valorisés par les recruteurs et les entreprises.', color: 'bg-purple-50 text-purple-600' },
            ].map(({ icon: Icon, title, desc, color }) => (
              <div key={title} className="card p-6 text-center">
                <div className={`w-14 h-14 rounded-2xl flex items-center justify-center mx-auto mb-4 ${color}`}>
                  <Icon className="w-7 h-7" />
                </div>
                <h3 className="font-semibold mb-2">{title}</h3>
                <p className="text-sm text-gray-500 leading-relaxed">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Team */}
      <section className="max-w-5xl mx-auto px-4 py-16">
        <h2 className="text-2xl font-bold text-center mb-12">Notre équipe</h2>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-8">
          {[
            { name: 'Marie Laurent', role: 'Fondatrice & CEO', initials: 'ML' },
            { name: 'David Chen', role: 'Directeur Technique', initials: 'DC' },
            { name: 'Fatima Ndiaye', role: 'Responsable Contenu', initials: 'FN' },
          ].map(({ name, role, initials }) => (
            <div key={name} className="card p-6 text-center">
              <div className="w-20 h-20 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-primary-600 font-bold text-xl">{initials}</span>
              </div>
              <h3 className="font-semibold text-gray-900">{name}</h3>
              <p className="text-sm text-gray-500 mt-1">{role}</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
