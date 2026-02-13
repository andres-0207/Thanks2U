import React, { useState } from 'react';
import { Page, Student, UserSession } from './types';
import { Search, LogIn, LayoutDashboard, LogOut, Gift, Home, CheckCircle2 } from 'lucide-react';

// Components
import { Profile } from './components/Profile';
import { Dashboard } from './components/Dashboard';
import { AIChatBot } from './components/AIChatBot';

// Helper for Initials
export const getInitials = (name: string) => name.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase();

// Initial Mock Data (Updated with Colors and Posts)
const INITIAL_STUDENTS: Student[] = [
  {
    id: '1',
    name: 'Carlos Chavarría',
    major: 'Ing. en Tecnologías de la Información',
    bio: 'Apasionado por el código y la innovación. Estoy desarrollando una plataforma para conectar a zonas rurales con servicios educativos. ¡Tu apoyo impulsa la tecnología con causa!',
    profilePic: '',
    achievements: [
      { id: 'a1', title: 'Hackathon Winner 2023', icon: 'award' },
      { id: 'a2', title: 'Certificación Cloud', icon: 'book' }
    ],
    posts: [
      { id: 'p1', content: '¡Logramos la meta de ventas! Gracias a todos por creer en este proyecto. Prometo seguir esforzándome.', date: 'Hace 1 hora', likes: 45 },
      { id: 'p2', content: 'Presentando mi proyecto final de Semestre. La educación digital es el futuro.', image: 'https://images.unsplash.com/photo-1531482615713-2afd69097998?q=80&w=2940&auto=format&fit=crop', date: 'Hace 2 días', likes: 23 }
    ],
    ticketsSold: 20,
    ticketsGoal: 20,
    email: 'carlos@email.com',
    themeColor: '#0ea5e9' // Sky Blue
  },
  {
    id: '2',
    name: 'Sofía Rodríguez',
    major: 'Dirección de Empresas de Entretenimiento',
    bio: 'El arte y la cultura transforman vidas. Busco producir eventos que den voz a quienes no la tienen. Cada boleto es un paso más hacia ese escenario.',
    profilePic: '',
    achievements: [
      { id: 'b1', title: 'Mejor Producción Escolar', icon: 'star' }
    ],
    posts: [
      { id: 's1', content: 'En el backstage del evento de bienvenida. ¡Qué energía tan increíble!', image: 'https://images.unsplash.com/photo-1492684223066-81342ee5ff30?q=80&w=2940&auto=format&fit=crop', date: 'Ayer', likes: 12 },
      { id: 's2', content: 'Vendí 2 boletos más hoy. ¡Gracias familia por el apoyo!', date: 'Hace 3 días', likes: 8 }
    ],
    ticketsSold: 8,
    ticketsGoal: 10,
    email: 'sofia@email.com',
    themeColor: '#ec4899' // Pink
  },
  {
    id: '3',
    name: 'Emiliano Parra',
    major: 'Médico Cirujano',
    bio: 'La salud es un derecho, no un privilegio. Mi sueño es especializarme en cardiología y servir a mi comunidad. Ayúdame a salvar corazones.',
    profilePic: '',
    achievements: [
      { id: 'c1', title: 'Voluntariado Sierra Norte', icon: 'heart' },
      { id: 'c2', title: 'Promedio Excelencia', icon: 'award' }
    ],
    posts: [
      { id: 'e1', content: 'Jornada de salud comunitaria. Aprendiendo cada día más.', image: 'https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?q=80&w=2940&auto=format&fit=crop', date: 'Hace 1 semana', likes: 34 }
    ],
    ticketsSold: 18,
    ticketsGoal: 20,
    email: 'emiliano@email.com',
    themeColor: '#10b981' // Emerald
  },
  {
    id: '4',
    name: 'Andrés May',
    major: 'Negocios Digitales',
    bio: 'Innovando la forma en que hacemos comercio local. Estoy creando una startup para apoyar a artesanos. Apoya el emprendimiento joven.',
    profilePic: '',
    achievements: [
      { id: 'd1', title: 'Startup Weekend Finalist', icon: 'zap' }
    ],
    posts: [
        { id: 'am1', content: 'Diseñando la interfaz de nuestra nueva app para artesanos. 🎨', date: 'Hace 5 horas', likes: 15 }
    ],
    ticketsSold: 5,
    ticketsGoal: 20,
    email: 'andres@email.com',
    themeColor: '#f59e0b' // Amber
  },
  {
    id: '5',
    name: 'Eduardo Téllez',
    major: 'Finanzas y Contaduría Pública',
    bio: 'Transparencia y estrategia para un futuro mejor. Quiero asesorar a pequeñas empresas para fortalecer nuestra economía.',
    profilePic: '',
    achievements: [
      { id: 'e1', title: 'Presidente Sociedad Alumnos', icon: 'users' }
    ],
    posts: [],
    ticketsSold: 10,
    ticketsGoal: 10,
    email: 'eduardo@email.com',
    themeColor: '#8b5cf6' // Violet
  },
  {
    id: '6',
    name: 'Santiago Loredo',
    major: 'Arquitectura',
    bio: 'Diseñando espacios sostenibles que convivan con la naturaleza. Mi proyecto final es un centro comunitario ecológico.',
    profilePic: '',
    achievements: [
      { id: 'f1', title: 'Mención Honorífica Diseño', icon: 'award' }
    ],
    posts: [
      { id: 'sl1', content: 'Maqueta final lista. Materiales 100% reciclados.', image: 'https://images.unsplash.com/photo-1511818966892-d7d671e672a2?q=80&w=2942&auto=format&fit=crop', date: 'Hace 2 semanas', likes: 28 }
    ],
    ticketsSold: 4,
    ticketsGoal: 20,
    email: 'santiago@email.com',
    themeColor: '#3b82f6' // Blue
  }
];

const App: React.FC = () => {
  const [page, setPage] = useState<Page>(Page.LANDING);
  const [students, setStudents] = useState<Student[]>(INITIAL_STUDENTS);
  const [selectedStudentId, setSelectedStudentId] = useState<string | null>(null);
  const [session, setSession] = useState<UserSession | null>(null);
  const [searchQuery, setSearchQuery] = useState('');

  // Login State
  const [loginStep, setLoginStep] = useState(1);
  const [loginEmail, setLoginEmail] = useState('');

  // Helpers
  const navigateTo = (p: Page) => setPage(p);
  const getSelectedStudent = () => students.find(s => s.id === selectedStudentId);
  const getCurrentUser = () => students.find(s => s.id === session?.studentId);

  const handleStudentClick = (id: string) => {
    setSelectedStudentId(id);
    navigateTo(Page.PROFILE);
  };

  const handleUpdateStudent = (updated: Student) => {
    setStudents(prev => prev.map(s => s.id === updated.id ? updated : s));
  };

  const handleTicketPurchase = (studentId: string, amount: number) => {
    setStudents(prev => prev.map(s => {
      if (s.id === studentId) {
        // Cap at the goal to prevent overselling in this logic
        const newTotal = Math.min(s.ticketsSold + amount, s.ticketsGoal);
        return { ...s, ticketsSold: newTotal };
      }
      return s;
    }));
  };

  const handleLogin = () => {
    const user = students.find(s => s.email.toLowerCase() === loginEmail.toLowerCase());
    
    if (user) {
      setSession({ studentId: user.id, isAuthenticated: true });
      navigateTo(Page.DASHBOARD);
      setLoginStep(1);
      setLoginEmail('');
    } else {
      if (loginEmail.includes('@')) {
         alert("Correo no registrado en la demo. Iniciando sesión como Carlos Chavarría por defecto.");
         setSession({ studentId: '1', isAuthenticated: true });
         navigateTo(Page.DASHBOARD);
         setLoginStep(1);
         setLoginEmail('');
      } else {
         alert("Por favor introduce un correo válido.");
      }
    }
  };

  // --- Views ---

  const renderLanding = () => (
    <div className="min-h-screen flex items-center justify-center text-center px-6 bg-gradient-to-b from-white to-orange-50 relative overflow-hidden animate-fade-in">
      <div className="absolute top-0 left-0 w-full h-full opacity-5 pointer-events-none bg-[url('https://www.transparenttextures.com/patterns/cubes.png')]"></div>
      <div className="relative z-10 max-w-4xl mx-auto">
        <h1 className="text-5xl md:text-7xl font-black text-navy leading-tight animate-slide-up">
          Más que un boleto, <br className="hidden md:block"/> 
          una <span className="text-orange-500 relative inline-block">
            historia
            <svg className="absolute w-full h-3 -bottom-1 left-0 text-orange-200 -z-10" viewBox="0 0 100 10" preserveAspectRatio="none"><path d="M0 5 Q 50 10 100 5" stroke="currentColor" strokeWidth="8" fill="none" /></svg>
          </span>.
        </h1>
        <p className="mt-8 text-xl text-slate-600 max-w-2xl mx-auto leading-relaxed animate-slide-up" style={{ animationDelay: '0.1s' }}>
          Cada estudiante becado tiene un sueño. Descubre las historias de talento y esfuerzo detrás del Sorteo y sé parte de su éxito.
        </p>
        <button 
          onClick={() => navigateTo(Page.GALLERY)}
          className="mt-10 bg-orange-500 text-white px-10 py-4 rounded-full text-lg font-bold shadow-xl hover:bg-orange-600 hover:scale-105 transition-all flex items-center gap-2 mx-auto animate-slide-up" style={{ animationDelay: '0.2s' }}
        >
          <Search size={24} /> Descubrir Historias
        </button>
      </div>
    </div>
  );

  const renderGallery = () => {
    const filtered = students.filter(s => s.name.toLowerCase().includes(searchQuery.toLowerCase()) || s.major.toLowerCase().includes(searchQuery.toLowerCase()));
    
    return (
      <div className="container mx-auto px-6 py-12 min-h-screen animate-fade-in">
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-extrabold text-navy">Conecta con su Historia</h1>
          <p className="mt-4 text-lg text-slate-600">Tu apoyo es un voto de confianza.</p>
          
          <div className="mt-8 max-w-xl mx-auto relative">
            <input 
              type="text" 
              placeholder="Buscar por nombre o carrera..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-12 pr-6 py-4 rounded-full border border-slate-200 shadow-lg focus:ring-4 focus:ring-orange-100 outline-none text-lg transition-all"
            />
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={24} />
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
          {filtered.map((student, index) => {
            const isGoalMet = student.ticketsSold >= student.ticketsGoal;
            return (
              <div 
                key={student.id} 
                onClick={() => handleStudentClick(student.id)}
                className="bg-white rounded-3xl shadow-lg cursor-pointer group hover:-translate-y-2 transition-transform duration-300 animate-slide-up flex flex-col items-center p-8 relative overflow-hidden"
                style={{ 
                  animationDelay: `${index * 0.05}s`,
                  borderTop: `6px solid ${student.themeColor}`
                }}
              >
                {/* Goal Met Badge */}
                {isGoalMet && (
                  <div className="absolute top-3 right-3 text-green-500 animate-bounce">
                    <CheckCircle2 size={28} fill="currentColor" className="text-white" />
                  </div>
                )}

                {/* Avatar Ring */}
                <div 
                  className="w-24 h-24 rounded-full flex items-center justify-center text-white font-black text-3xl mb-4 transition-transform group-hover:scale-110 shadow-md overflow-hidden"
                  style={{ 
                    backgroundColor: student.themeColor,
                    border: `4px solid white`,
                    boxShadow: `0 0 0 2px ${student.themeColor}`
                  }}
                >
                  {student.profilePic ? (
                    <img src={student.profilePic} alt={student.name} className="w-full h-full object-cover" />
                  ) : (
                    getInitials(student.name)
                  )}
                </div>

                {/* Info */}
                <h3 className="font-bold text-xl text-navy text-center mb-1">{student.name}</h3>
                <p className="text-sm text-center font-medium opacity-80 mb-6" style={{ color: student.themeColor }}>
                  {student.major}
                </p>
                
                {/* Progress Bar */}
                <div className="w-full bg-slate-100 rounded-full h-3 mb-2 overflow-hidden shadow-inner">
                  <div 
                    className="h-full rounded-full transition-all duration-1000"
                    style={{ 
                      width: `${Math.min((student.ticketsSold / student.ticketsGoal) * 100, 100)}%`,
                      backgroundColor: student.themeColor 
                    }}
                  ></div>
                </div>
                
                <p className="text-xs text-slate-500 font-bold tracking-wide">
                  {student.ticketsSold} / {student.ticketsGoal} vendidos
                </p>
              </div>
            );
          })}
        </div>
      </div>
    );
  };

  const renderLogin = () => (
    <div className="min-h-screen flex items-center justify-center bg-slate-100 px-4 animate-fade-in">
      <div className="bg-white rounded-3xl shadow-2xl p-10 max-w-md w-full relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-2 bg-orange-500"></div>
        
        <div className="text-center mb-8">
           <div className="inline-flex items-center justify-center w-16 h-16 bg-navy text-white rounded-2xl mb-4 shadow-lg">
             <span className="font-black text-2xl">T2U</span>
           </div>
           <h2 className="text-2xl font-bold text-navy">Acceso Alumno</h2>
        </div>

        {loginStep === 1 ? (
          <div className="space-y-4 animate-slide-up">
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-1">Correo Electrónico</label>
              <input 
                type="email" 
                value={loginEmail}
                onChange={(e) => setLoginEmail(e.target.value)}
                placeholder="ejemplo@correo.com"
                className="w-full px-4 py-3 rounded-lg border border-slate-300 focus:ring-2 focus:ring-orange-500 outline-none transition-all"
              />
            </div>
            <button 
              onClick={() => setLoginStep(2)}
              disabled={!loginEmail}
              className="w-full bg-navy text-white py-3 rounded-lg font-bold hover:bg-slate-800 disabled:opacity-50 transition-colors"
            >
              Siguiente
            </button>
            <button 
              onClick={() => navigateTo(Page.LANDING)}
              className="w-full text-sm text-slate-500 hover:text-navy mt-2"
            >
              Cancelar y volver al inicio
            </button>
          </div>
        ) : (
          <div className="space-y-4 animate-slide-up">
             <div>
              <label className="block text-sm font-semibold text-slate-700 mb-1">Contraseña</label>
              <input 
                type="password" 
                placeholder="••••••••"
                className="w-full px-4 py-3 rounded-lg border border-slate-300 focus:ring-2 focus:ring-orange-500 outline-none transition-all"
              />
            </div>
            <button 
              onClick={handleLogin}
              className="w-full bg-orange-500 text-white py-3 rounded-lg font-bold hover:bg-orange-600 transition-colors"
            >
              Entrar al Dashboard
            </button>
            <button onClick={() => setLoginStep(1)} className="w-full text-sm text-slate-500 hover:text-navy">
              Volver
            </button>
          </div>
        )}
      </div>
    </div>
  );

  return (
    <div className="font-sans text-slate-900 bg-slate-50 min-h-screen flex flex-col">
      {/* Navigation */}
      {page !== Page.LOGIN && (
        <header className="bg-white/90 backdrop-blur-md shadow-sm sticky top-0 z-40 transition-all">
          <nav className="container mx-auto px-6 py-4 flex justify-between items-center">
            <div 
              className="flex items-center gap-3 cursor-pointer group"
              onClick={() => navigateTo(Page.LANDING)}
            >
              {/* Custom Logo T2U - ONLY LOGO, NO TEXT */}
              <div className="relative w-12 h-12 flex items-center justify-center transform group-hover:scale-110 transition-transform">
                <span className="text-4xl font-black text-navy tracking-tighter" style={{ fontFamily: 'Inter' }}>T<span className="text-orange-500">2</span>U</span>
                <div className="absolute top-1 right-0 flex gap-0.5">
                   <div className="w-1.5 h-1.5 bg-navy rounded-full"></div>
                   <div className="w-1.5 h-1.5 bg-navy rounded-full"></div>
                </div>
              </div>
            </div>
            
            <div className="flex items-center gap-4">
              <button 
                onClick={() => navigateTo(Page.LANDING)} 
                className="text-slate-600 hover:text-navy p-2 md:hidden"
                aria-label="Inicio"
              >
                <Home size={24} />
              </button>

              {session?.isAuthenticated ? (
                <>
                  <button onClick={() => navigateTo(Page.GALLERY)} className="text-slate-600 hover:text-navy font-medium hidden md:block transition-colors">Ver Perfiles</button>
                  <button onClick={() => navigateTo(Page.DASHBOARD)} className="flex items-center gap-2 bg-navy text-white px-4 py-2 rounded-lg font-bold shadow-md hover:bg-slate-800 transition-all hover:shadow-lg">
                    <LayoutDashboard size={18} /> <span className="hidden sm:inline">Dashboard</span>
                  </button>
                  <button onClick={() => setSession(null)} className="text-slate-400 hover:text-red-500 transition-colors" title="Cerrar Sesión">
                    <LogOut size={20} />
                  </button>
                </>
              ) : (
                <>
                  {page !== Page.GALLERY && (
                    <button onClick={() => navigateTo(Page.GALLERY)} className="text-slate-600 hover:text-navy font-medium hidden md:block transition-colors">
                      Explorar
                    </button>
                  )}
                  <button 
                    onClick={() => navigateTo(Page.LOGIN)}
                    className="flex items-center gap-2 text-navy font-bold hover:text-orange-600 transition-colors border border-slate-200 px-4 py-2 rounded-lg hover:border-orange-500"
                  >
                    <LogIn size={18} /> <span className="hidden sm:inline">Acceso Alumno</span>
                  </button>
                </>
              )}
            </div>
          </nav>
        </header>
      )}

      {/* Main Content */}
      <main className="flex-grow">
        {page === Page.LANDING && renderLanding()}
        {page === Page.GALLERY && renderGallery()}
        {page === Page.PROFILE && selectedStudentId && getSelectedStudent() && (
          <div className="relative animate-fade-in">
             <div className="container mx-auto px-6 pt-6">
                <button 
                  onClick={() => navigateTo(Page.GALLERY)} 
                  className="flex items-center gap-2 text-slate-500 hover:text-navy transition-colors mb-4 font-medium"
                >
                  ← Volver a la Galería
                </button>
             </div>
             <Profile 
                student={getSelectedStudent()!} 
                onPurchase={(amount) => handleTicketPurchase(selectedStudentId, amount)}
             />
          </div>
        )}
        {page === Page.LOGIN && renderLogin()}
        {page === Page.DASHBOARD && session && getCurrentUser() && (
          <div className="container mx-auto px-6 py-12 animate-fade-in">
            <h1 className="text-3xl font-bold text-navy mb-8">Hola, <span className="text-orange-500">{getCurrentUser()!.name.split(' ')[0]}</span></h1>
            <Dashboard student={getCurrentUser()!} onUpdateStudent={handleUpdateStudent} />
          </div>
        )}
      </main>

      {/* Global AI Chatbot */}
      <AIChatBot />

      {/* Footer */}
      {page !== Page.LOGIN && (
        <footer className="bg-navy text-slate-300 py-12 border-t border-slate-800">
          <div className="container mx-auto px-6 text-center">
            <div className="flex items-center justify-center gap-2 mb-4">
               <Gift className="text-orange-500" />
               <span className="text-white font-bold text-xl">Thanks2U</span>
            </div>
            <p className="text-sm opacity-60">© 2026 Thanks2U Platform. Todos los derechos reservados.</p>
          </div>
        </footer>
      )}
    </div>
  );
};

export default App;