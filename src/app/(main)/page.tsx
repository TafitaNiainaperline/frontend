import Link from 'next/link';

const courses = [
  { title: 'JavaScript Moderne', category: 'Web', level: 'Débutant', duration: '12h', students: 1240, videoId: 'hdI2bqOjy3c' },
  { title: 'React & Next.js', category: 'Frontend', level: 'Intermédiaire', duration: '18h', students: 980, videoId: 'w7ejDZ8SWv8' },
  { title: 'Node.js & API REST', category: 'Backend', level: 'Intermédiaire', duration: '15h', students: 760, videoId: 'fBNz5xF-Kx4' },
  { title: 'UI/UX Design', category: 'Design', level: 'Débutant', duration: '10h', students: 620, videoId: 'c9Wg6Cb_YlU' },
  { title: 'Python pour la Data', category: 'Data', level: 'Débutant', duration: '20h', students: 1540, videoId: 'rfscVS0vtbw' },
  { title: 'DevOps & CI/CD', category: 'DevOps', level: 'Avancé', duration: '14h', students: 430, videoId: 'PL9mngl3ITU' },
];

const categories = [
  { name: 'Développement Web', count: 24 },
  { name: 'Design', count: 12 },
  { name: 'Data Science', count: 18 },
  { name: 'Mobile', count: 9 },
  { name: 'DevOps', count: 7 },
  { name: 'Marketing', count: 11 },
];

const testimonials = [
  { name: 'Sophie M.', role: 'Développeuse Junior', text: 'Grâce à Inarako, j\'ai décroché mon premier emploi en développement web en 6 mois seulement.' },
  { name: 'Thomas K.', role: 'Designer UX', text: 'Les cours sont clairs, bien structurés et les certificats sont reconnus par les recruteurs.' },
  { name: 'Amina B.', role: 'Data Analyst', text: 'La progression par niveau m\'a permis d\'avancer à mon rythme sans jamais me sentir dépassée.' },
];

const techs = ['JavaScript', 'React', 'Python', 'Node.js', 'TypeScript', 'Figma', 'Docker', 'SQL', 'Next.js', 'TailwindCSS', 'JavaScript', 'React', 'Python', 'Node.js', 'TypeScript', 'Figma', 'Docker', 'SQL', 'Next.js', 'TailwindCSS'];

export default function HomePage() {
  return (
    <div className="bg-gray-950 text-white">

      {/* ── HERO ── */}
      <section className="relative overflow-hidden bg-gray-950 pt-20 pb-16 px-6">

        {/* Glow background */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[700px] h-[400px] bg-primary-500/10 rounded-full blur-[120px] pointer-events-none" />
        <div className="absolute top-20 right-10 w-72 h-72 bg-primary-400/5 rounded-full blur-[80px] pointer-events-none animate-pulse" />

        {/* Decorative ring */}
        <div className="absolute top-10 right-10 w-64 h-64 border border-white/5 rounded-full animate-spin-slow pointer-events-none hidden lg:block" />
        <div className="absolute top-20 right-20 w-44 h-44 border border-primary-500/10 rounded-full animate-spin-slow pointer-events-none hidden lg:block" style={{ animationDirection: 'reverse', animationDuration: '8s' }} />

        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">

            {/* Left */}
            <div>
              <div className="inline-flex items-center gap-2 bg-primary-500/10 border border-primary-500/20 text-primary-400 text-xs font-semibold px-4 py-2 rounded-full mb-6 animate-fade-up">
                <span className="w-1.5 h-1.5 bg-primary-400 rounded-full animate-pulse" />
                Plateforme d'apprentissage en ligne
              </div>

              <h1 className="text-5xl lg:text-6xl font-black leading-[1.1] mb-6 animate-fade-up delay-100">
                Formez-vous aux<br />
                métiers du<br />
                <span className="text-primary-400">numérique</span>
              </h1>

              <p className="text-gray-400 text-base leading-relaxed max-w-lg mb-8 animate-fade-up delay-200">
                Inarako vous propose des cours vidéo, des quiz interactifs et des certificats reconnus — pour acquérir de nouvelles compétences et faire évoluer votre carrière, à votre rythme.
              </p>

              <div className="flex gap-4 flex-wrap animate-fade-up delay-300">
                <Link href="/register" className="bg-primary-500 text-white font-bold px-8 py-3.5 rounded-full hover:bg-primary-400 transition-all hover:shadow-lg hover:shadow-primary-500/25 flex items-center gap-2">
                  Commencer gratuitement
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                  </svg>
                </Link>
                <Link href="/courses" className="border border-white/10 text-gray-300 font-semibold px-8 py-3.5 rounded-full hover:bg-white/5 transition-all">
                  Voir les cours
                </Link>
              </div>

              <div className="flex items-center gap-6 mt-10 animate-fade-up delay-400">
                <div className="flex -space-x-2">
                  {['S', 'T', 'A', 'M'].map((l, i) => (
                    <div key={i} className="w-8 h-8 rounded-full bg-gradient-to-br from-primary-400 to-primary-700 border-2 border-gray-950 flex items-center justify-center text-xs font-bold">
                      {l}
                    </div>
                  ))}
                </div>
                <div>
                  <div className="text-sm font-semibold text-white">+5 000 apprenants</div>
                  <div className="text-xs text-gray-500">nous font confiance</div>
                </div>
                <div className="flex items-center gap-1 ml-2">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <svg key={i} className="w-3.5 h-3.5 fill-yellow-400 text-yellow-400" viewBox="0 0 20 20">
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                  ))}
                  <span className="text-xs text-gray-400 ml-1">4.9/5</span>
                </div>
              </div>
            </div>

            {/* Right — floating cards */}
            <div className="hidden lg:block relative h-96 animate-fade-right delay-200">
              <div className="absolute top-4 left-8 bg-gray-900 border border-white/10 rounded-2xl p-5 shadow-2xl animate-float">
                <div className="text-2xl font-black text-primary-400">5 000+</div>
                <div className="text-sm text-gray-400 mt-1">Apprenants inscrits</div>
              </div>
              <div className="absolute bottom-0 right-4 bg-primary-500 rounded-2xl p-5 shadow-2xl animate-float delay-300 animate-pulse-glow">
                <div className="text-2xl font-black text-white">80+</div>
                <div className="text-sm text-primary-100 mt-1">Cours disponibles</div>
              </div>
              <div className="absolute top-1/2 -translate-y-1/2 right-16 bg-gray-900 border border-white/10 rounded-2xl p-5 shadow-2xl animate-float delay-200">
                <div className="text-2xl font-black text-white">98%</div>
                <div className="text-sm text-gray-400 mt-1">Satisfaction</div>
              </div>
              <div className="absolute bottom-4 left-4 bg-gray-800 border border-white/5 rounded-2xl p-4 shadow-xl animate-float delay-400">
                <div className="text-xs text-gray-400 mb-1">Certificat délivré</div>
                <div className="text-sm font-bold text-white">React & Next.js</div>
                <div className="text-xs text-primary-400 mt-1">Sophie M.</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── SCROLLING TECH BAND ── */}
      <div className="border-y border-white/5 bg-gray-900/50 py-4 overflow-hidden">
        <div className="flex animate-scroll-x whitespace-nowrap">
          {techs.map((t, i) => (
            <span key={i} className="text-gray-500 text-sm font-semibold mx-8 hover:text-primary-400 transition-colors cursor-default">
              {t}
            </span>
          ))}
        </div>
      </div>

      {/* ── STATS ── */}
      <section className="border-b border-white/5 py-12 px-6">
        <div className="max-w-5xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
          {[
            { value: '5 000+', label: 'Apprenants actifs' },
            { value: '80+',    label: 'Cours disponibles' },
            { value: '30+',    label: 'Instructeurs experts' },
            { value: '2 500+', label: 'Certificats délivrés' },
          ].map(({ value, label }) => (
            <div key={label} className="animate-fade-up">
              <div className="text-3xl font-black text-primary-400">{value}</div>
              <div className="text-sm text-gray-500 mt-2">{label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* ── ABOUT ── */}
      <section className="max-w-6xl mx-auto px-6 py-24">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
          <div className="animate-fade-left">
            <p className="text-primary-400 text-xs font-bold uppercase tracking-widest mb-4">À propos d'Inarako</p>
            <h2 className="text-4xl font-black leading-tight mb-6">
              Une plateforme pensée<br />pour <span className="text-primary-400">votre réussite</span>
            </h2>
            <p className="text-gray-400 leading-relaxed mb-5">
              Inarako est née d'une conviction simple : <strong className="text-white">chaque personne mérite d'accéder à une éducation de qualité</strong>, peu importe son niveau ou son emploi du temps. Nous réunissons des instructeurs passionnés et des apprenants motivés.
            </p>
            <p className="text-gray-400 leading-relaxed mb-8">
              Nos cours sont conçus par des experts du secteur, validés par des professionnels en activité et structurés pour vous faire progresser efficacement — de la théorie à la pratique.
            </p>
            <div className="flex gap-4 flex-wrap">
              <Link href="/about" className="bg-primary-500 text-white font-bold px-7 py-3.5 rounded-full hover:bg-primary-400 transition-all hover:shadow-lg hover:shadow-primary-500/25">
                En savoir plus
              </Link>
              <Link href="/courses" className="border border-white/10 text-gray-300 font-semibold px-7 py-3.5 rounded-full hover:bg-white/5 transition-all">
                Explorer les cours
              </Link>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4 animate-fade-right">
            {[
              { title: 'Fondée en 2022', desc: 'Née de la passion de rendre l\'apprentissage accessible à tous.' },
              { title: '30+ instructeurs', desc: 'Des experts actifs en entreprise, reconnus dans leur domaine.' },
              { title: 'Certifications', desc: 'Nos certificats sont valorisés par les recruteurs et entreprises.' },
              { title: 'Flexible', desc: 'Apprenez à votre rythme, depuis n\'importe quel appareil.' },
            ].map(({ title, desc }) => (
              <div key={title} className="bg-gray-900 border border-white/5 rounded-2xl p-6 hover:border-primary-500/30 hover:bg-gray-800 transition-all group">
                <div className="w-1.5 h-1.5 bg-primary-400 rounded-full mb-4" />
                <h3 className="font-bold text-white mb-2 group-hover:text-primary-400 transition-colors">{title}</h3>
                <p className="text-sm text-gray-500 leading-relaxed">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CATEGORIES ── */}
      <section className="border-t border-white/5 px-6 py-20">
        <div className="max-w-6xl mx-auto">
          <div className="flex items-end justify-between mb-10">
            <div>
              <p className="text-primary-400 text-xs font-bold uppercase tracking-widest mb-3">Domaines</p>
              <h2 className="text-3xl font-black">Explorez par catégorie</h2>
            </div>
            <Link href="/courses" className="text-primary-400 text-sm font-semibold hover:underline hidden md:block">
              Voir tout
            </Link>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {categories.map(({ name, count }) => (
              <Link key={name} href="/courses"
                className="bg-gray-900 border border-white/5 rounded-2xl p-5 text-center hover:border-primary-500/40 hover:bg-gray-800 transition-all group">
                <div className="text-sm font-bold text-gray-300 group-hover:text-primary-400 transition-colors leading-snug">{name}</div>
                <div className="text-xs text-gray-600 mt-2">{count} cours</div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ── COURSES ── */}
      <section className="bg-gray-900/50 border-y border-white/5 px-6 py-20">
        <div className="max-w-6xl mx-auto">
          <div className="flex items-end justify-between mb-10">
            <div>
              <p className="text-primary-400 text-xs font-bold uppercase tracking-widest mb-3">Populaires</p>
              <h2 className="text-3xl font-black">Cours les plus suivis</h2>
            </div>
            <Link href="/courses" className="text-primary-400 text-sm font-semibold hover:underline hidden md:block">
              Voir tout
            </Link>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {courses.map(({ title, category, level, duration, students, videoId }) => (
              <div key={title} className="bg-gray-900 border border-white/5 rounded-2xl overflow-hidden hover:border-primary-500/30 hover:shadow-xl hover:shadow-primary-500/5 transition-all hover:-translate-y-1 group">
                <div className="relative w-full" style={{ paddingTop: '56.25%' }}>
                  <iframe
                    className="absolute inset-0 w-full h-full"
                    src={`https://www.youtube.com/embed/${videoId}?rel=0&modestbranding=1`}
                    title={title}
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                  />
                </div>
                <div className="p-5">
                  <div className="flex items-center justify-between mb-2">
                    <span className="bg-primary-500/10 border border-primary-500/20 text-primary-400 text-xs font-bold px-3 py-1 rounded-full">{category}</span>
                  </div>
                  <h3 className="font-bold text-white mb-3 group-hover:text-primary-400 transition-colors">{title}</h3>
                  <div className="flex items-center justify-between text-xs text-gray-500 font-medium">
                    <span className="bg-gray-800 px-2.5 py-1 rounded-full text-gray-400">{level}</span>
                    <span>{duration}</span>
                    <span>{students.toLocaleString()} étudiants</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── WHY US ── */}
      <section className="max-w-6xl mx-auto px-6 py-24">
        <div className="text-center mb-16">
          <p className="text-primary-400 text-xs font-bold uppercase tracking-widest mb-3">Nos avantages</p>
          <h2 className="text-3xl font-black">Pourquoi choisir Inarako ?</h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
          {[
            { title: 'Cours vidéo HD', desc: 'Des cours couvrant le développement, le design et bien plus.', num: '01' },
            { title: 'Suivi en temps réel', desc: 'De débutant à avancé, suivez votre avancement à chaque étape.', num: '02' },
            { title: 'Certificats reconnus', desc: 'Des certificats vérifiables à partager sur LinkedIn.', num: '03' },
            { title: 'Communauté active', desc: 'Des milliers d\'apprenants et d\'instructeurs experts.', num: '04' },
          ].map(({ title, desc, num }) => (
            <div key={title} className="group bg-gray-900 border border-white/5 rounded-2xl p-7 hover:border-primary-500/30 hover:bg-gray-800 transition-all">
              <div className="text-5xl font-black text-white/5 group-hover:text-primary-500/20 transition-colors mb-5 leading-none">{num}</div>
              <h3 className="font-bold text-white mb-3 group-hover:text-primary-400 transition-colors">{title}</h3>
              <p className="text-sm text-gray-500 leading-relaxed">{desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── TESTIMONIALS ── */}
      <section className="border-t border-white/5 bg-gray-900/30 px-6 py-24">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-14">
            <p className="text-primary-400 text-xs font-bold uppercase tracking-widest mb-3">Témoignages</p>
            <h2 className="text-3xl font-black">Ce que disent nos apprenants</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {testimonials.map(({ name, role, text }) => (
              <div key={name} className="bg-gray-900 border border-white/5 rounded-2xl p-7 hover:border-primary-500/20 transition-all">
                <div className="flex gap-1 mb-5">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <svg key={i} className="w-4 h-4 fill-yellow-400 text-yellow-400" viewBox="0 0 20 20">
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                  ))}
                </div>
                <p className="text-gray-400 text-sm leading-relaxed mb-6">"{text}"</p>
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-full bg-gradient-to-br from-primary-400 to-primary-700 flex items-center justify-center text-xs font-black">
                    {name.charAt(0)}
                  </div>
                  <div>
                    <div className="font-bold text-white text-sm">{name}</div>
                    <div className="text-gray-500 text-xs">{role}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA ── */}
      <section className="px-6 py-24 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-primary-500/10 via-transparent to-transparent pointer-events-none" />
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-96 h-48 bg-primary-500/10 blur-[80px] rounded-full pointer-events-none" />
        <div className="max-w-2xl mx-auto text-center relative">
          <p className="text-primary-400 text-xs font-bold uppercase tracking-widest mb-4">Rejoignez-nous</p>
          <h2 className="text-4xl font-black mb-5">Prêt à commencer ?</h2>
          <p className="text-gray-400 mb-10 text-base leading-relaxed">
            Rejoignez Inarako et accédez à des dizaines de cours dès maintenant. Inscription gratuite, sans engagement.
          </p>
          <div className="flex gap-4 justify-center flex-wrap">
            <Link href="/register" className="bg-primary-500 text-white font-bold px-10 py-4 rounded-full hover:bg-primary-400 transition-all hover:shadow-xl hover:shadow-primary-500/30 flex items-center gap-2">
              S'inscrire gratuitement
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M17 8l4 4m0 0l-4 4m4-4H3" />
              </svg>
            </Link>
            <Link href="/courses" className="border border-white/10 text-gray-300 font-semibold px-10 py-4 rounded-full hover:bg-white/5 transition-all">
              Voir les cours
            </Link>
          </div>
        </div>
      </section>

    </div>
  );
}
