import React, { useState } from 'react';
import { Student } from '../types';
import { Award, BookOpen, Clock, PartyPopper, Share2, Check } from 'lucide-react';
import { SlotMachine } from './SlotMachine';

interface ProfileProps {
  student: Student;
  onPurchase: (amount: number) => void;
}

// Helper duplicated to avoid complex imports in this setup
const getInitials = (name: string) => name.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase();

export const Profile: React.FC<ProfileProps> = ({ student, onPurchase }) => {
  const [showModal, setShowModal] = useState(false);
  const [selectedTickets, setSelectedTickets] = useState<string[]>([]);
  const [isCopied, setIsCopied] = useState(false);
  
  // Key to force re-render of SlotMachine to allow repeat purchases
  const [slotKey, setSlotKey] = useState(0);

  const progress = Math.min((student.ticketsSold / student.ticketsGoal) * 100, 100);
  const isGoalMet = student.ticketsSold >= student.ticketsGoal;
  const remainingTickets = student.ticketsGoal - student.ticketsSold;

  const handleSlotComplete = (tickets: string[]) => {
    setSelectedTickets(tickets);
    setShowModal(true);
  };

  const closeModal = () => setShowModal(false);
  
  const confirmPurchase = () => {
      onPurchase(selectedTickets.length);
      alert(`¡Compra exitosa! Has apoyado a ${student.name} con ${selectedTickets.length} boleto(s).`);
      setShowModal(false);
      setSlotKey(prev => prev + 1); // Reset slot machine
  };

  const handleShare = () => {
      const url = window.location.href; // In a real app this would be the specific profile URL
      navigator.clipboard.writeText(url);
      setIsCopied(true);
      setTimeout(() => setIsCopied(false), 2000);
  };

  return (
    <div className="container mx-auto px-6 pb-12 pt-4 max-w-6xl">
      <div className="bg-white rounded-2xl shadow-xl p-8 md:flex gap-10 border border-slate-100">
        
        {/* Left Column: Identity */}
        <div className="text-center md:text-left md:w-1/3 flex-shrink-0">
          {/* Avatar */}
          <div className="w-40 h-40 mx-auto md:mx-0 rounded-full p-1" style={{ background: `linear-gradient(to top right, ${student.themeColor}, #fbbf24)` }}>
            <div className="w-full h-full rounded-full bg-white flex items-center justify-center border-4 border-white shadow-inner overflow-hidden" style={{ color: student.themeColor }}>
               {student.profilePic ? (
                 <img src={student.profilePic} alt={student.name} className="w-full h-full object-cover" />
               ) : (
                 <span className="text-5xl font-black">{getInitials(student.name)}</span>
               )}
            </div>
          </div>
          
          <h2 className="text-3xl font-extrabold mt-4 text-navy">{student.name}</h2>
          <p className="font-semibold text-lg flex items-center justify-center md:justify-start gap-2" style={{ color: student.themeColor }}>
            <BookOpen size={18} /> {student.major}
          </p>

          <div className="mt-8 bg-slate-50 p-4 rounded-xl border border-slate-200">
            <h3 className="font-bold text-slate-700 text-sm uppercase tracking-wide mb-2">Progreso de Beca</h3>
            <div className="w-full bg-slate-200 rounded-full h-3">
              <div 
                className="h-3 rounded-full transition-all duration-1000 ease-out" 
                style={{ width: `${progress}%`, backgroundColor: student.themeColor }}
              ></div>
            </div>
            <p className="text-sm mt-2 text-slate-600 flex justify-between">
              <span className="font-bold text-navy">{student.ticketsSold} vendidos</span>
              <span className="text-slate-400">Meta: {student.ticketsGoal}</span>
            </p>
          </div>
          
          {/* Share Section for Buyer */}
          <div className="mt-6 p-4 border border-slate-200 rounded-xl bg-white shadow-sm">
             <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wide mb-2">Ayuda compartiendo</h3>
             <button 
               onClick={handleShare}
               className="w-full flex items-center justify-center gap-2 py-2 px-4 rounded-lg text-slate-600 hover:text-navy hover:bg-slate-50 transition-colors border border-dashed border-slate-300"
             >
                {isCopied ? <Check size={18} className="text-green-500"/> : <Share2 size={18} />}
                <span className="font-medium">{isCopied ? "¡Enlace Copiado!" : "Compartir este perfil"}</span>
             </button>
          </div>

          <div className="mt-8 text-left">
            <h3 className="text-xl font-bold text-navy border-b-2 pb-2 mb-4" style={{ borderColor: `${student.themeColor}33` }}>Mis Logros</h3>
            <div className="space-y-3">
              {student.achievements.length > 0 ? student.achievements.map(ach => (
                <div key={ach.id} className="flex items-center gap-3 text-slate-700 bg-white p-2 rounded-lg shadow-sm border border-slate-50">
                  <div style={{ color: student.themeColor }}><Award size={20} /></div>
                  <span className="font-medium text-sm">{ach.title}</span>
                </div>
              )) : (
                 <p className="text-slate-400 text-sm italic">Sin logros registrados aún.</p>
              )}
            </div>
          </div>
        </div>

        {/* Right Column: Story & Slot Machine */}
        <div className="md:w-2/3 mt-8 md:mt-0 flex flex-col">
          <div className="mb-8">
            <h3 className="text-2xl font-bold text-navy mb-3">Sobre mí</h3>
            <p className="text-slate-600 whitespace-pre-line text-lg leading-relaxed font-light">
              {student.bio}
            </p>
          </div>

          {/* Slot Machine Area or Goal Reached Message */}
          <div className="mb-10">
            {isGoalMet ? (
              <div className="bg-gradient-to-r from-green-50 to-emerald-50 border border-green-100 rounded-2xl p-8 text-center shadow-inner">
                <div className="w-20 h-20 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-4 animate-bounce">
                  <PartyPopper size={40} />
                </div>
                <h3 className="text-3xl font-black text-green-700 mb-2">¡Meta Cumplida!</h3>
                <p className="text-green-800 text-lg">
                  Gracias a tu apoyo y al de muchos otros, <span className="font-bold">{student.name}</span> ha completado su recaudación.
                  <br />¡Eres parte de esta historia de éxito!
                </p>
              </div>
            ) : (
              <SlotMachine 
                 key={slotKey} 
                 onComplete={handleSlotComplete} 
                 maxTickets={remainingTickets} 
              />
            )}
          </div>

          {/* Timeline / Bitácora */}
          <div>
            <h3 className="text-2xl font-bold text-navy border-b-2 pb-2 mb-6 flex items-center gap-2" style={{ borderColor: `${student.themeColor}33` }}>
              <Clock size={24} style={{ color: student.themeColor }} /> Mi Bitácora
            </h3>
            <div className="space-y-8 relative before:absolute before:left-4 before:top-0 before:h-full before:w-0.5 before:bg-slate-200">
              {student.posts.length > 0 ? student.posts.map(post => (
                <div key={post.id} className="pl-12 relative">
                  {/* Timeline Avatar (Small Initials) */}
                  <div className="absolute left-0 top-0 w-8 h-8 rounded-full border-2 border-white shadow-sm flex items-center justify-center z-10" style={{ backgroundColor: student.themeColor }}>
                    <span className="text-[10px] font-bold text-white">{getInitials(student.name)}</span>
                  </div>
                  <div className="bg-white p-5 rounded-2xl shadow-sm border border-slate-100 hover:shadow-md transition-shadow">
                    <p className="text-xs text-slate-400 font-bold mb-2 uppercase tracking-wider">{post.date}</p>
                    <p className="text-slate-700 mb-3">{post.content}</p>
                    {post.image && (
                      <img src={post.image} alt="Post content" className="w-full rounded-xl object-cover max-h-80" />
                    )}
                  </div>
                </div>
              )) : (
                <div className="pl-12 text-slate-500 italic">No hay publicaciones recientes.</div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Redirect Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm animate-fade-in">
          <div className="bg-white rounded-2xl shadow-2xl p-8 text-center max-w-md mx-auto relative m-4">
            <button 
              onClick={closeModal}
              className="absolute top-4 right-4 text-slate-400 hover:text-slate-600"
            >✕</button>
            <div className="mx-auto bg-slate-50 rounded-full h-16 w-16 flex items-center justify-center mb-4">
               <Award size={32} style={{ color: student.themeColor }} />
            </div>
            <h2 className="text-2xl font-bold text-navy">¡Gracias por apoyar a <span style={{ color: student.themeColor }}>{student.name}</span>!</h2>
            <p className="mt-2 text-slate-600">Simulación de pago seguro. Al hacer clic, se confirmará tu apoyo.</p>
            
            <div className="mt-6 bg-slate-50 p-4 rounded-xl border border-slate-200">
              <p className="text-xs text-slate-500 uppercase font-bold tracking-wider">Boletos Seleccionados</p>
              <div className="flex flex-wrap justify-center gap-2 mt-2">
                {selectedTickets.map(t => (
                  <span key={t} className="font-mono font-bold text-navy bg-white px-2 py-1 rounded border border-slate-300 shadow-sm">{t}</span>
                ))}
              </div>
            </div>

            <button 
              onClick={confirmPurchase}
              className="mt-6 w-full text-white py-3 rounded-xl font-bold hover:opacity-90 transition-all shadow-lg"
              style={{ backgroundColor: student.themeColor }}
            >
              Ir a Pagar Seguro
            </button>
          </div>
        </div>
      )}
    </div>
  );
};