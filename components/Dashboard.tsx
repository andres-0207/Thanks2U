import React, { useState, useRef, useEffect } from 'react';
import { Student, Post, Achievement } from '../types';
import { Image as ImageIcon, Send, Share2, Edit2, BrainCircuit, Sparkles, Camera, Check, Trash2, Plus, Star, Heart, Award, Book, Zap, Users, X } from 'lucide-react';
import { generateBioWithThinking, analyzeImageForCaption } from '../services/geminiService';

interface DashboardProps {
  student: Student;
  onUpdateStudent: (updated: Student) => void;
}

// Helper duplicated for Dashboard
const getInitials = (name: string) => name.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase();

// Icon mapping helper
const IconMap: Record<string, React.ReactNode> = {
  'award': <Award size={18} />,
  'star': <Star size={18} />,
  'heart': <Heart size={18} />,
  'zap': <Zap size={18} />,
  'book': <Book size={18} />,
  'users': <Users size={18} />
};

export const Dashboard: React.FC<DashboardProps> = ({ student, onUpdateStudent }) => {
  const [newPostContent, setNewPostContent] = useState('');
  const [newPostImage, setNewPostImage] = useState<string | null>(null);
  const [tempBio, setTempBio] = useState(student.bio);
  const [isCopied, setIsCopied] = useState(false);
  const [saveStatus, setSaveStatus] = useState<'idle' | 'saving' | 'saved'>('idle');
  
  // Achievement State
  const [newAchievementTitle, setNewAchievementTitle] = useState('');
  const [newAchievementIcon, setNewAchievementIcon] = useState('award');

  // AI States
  const [isThinking, setIsThinking] = useState(false);
  const [isAnalyzingImg, setIsAnalyzingImg] = useState(false);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const profilePicRef = useRef<HTMLInputElement>(null);

  // Sync tempBio when student prop changes
  useEffect(() => {
    setTempBio(student.bio);
  }, [student.bio]);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>, isProfile: boolean) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const result = reader.result as string;
        if (isProfile) {
            onUpdateStudent({ ...student, profilePic: result });
        } else {
            setNewPostImage(result);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleCreatePost = () => {
    if (!newPostContent.trim()) return;
    const newPost: Post = {
      id: Date.now().toString(),
      content: newPostContent,
      image: newPostImage || undefined,
      date: new Date().toLocaleDateString(),
      likes: 0
    };
    onUpdateStudent({ ...student, posts: [newPost, ...student.posts] });
    setNewPostContent('');
    setNewPostImage(null);
  };

  const handleDeletePost = (postId: string) => {
    if (window.confirm('¿Estás seguro de eliminar esta publicación?')) {
      onUpdateStudent({ ...student, posts: student.posts.filter(p => p.id !== postId) });
    }
  };

  const handleAddAchievement = () => {
    if (!newAchievementTitle.trim()) return;
    const newAch: Achievement = {
      id: Date.now().toString(),
      title: newAchievementTitle,
      icon: newAchievementIcon
    };
    onUpdateStudent({ ...student, achievements: [...student.achievements, newAch] });
    setNewAchievementTitle('');
  };

  const handleDeleteAchievement = (achId: string) => {
    onUpdateStudent({ ...student, achievements: student.achievements.filter(a => a.id !== achId) });
  };

  const handleSaveBio = () => {
    setSaveStatus('saving');
    // Simulate network delay
    setTimeout(() => {
        onUpdateStudent({ ...student, bio: tempBio });
        setSaveStatus('saved');
        setTimeout(() => setSaveStatus('idle'), 2000);
    }, 600);
  };

  const handleAIBio = async () => {
    setIsThinking(true);
    const improvedBio = await generateBioWithThinking(tempBio, student.major, student.name);
    if (improvedBio) setTempBio(improvedBio);
    setIsThinking(false);
  };

  const handleAIImageAnalysis = async () => {
    if (!newPostImage) return;
    setIsAnalyzingImg(true);
    const caption = await analyzeImageForCaption(newPostImage);
    if (caption) setNewPostContent(prev => (prev ? prev + "\n\n" + caption : caption));
    setIsAnalyzingImg(false);
  };

  const generateQRCodeUrl = (data: string) => {
    return `https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=${encodeURIComponent(data)}`;
  };

  const handleCopyLink = () => {
    navigator.clipboard.writeText(`https://thanks2u.app/student/${student.id}`);
    setIsCopied(true);
    setTimeout(() => setIsCopied(false), 2000);
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
      {/* Left Column: Profile & Share */}
      <div className="lg:col-span-1 space-y-6">
        
        {/* Profile Card */}
        <div className="bg-white p-6 rounded-2xl shadow-lg border border-slate-100">
          <h3 className="text-xl font-bold text-navy mb-4 flex items-center gap-2">
            <Edit2 size={20} className="text-orange-500" /> Editar Perfil
          </h3>
          <div className="text-center relative group">
            <div className="w-32 h-32 mx-auto rounded-full overflow-hidden border-4 border-navy bg-navy flex items-center justify-center relative cursor-pointer"
                 onClick={() => profilePicRef.current?.click()}
            >
               {student.profilePic ? (
                  <img src={student.profilePic} alt="Profile" className="w-full h-full object-cover" />
               ) : (
                  <span className="text-4xl font-black text-white">{getInitials(student.name)}</span>
               )}
               
               {/* Overlay for uploading */}
               <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                   <Camera className="text-white" size={32} />
               </div>
            </div>
            <input type="file" ref={profilePicRef} className="hidden" accept="image/*" onChange={(e) => handleImageUpload(e, true)} />
            <p className="text-xs text-slate-500 mt-2">Click en la imagen para cambiar foto</p>
          </div>

          <div className="mt-6">
            <div className="flex justify-between items-center mb-2">
              <label className="font-semibold text-slate-700">Tu Historia (Bio)</label>
              <button 
                onClick={handleAIBio}
                disabled={isThinking}
                className="text-xs bg-indigo-100 text-indigo-700 px-2 py-1 rounded flex items-center gap-1 hover:bg-indigo-200 transition-colors"
              >
                <BrainCircuit size={12} />
                {isThinking ? 'Pensando...' : 'Mejorar con IA'}
              </button>
            </div>
            {/* Added bg-white and text-slate-900 to ensure high contrast */}
            <textarea 
              className="w-full p-3 border border-slate-300 rounded-lg text-sm bg-white text-slate-900 focus:ring-2 focus:ring-orange-500 outline-none shadow-sm"
              rows={5}
              value={tempBio}
              onChange={(e) => setTempBio(e.target.value)}
            />
            <button 
              onClick={handleSaveBio}
              disabled={saveStatus !== 'idle'}
              className={`w-full mt-3 py-2 rounded-lg font-semibold transition-all flex items-center justify-center gap-2
                ${saveStatus === 'saved' ? 'bg-green-500 text-white' : 'bg-navy text-white hover:bg-slate-800'}
              `}
            >
              {saveStatus === 'saving' && 'Guardando...'}
              {saveStatus === 'saved' && <><Check size={18} /> ¡Guardado!</>}
              {saveStatus === 'idle' && 'Guardar Cambios'}
            </button>
          </div>
        </div>

        {/* Achievements Card (New Feature) */}
        <div className="bg-white p-6 rounded-2xl shadow-lg border border-slate-100">
           <h3 className="text-xl font-bold text-navy mb-4 flex items-center gap-2">
             <Award size={20} className="text-orange-500" /> Editar Logros
           </h3>
           
           <div className="space-y-2 mb-4">
             {student.achievements.map(ach => (
               <div key={ach.id} className="flex justify-between items-center bg-slate-50 p-3 rounded-lg border border-slate-100">
                 <div className="flex items-center gap-3 text-slate-700">
                   <span className="text-orange-500">{IconMap[ach.icon] || <Award size={18} />}</span>
                   <span className="text-sm font-medium">{ach.title}</span>
                 </div>
                 <button onClick={() => handleDeleteAchievement(ach.id)} className="text-slate-400 hover:text-red-500 transition-colors">
                   <X size={16} />
                 </button>
               </div>
             ))}
             {student.achievements.length === 0 && <p className="text-xs text-slate-400 italic text-center">Añade tus premios o reconocimientos.</p>}
           </div>

           <div className="flex gap-2 items-center">
             <div className="relative">
               <select 
                 value={newAchievementIcon} 
                 onChange={(e) => setNewAchievementIcon(e.target.value)}
                 className="appearance-none bg-slate-100 border border-slate-200 text-slate-700 py-2 pl-3 pr-8 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 cursor-pointer"
               >
                 <option value="award">Premio</option>
                 <option value="star">Estrella</option>
                 <option value="heart">Voluntariado</option>
                 <option value="book">Académico</option>
                 <option value="zap">Proyecto</option>
                 <option value="users">Liderazgo</option>
               </select>
               <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-slate-500">
                  <span className="text-xs">▼</span>
               </div>
             </div>
             
             <input 
               type="text"
               value={newAchievementTitle}
               onChange={(e) => setNewAchievementTitle(e.target.value)}
               placeholder="Título..."
               className="flex-1 bg-white border border-slate-300 rounded-lg px-3 py-2 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-orange-500"
               onKeyDown={(e) => e.key === 'Enter' && handleAddAchievement()}
             />
             
             <button 
               onClick={handleAddAchievement}
               className="bg-navy text-white p-2 rounded-lg hover:bg-slate-800 transition-colors"
             >
               <Plus size={20} />
             </button>
           </div>
        </div>

        {/* Share Card */}
        <div className="bg-white p-6 rounded-2xl shadow-lg border border-slate-100">
          <h3 className="text-xl font-bold text-navy mb-4 flex items-center gap-2">
            <Share2 size={20} className="text-orange-500" /> Compartir
          </h3>
          <div className="flex flex-col items-center">
            <img 
              src={generateQRCodeUrl(`https://thanks2u.app/student/${student.id}`)} 
              alt="QR Code" 
              className="rounded-lg shadow-md mb-4"
            />
            <p className="text-sm text-slate-500 text-center mb-4">Escanea para ver tu perfil público</p>
            <button 
              onClick={handleCopyLink}
              className="text-orange-500 font-semibold text-sm hover:underline flex items-center gap-2"
            >
              {isCopied ? (
                  <>
                     <Check size={16} /> ¡Copiado al portapapeles!
                  </>
              ) : (
                  "Copiar enlace al portapapeles"
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Right Column: Posts & Content */}
      <div className="lg:col-span-2 space-y-6">
        
        {/* Create Post */}
        <div className="bg-white p-6 rounded-2xl shadow-lg border border-slate-100">
          <h3 className="text-xl font-bold text-navy mb-4">Nueva Publicación</h3>
          {/* Added bg-white and text-slate-900 */}
          <textarea
            placeholder={`¿Qué has logrado hoy, ${student.name.split(' ')[0]}?`}
            className="w-full p-4 bg-white text-slate-900 rounded-xl border border-slate-200 focus:ring-2 focus:ring-orange-500 resize-none outline-none shadow-sm"
            rows={3}
            value={newPostContent}
            onChange={(e) => setNewPostContent(e.target.value)}
          />
          
          {newPostImage && (
            <div className="mt-4 relative rounded-xl overflow-hidden max-h-60">
               <img src={newPostImage} alt="Preview" className="w-full h-full object-cover" />
               <button 
                onClick={() => setNewPostImage(null)}
                className="absolute top-2 right-2 bg-black/60 text-white p-1 rounded-full hover:bg-black/80 transition-colors"
               >
                 <X size={16} />
               </button>
            </div>
          )}

          <div className="flex justify-between items-center mt-4">
            <div className="flex gap-2">
              <button 
                onClick={() => fileInputRef.current?.click()}
                className="flex items-center gap-2 text-slate-600 hover:text-navy px-3 py-2 rounded-lg hover:bg-slate-100 transition-colors"
              >
                <ImageIcon size={18} />
                <span className="text-sm font-medium">Foto</span>
              </button>
              {newPostImage && (
                <button 
                  onClick={handleAIImageAnalysis}
                  disabled={isAnalyzingImg}
                  className="flex items-center gap-2 text-indigo-600 hover:text-indigo-800 px-3 py-2 rounded-lg hover:bg-indigo-50 transition-colors"
                >
                  <Sparkles size={18} />
                  <span className="text-sm font-medium">{isAnalyzingImg ? 'Analizando...' : 'Caption IA'}</span>
                </button>
              )}
            </div>
            <input type="file" ref={fileInputRef} className="hidden" accept="image/*" onChange={(e) => handleImageUpload(e, false)} />
            
            <button 
              onClick={handleCreatePost}
              disabled={!newPostContent && !newPostImage}
              className="bg-orange-500 text-white px-6 py-2 rounded-lg font-bold shadow-md hover:bg-orange-600 disabled:opacity-50 flex items-center gap-2"
            >
              Publicar <Send size={16} />
            </button>
          </div>
        </div>

        {/* Feed Preview */}
        <div className="space-y-4">
          <h3 className="text-lg font-bold text-slate-700">Tus Publicaciones Recientes</h3>
          {student.posts.length > 0 ? student.posts.map(post => (
            <div key={post.id} className="bg-white p-5 rounded-xl shadow-sm border border-slate-100 group relative">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-3">
                  {/* Small Initials Avatar */}
                  <div className="w-10 h-10 rounded-full bg-navy flex items-center justify-center text-white font-bold text-xs overflow-hidden">
                    {student.profilePic ? (
                      <img src={student.profilePic} className="w-full h-full object-cover" />
                    ) : (
                      getInitials(student.name)
                    )}
                  </div>
                  <div>
                    <h4 className="font-bold text-navy text-sm">{student.name}</h4>
                    <p className="text-xs text-slate-500">{post.date}</p>
                  </div>
                </div>
                {/* Delete Post Button */}
                <button 
                  onClick={() => handleDeletePost(post.id)}
                  className="text-slate-400 hover:text-red-500 transition-colors opacity-0 group-hover:opacity-100 p-2"
                  title="Eliminar publicación"
                >
                  <Trash2 size={18} />
                </button>
              </div>
              
              <p className="text-slate-700 mb-3 whitespace-pre-line">{post.content}</p>
              {post.image && (
                <img src={post.image} className="w-full rounded-lg object-cover max-h-80" />
              )}
            </div>
          )) : (
            <div className="text-center py-8 text-slate-400 bg-white rounded-xl border border-dashed border-slate-200">
              No has publicado nada aún. ¡Comparte tu primer logro!
            </div>
          )}
        </div>

      </div>
    </div>
  );
};