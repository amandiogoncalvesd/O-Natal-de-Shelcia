import React, { useState, useEffect, useRef } from 'react';
import { 
  Music, Moon, Sun, Heart, Star, Sparkles, 
  Send, X, Play, Pause, SkipForward, Menu, 
  Gift, Crown, Snowflake, Camera, Image as ImageIcon 
} from 'lucide-react';
import { generateChristmasPoem } from './services/geminiService';
import { MagicalBackground, SnowEffect } from './components/Visuals';
import { GrandGallery } from './components/GrandGallery';
import { ThemeMode, GalleryItem, WishMessage } from './types';

// --- Helper Components (Local to avoid file sprawl while maintaining modularity) ---

// 1. Navigation
const Navigation = ({ theme, toggleTheme, activeSection, scrollTo, onViewGallery }: any) => {
  const [isOpen, setIsOpen] = useState(false);
  const navLinks = [
    { id: 'home', label: 'Início' },
    { id: 'memories', label: 'Memórias' },
    { id: 'enchantment', label: 'Encanto' },
    { id: 'dreams', label: 'Sonhos' },
    { id: 'wishes', label: 'Desejos' },
  ];

  return (
    <nav className={`fixed top-0 w-full z-50 transition-all duration-300 ${isOpen ? 'bg-white/90' : 'bg-white/30 backdrop-blur-md'} border-b border-white/40 shadow-sm`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          <div className="flex items-center space-x-2 font-signature text-3xl text-yellow-600 cursor-pointer" onClick={() => scrollTo('home')}>
            <Crown size={24} className="text-purple-400" />
            <span>Shelcia Van-Dúnem</span>
          </div>
          
          {/* Desktop Menu */}
          <div className="hidden md:flex items-center space-x-8">
            {navLinks.map((link) => (
              <button
                key={link.id}
                onClick={() => scrollTo(link.id)}
                className={`font-playfair text-lg transition-colors duration-300 hover:text-purple-500 ${activeSection === link.id ? 'text-purple-600 font-semibold' : 'text-slate-600'}`}
              >
                {link.label}
              </button>
            ))}
             <button 
              onClick={onViewGallery}
              className="flex items-center gap-1 px-4 py-1.5 bg-purple-100 hover:bg-purple-200 text-purple-700 rounded-full font-playfair text-sm transition-colors border border-purple-200"
            >
              <ImageIcon size={14} />
              Galeria Real
            </button>
            <button onClick={toggleTheme} className="p-2 rounded-full hover:bg-purple-100 transition-colors text-purple-600">
              {theme === ThemeMode.DAY ? <Moon size={20} /> : <Sun size={20} />}
            </button>
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden flex items-center">
             <button onClick={toggleTheme} className="p-2 mr-2 rounded-full text-purple-600">
              {theme === ThemeMode.DAY ? <Moon size={20} /> : <Sun size={20} />}
            </button>
            <button onClick={() => setIsOpen(!isOpen)} className="text-slate-700">
              {isOpen ? <X size={28} /> : <Menu size={28} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu Dropdown */}
      {isOpen && (
        <div className="md:hidden bg-white/95 backdrop-blur-xl border-t border-purple-100 absolute w-full">
          <div className="px-4 pt-2 pb-6 space-y-2">
            {navLinks.map((link) => (
              <button
                key={link.id}
                onClick={() => { scrollTo(link.id); setIsOpen(false); }}
                className="block w-full text-left px-3 py-3 font-playfair text-xl text-slate-700 hover:bg-purple-50 rounded-lg"
              >
                {link.label}
              </button>
            ))}
            <button
                onClick={() => { onViewGallery(); setIsOpen(false); }}
                className="block w-full text-left px-3 py-3 font-playfair text-xl text-purple-700 bg-purple-50 rounded-lg"
              >
                Ver Galeria Real
              </button>
          </div>
        </div>
      )}
    </nav>
  );
};

// 2. Countdown Component
const Countdown = () => {
  const [timeLeft, setTimeLeft] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 });

  useEffect(() => {
    const target = new Date(new Date().getFullYear(), 11, 25); // Dec 25
    if (new Date() > target) target.setFullYear(target.getFullYear() + 1);

    const interval = setInterval(() => {
      const now = new Date();
      const diff = target.getTime() - now.getTime();
      
      const days = Math.floor(diff / (1000 * 60 * 60 * 24));
      const hours = Math.floor((diff / (1000 * 60 * 60)) % 24);
      const minutes = Math.floor((diff / 1000 / 60) % 60);
      const seconds = Math.floor((diff / 1000) % 60);
      
      setTimeLeft({ days, hours, minutes, seconds });
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="flex justify-center space-x-4 md:space-x-8 my-8 animate-float">
      {[
        { label: 'Dias', value: timeLeft.days },
        { label: 'Horas', value: timeLeft.hours },
        { label: 'Min', value: timeLeft.minutes },
        { label: 'Seg', value: timeLeft.seconds }
      ].map((item, idx) => (
        <div key={idx} className="flex flex-col items-center">
          <div className="w-16 h-16 md:w-20 md:h-20 glass-panel rounded-full flex items-center justify-center text-xl md:text-2xl font-playfair font-bold text-yellow-600 border-2 border-yellow-200/50">
            {item.value}
          </div>
          <span className="mt-2 text-xs md:text-sm font-cormorant tracking-widest uppercase text-slate-500">{item.label}</span>
        </div>
      ))}
    </div>
  );
};

// 3. Music Player
const MusicPlayer = () => {
  const [isPlaying, setIsPlaying] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  // Simulating a playlist interaction
  const togglePlay = () => {
    if (audioRef.current) {
      if (isPlaying) audioRef.current.pause();
      else audioRef.current.play();
      setIsPlaying(!isPlaying);
    }
  };

  return (
    <div className="fixed bottom-6 left-6 z-50 animate-float">
      <audio ref={audioRef} loop src="https://upload.wikimedia.org/wikipedia/commons/7/7b/United_States_Navy_Band_-_O_Christmas_Tree.ogg" /> {/* Royalty free placeholder */}
      <div className="glass-panel p-3 rounded-full flex items-center space-x-3 pr-6 shadow-xl bg-white/80">
        <div className={`w-10 h-10 rounded-full bg-purple-100 flex items-center justify-center text-purple-600 ${isPlaying ? 'animate-spin' : ''}`} style={{ animationDuration: '3s' }}>
          <Music size={18} />
        </div>
        <div className="flex flex-col">
          <span className="text-xs font-bold text-slate-700 font-playfair">Melodia de Natal</span>
          <span className="text-[10px] text-slate-500 font-cormorant">Shelcia's Playlist</span>
        </div>
        <button onClick={togglePlay} className="w-8 h-8 rounded-full bg-yellow-400 text-white flex items-center justify-center hover:bg-yellow-500 transition-colors shadow-md">
          {isPlaying ? <Pause size={14} /> : <Play size={14} fill="currentColor" />}
        </button>
      </div>
    </div>
  );
};

// 4. Gallery Section
const GallerySection = ({ id, title, subtitle, images, pattern }: any) => {
  const [selectedImage, setSelectedImage] = useState<string | null>(null);

  return (
    <section id={id} className="py-24 px-4 relative">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16" data-aos="fade-up">
          <div className="flex justify-center mb-4 text-yellow-500"><Sparkles /></div>
          <h2 className="text-4xl md:text-5xl font-playfair text-slate-800 mb-4">{title}</h2>
          <p className="text-xl font-cormorant text-slate-600 italic max-w-2xl mx-auto">{subtitle}</p>
        </div>

        <div className={`grid gap-6 ${pattern === 'masonry' ? 'grid-cols-1 md:grid-cols-3' : 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-4'}`}>
          {images.map((img: GalleryItem, idx: number) => (
            <div 
              key={img.id} 
              className={`group relative overflow-hidden rounded-2xl cursor-pointer shadow-lg hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-2 ${pattern === 'masonry' && idx % 2 === 0 ? 'md:row-span-2' : ''}`}
              onClick={() => setSelectedImage(img.url)}
            >
              <img 
                src={img.url} 
                alt={img.title} 
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" 
              />
              <div className="absolute inset-0 bg-gradient-to-t from-purple-900/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-6">
                <span className="text-yellow-300 font-cormorant text-lg italic">{img.title}</span>
                <p className="text-white font-playfair text-sm">{img.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Lightbox */}
      {selectedImage && (
        <div className="fixed inset-0 z-[60] bg-black/90 flex items-center justify-center p-4" onClick={() => setSelectedImage(null)}>
          <button className="absolute top-4 right-4 text-white hover:text-yellow-400"><X size={32} /></button>
          <img src={selectedImage} alt="Full view" className="max-w-full max-h-[90vh] rounded-lg shadow-2xl animate-twinkle" />
        </div>
      )}
    </section>
  );
};

// 5. Card Generator (Gemini Integration)
const CardGenerator = () => {
  const [generatedText, setGeneratedText] = useState("");
  const [loading, setLoading] = useState(false);
  
  const handleGenerate = async () => {
    setLoading(true);
    const themes = ["Poesia", "Astronomia", "Natureza", "Princesas", "Amizade"];
    const text = await generateChristmasPoem("Shelcia", themes);
    setGeneratedText(text);
    setLoading(false);
  };

  return (
    <div className="glass-card p-8 rounded-3xl max-w-2xl mx-auto my-12 text-center border border-white/60 shadow-xl relative overflow-hidden">
      <div className="absolute -top-10 -right-10 w-32 h-32 bg-yellow-200 rounded-full blur-3xl opacity-50"></div>
      <div className="absolute -bottom-10 -left-10 w-32 h-32 bg-purple-200 rounded-full blur-3xl opacity-50"></div>
      
      <div className="relative z-10">
        <h3 className="text-2xl font-playfair mb-2 text-slate-800">Mensagem do Universo</h3>
        <p className="font-cormorant text-lg text-slate-600 mb-6">Peça uma poesia mágica criada especialmente para você.</p>
        
        {generatedText && (
          <div className="mb-8 p-6 bg-white/50 rounded-lg italic font-cormorant text-xl text-purple-900 border border-purple-100">
            "{generatedText}"
          </div>
        )}

        <button 
          onClick={handleGenerate} 
          disabled={loading}
          className="bg-gradient-to-r from-purple-400 to-pink-400 text-white px-8 py-3 rounded-full font-playfair text-lg shadow-lg hover:shadow-purple-300/50 transition-all flex items-center justify-center mx-auto space-x-2 disabled:opacity-70"
        >
          {loading ? (
             <span className="animate-pulse">Consultando as estrelas...</span>
          ) : (
             <>
               <Star size={18} fill="currentColor" />
               <span>Gerar Mensagem Mágica</span>
             </>
          )}
        </button>
      </div>
    </div>
  );
};

// --- Main App Component ---

const App: React.FC = () => {
  const [theme, setTheme] = useState<ThemeMode>(ThemeMode.DAY);
  const [activeSection, setActiveSection] = useState('home');
  const [showGrandGallery, setShowGrandGallery] = useState(false); // State for new page

  const toggleTheme = () => setTheme(theme === ThemeMode.DAY ? ThemeMode.NIGHT : ThemeMode.DAY);

  const scrollTo = (id: string) => {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
      setActiveSection(id);
    }
    setShowGrandGallery(false); // Close gallery when navigating main menu
  };

  // Sample Data for Home Page Galleries
  const celestialImages: GalleryItem[] = [
    { id: '1', url: 'https://picsum.photos/id/1015/800/1200', title: 'Céu de Outono', description: 'Onde o sol beija o horizonte.', tags: [] },
    { id: '2', url: 'https://picsum.photos/id/1022/800/800', title: 'Constelações', description: 'Histórias escritas nas estrelas.', tags: [] },
    { id: '3', url: 'https://picsum.photos/id/1036/800/1200', title: 'Inverno Azul', description: 'A calma da neve suave.', tags: [] },
  ];

  const natureImages: GalleryItem[] = [
    { id: '4', url: 'https://picsum.photos/id/106/800/1200', title: 'Flores de Cerejeira', description: 'Delicadeza em cada pétala.', tags: [] },
    { id: '5', url: 'https://picsum.photos/id/152/800/800', title: 'Jardim Secreto', description: 'Refúgio de paz.', tags: [] },
    { id: '6', url: 'https://picsum.photos/id/216/800/1200', title: 'Azul Celeste', description: 'A imensidão do céu.', tags: [] },
    { id: '7', url: 'https://picsum.photos/id/306/800/800', title: 'Lírio do Vale', description: 'Pureza e encanto.', tags: [] },
  ];

  const dreamImages: GalleryItem[] = [
    { id: '8', url: 'https://picsum.photos/id/433/800/600', title: 'Arte & Vida', description: 'Criando beleza no mundo.', tags: [] },
    { id: '9', url: 'https://picsum.photos/id/534/800/600', title: 'Sonhos Dourados', description: 'Arquitetando o futuro.', tags: [] },
  ];

  // If Grand Gallery is open, render it instead of the main page content
  if (showGrandGallery) {
    return <GrandGallery onBack={() => setShowGrandGallery(false)} />;
  }

  return (
    <MagicalBackground theme={theme}>
      <SnowEffect />
      <Navigation 
        theme={theme} 
        toggleTheme={toggleTheme} 
        activeSection={activeSection} 
        scrollTo={scrollTo} 
        onViewGallery={() => setShowGrandGallery(true)}
      />
      <MusicPlayer />

      {/* 1. Hero Section */}
      <header id="home" className="min-h-screen flex items-center justify-center relative px-4 overflow-hidden">
        <div className="absolute inset-0 z-0">
          <img 
            src={theme === ThemeMode.DAY 
              ? "https://images.unsplash.com/photo-1477346611705-65d1883cee1e?q=80&w=2070&auto=format&fit=crop" 
              : "https://images.unsplash.com/photo-1519681393784-d120267933ba?q=80&w=2070&auto=format&fit=crop"} 
            alt="Background" 
            className={`w-full h-full object-cover transition-opacity duration-1000 ${theme === ThemeMode.DAY ? 'opacity-30' : 'opacity-40'}`} 
          />
          <div className="absolute inset-0 bg-gradient-to-t from-white/80 via-transparent to-transparent"></div>
        </div>

        <div className="text-center relative z-20 max-w-4xl mx-auto pt-20">
          <div className="animate-float inline-block mb-6">
            <span className="text-5xl md:text-7xl">🎄</span>
          </div>
          <h1 className="text-6xl md:text-8xl font-signature text-transparent bg-clip-text bg-gradient-to-r from-yellow-500 via-purple-500 to-pink-500 mb-6 drop-shadow-sm pb-4">
            Feliz Natal, Shelcia
          </h1>
          <p className="text-xl md:text-2xl font-cormorant text-slate-700 italic mb-8 max-w-2xl mx-auto leading-relaxed">
            "O ódio excita contendas, mas o amor cobre todas as transgressões." 
            <br/><span className="text-sm uppercase tracking-widest not-italic mt-2 block text-yellow-600">— Provérbios 10:12</span>
          </p>
          
          <Countdown />

          <div className="flex flex-col md:flex-row gap-4 justify-center mt-8">
            <button 
              onClick={() => scrollTo('memories')}
              className="px-10 py-4 glass-panel rounded-full font-playfair text-lg text-purple-800 hover:bg-white hover:text-purple-600 transition-all duration-300 shadow-lg group"
            >
              Entrar no Mundo Mágico
              <span className="inline-block ml-2 group-hover:translate-x-1 transition-transform">→</span>
            </button>
            <button 
              onClick={() => setShowGrandGallery(true)}
              className="px-10 py-4 bg-white/80 rounded-full font-playfair text-lg text-yellow-700 hover:bg-yellow-50 hover:text-yellow-800 transition-all duration-300 shadow-lg flex items-center justify-center gap-2 border border-yellow-200"
            >
              <ImageIcon size={20} />
              Ver Galeria Completa
            </button>
          </div>
        </div>
      </header>

      {/* 2. Galeria 1: Memórias Celestiais */}
      <GallerySection 
        id="memories" 
        title="Memórias Celestiais" 
        subtitle="O céu conta a glória de Deus, e a beleza da astronomia reflete a sua alma sensível."
        images={celestialImages}
        pattern="grid"
      />

      {/* 3. Galeria 2: Encanto */}
      <GallerySection 
        id="enchantment" 
        title="Momentos de Encanto" 
        subtitle="Entre flores, natureza e a delicadeza de um coração romântico."
        images={natureImages}
        pattern="masonry"
      />

      {/* 4. Galeria 3: Sonhos & Criatividade */}
      <section id="dreams" className="py-24 relative overflow-hidden bg-white/30 backdrop-blur-sm">
        <div className="max-w-6xl mx-auto px-4">
          <div className="flex flex-col md:flex-row items-center gap-12">
             <div className="w-full md:w-1/2 space-y-8 text-center md:text-left">
               <div className="flex items-center justify-center md:justify-start gap-2 mb-4">
                 <Crown className="text-yellow-500" />
                 <span className="text-purple-500 font-playfair font-bold uppercase tracking-widest">Sonhos Reais</span>
               </div>
               <h2 className="text-4xl md:text-5xl font-playfair text-slate-800">Criatividade & Futuro</h2>
               <p className="text-lg font-cormorant text-slate-600 leading-relaxed">
                 Assim como uma princesa Disney que luta pelos seus sonhos, sua jornada na arquitetura, na arte e na vida é uma obra-prima em construção. 2025 será um ano de realizações brilhantes.
               </p>
               
               {/* Card Generator Widget */}
               <CardGenerator />
             </div>

             <div className="w-full md:w-1/2 grid grid-cols-2 gap-4">
                {dreamImages.map((img, idx) => (
                  <div key={img.id} className={`rounded-xl overflow-hidden shadow-lg border-2 border-white/50 transform transition-transform hover:scale-105 ${idx === 1 ? 'mt-12' : ''}`}>
                    <img src={img.url} className="w-full h-64 object-cover" alt="Dream" />
                  </div>
                ))}
             </div>
          </div>
        </div>
      </section>

      {/* 5. Wishes Section */}
      <section id="wishes" className="py-24 px-4 text-center">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-4xl font-playfair text-slate-800 mb-8">Com Amor, Ruth, Miguel e José</h2>
          <div className="glass-card p-10 rounded-2xl relative">
            <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-blue-300 via-purple-300 to-pink-300"></div>
            <p className="font-cormorant text-2xl text-slate-700 italic leading-loose mb-8">
              "Shelcia, que a sua sensibilidade continue colorindo o mundo com tons de azul celeste e violeta. 
              Que sua fé seja firme como as estrelas e que seu coração encontre poesia em cada pequeno detalhe.
              Nós te amamos imensamente."
            </p>
            <div className="flex justify-center gap-4">
              <Gift size={32} className="text-purple-400 animate-bounce" />
              <Heart size={32} className="text-pink-400 animate-pulse" />
            </div>
            <div className="mt-8 font-signature text-3xl text-yellow-600">
              Feliz Natal!
            </div>
          </div>

          <form className="mt-12 glass-panel p-6 rounded-xl max-w-lg mx-auto" onSubmit={(e) => e.preventDefault()}>
            <h4 className="font-playfair text-xl mb-4 text-slate-700">Deixe um desejo para 2025</h4>
            <div className="flex gap-2">
              <input 
                type="text" 
                placeholder="Escreva um desejo aqui..." 
                className="flex-1 bg-white/60 border border-white rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-purple-300 font-cormorant text-lg"
              />
              <button className="bg-purple-500 hover:bg-purple-600 text-white rounded-lg px-6 transition-colors">
                <Send size={20} />
              </button>
            </div>
          </form>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 text-center text-slate-500 font-cormorant text-sm relative z-20">
        <p>Criado com magia e código ✨ Especialmente para Shelcia</p>
      </footer>
    </MagicalBackground>
  );
};

export default App;
