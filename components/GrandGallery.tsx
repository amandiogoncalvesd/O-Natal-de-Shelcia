import React, { useState, useMemo } from 'react';
import { X, Play, Image as ImageIcon, Film, ChevronLeft, Filter, Heart, Loader } from 'lucide-react';
import { MediaItem } from '../types';

interface GrandGalleryProps {
  onBack: () => void;
}

// --- BANCO DE DADOS SIMULADO (ADICIONE SEUS ARQUIVOS AQUI) ---
// Para performance com 160+ arquivos, esta lista é carregada em memória,
// mas apenas uma parte é renderizada por vez no DOM.
const MEDIA_DATABASE: MediaItem[] = [
  // VÍDEOS (Exemplos)
  {
    id: 'v1',
    type: 'video',
    url: 'https://joy1.videvo.net/videvo_files/video/free/2019-11/large_watermarked/190301_1_25_11_preview.mp4',
    thumbnail: 'https://images.unsplash.com/photo-1492684223066-81342ee5ff30?q=80&w=800&auto=format&fit=crop',
    category: 'Momentos',
    caption: 'Risadas que ecoam'
  },
  {
    id: 'v2',
    type: 'video',
    url: 'https://joy1.videvo.net/videvo_files/video/free/2015-09/large_watermarked/Star_field_Fly_Through_preview.mp4',
    category: 'Astronomia',
    caption: 'Viajando pelas estrelas'
  },
  // FOTOS (Exemplos misturados)
  { id: 'p1', type: 'image', url: 'https://images.unsplash.com/photo-1515919659424-42f15998df9a?q=80&w=800', category: 'Família', caption: 'Com Ruth e Miguel' },
  { id: 'p2', type: 'image', url: 'https://images.unsplash.com/photo-1523438885200-e635ba2c371e?q=80&w=800', category: 'Natureza', caption: 'A delicadeza das rosas' },
  { id: 'p3', type: 'image', url: 'https://images.unsplash.com/photo-1534447677768-be436bb09401?q=80&w=800', category: 'Sonhos', caption: 'Construindo o futuro' },
  { id: 'p4', type: 'image', url: 'https://images.unsplash.com/photo-1446776811953-b23d57bd21aa?q=80&w=800', category: 'Astronomia', caption: 'A lua que inspira' },
  { id: 'p5', type: 'image', url: 'https://images.unsplash.com/photo-1516575334481-f85287c2c81d?q=80&w=800', category: 'Sonhos', caption: 'Arte e Poesia' },
  { id: 'p6', type: 'image', url: 'https://images.unsplash.com/photo-1513297887119-d46091b24bfa?q=80&w=800', category: 'Momentos', caption: 'Natal Mágico' },
  { id: 'p7', type: 'image', url: 'https://images.unsplash.com/photo-1433838552652-f9a46b332c40?q=80&w=800', category: 'Viagens', caption: 'Onde o vento nos leva' },
  { id: 'p8', type: 'image', url: 'https://images.unsplash.com/photo-1465146344425-f00d5f5c8f07?q=80&w=800', category: 'Natureza', caption: 'Floresta Encantada' },
  { id: 'p9', type: 'image', url: 'https://images.unsplash.com/photo-1470252649378-9c29740c9fa8?q=80&w=800', category: 'Família', caption: 'Amanhecer em família' },
  { id: 'p10', type: 'image', url: 'https://images.unsplash.com/photo-1494976388531-d1058494cdd8?q=80&w=800', category: 'Viagens', caption: 'Carros e Estradas' },
];

const ITEMS_PER_PAGE = 12;

export const GrandGallery: React.FC<GrandGalleryProps> = ({ onBack }) => {
  const [filterType, setFilterType] = useState<'all' | 'video' | 'image'>('all');
  const [filterCategory, setFilterCategory] = useState<string>('Todas');
  const [visibleCount, setVisibleCount] = useState(ITEMS_PER_PAGE);
  const [selectedItem, setSelectedItem] = useState<MediaItem | null>(null);

  // Extrair categorias únicas
  const categories = useMemo(() => {
    const cats = new Set(MEDIA_DATABASE.map(item => item.category));
    return ['Todas', ...Array.from(cats)];
  }, []);

  // Filtragem Otimizada
  const filteredItems = useMemo(() => {
    return MEDIA_DATABASE.filter(item => {
      const matchesType = filterType === 'all' || item.type === filterType;
      const matchesCategory = filterCategory === 'Todas' || item.category === filterCategory;
      return matchesType && matchesCategory;
    });
  }, [filterType, filterCategory]);

  const displayedItems = filteredItems.slice(0, visibleCount);
  const hasMore = visibleCount < filteredItems.length;

  const handleLoadMore = () => {
    setVisibleCount(prev => prev + ITEMS_PER_PAGE);
  };

  return (
    <div className="min-h-screen bg-slate-50 relative z-50 animate-fade-in">
      {/* HEADER FIXO */}
      <div className="sticky top-0 z-40 bg-white/80 backdrop-blur-md border-b border-purple-100 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 py-4 flex flex-col md:flex-row justify-between items-center gap-4">
          <button 
            onClick={onBack}
            className="flex items-center gap-2 text-slate-600 hover:text-purple-600 transition-colors font-playfair self-start md:self-auto"
          >
            <ChevronLeft size={20} />
            Voltar para o Natal
          </button>

          <h1 className="text-2xl font-playfair text-slate-800 flex items-center gap-2">
            <Film className="text-yellow-500" size={24} />
            Galeria Real
          </h1>

          <div className="flex gap-2 bg-slate-100 p-1 rounded-full">
            <button 
              onClick={() => { setFilterType('all'); setVisibleCount(ITEMS_PER_PAGE); }}
              className={`px-4 py-1.5 rounded-full text-sm font-medium transition-all ${filterType === 'all' ? 'bg-white text-purple-600 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
            >
              Tudo
            </button>
            <button 
              onClick={() => { setFilterType('image'); setVisibleCount(ITEMS_PER_PAGE); }}
              className={`px-4 py-1.5 rounded-full text-sm font-medium transition-all ${filterType === 'image' ? 'bg-white text-purple-600 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
            >
              Fotos
            </button>
            <button 
              onClick={() => { setFilterType('video'); setVisibleCount(ITEMS_PER_PAGE); }}
              className={`px-4 py-1.5 rounded-full text-sm font-medium transition-all ${filterType === 'video' ? 'bg-white text-purple-600 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
            >
              Vídeos
            </button>
          </div>
        </div>

        {/* BARRA DE CATEGORIAS */}
        <div className="border-t border-slate-100 bg-white/50 overflow-x-auto">
          <div className="max-w-7xl mx-auto px-4 py-2 flex gap-4 min-w-max">
            {categories.map(cat => (
              <button
                key={cat}
                onClick={() => { setFilterCategory(cat); setVisibleCount(ITEMS_PER_PAGE); }}
                className={`text-sm font-cormorant tracking-wide px-3 py-1 rounded-md transition-colors ${
                  filterCategory === cat 
                  ? 'bg-purple-50 text-purple-700 border border-purple-100' 
                  : 'text-slate-500 hover:bg-slate-50'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* GRID DA GALERIA */}
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {displayedItems.map((item) => (
            <div 
              key={item.id}
              onClick={() => setSelectedItem(item)}
              className="group relative aspect-[3/4] rounded-lg overflow-hidden bg-slate-200 cursor-pointer shadow-md hover:shadow-xl hover:-translate-y-1 transition-all duration-300"
            >
              {/* Overlay de Categoria */}
              <div className="absolute top-3 left-3 z-10 bg-black/40 backdrop-blur-sm px-2 py-0.5 rounded text-xs text-white font-medium border border-white/20">
                {item.category}
              </div>

              {/* Ícone de Tipo */}
              <div className="absolute top-3 right-3 z-10 text-white opacity-80 shadow-sm">
                {item.type === 'video' ? <Film size={16} /> : <ImageIcon size={16} />}
              </div>

              {/* Mídia */}
              {item.type === 'video' ? (
                <>
                  <img 
                    src={item.thumbnail || 'https://via.placeholder.com/400x600?text=Video+Thumbnail'} 
                    alt={item.caption}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 flex items-center justify-center bg-black/20 group-hover:bg-black/40 transition-colors">
                    <div className="w-12 h-12 rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center border border-white/50">
                      <Play className="text-white ml-1" size={24} fill="currentColor" />
                    </div>
                  </div>
                </>
              ) : (
                <img 
                  src={item.url} 
                  alt={item.caption}
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                  loading="lazy" 
                />
              )}

              {/* Legenda Hover */}
              <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent p-4 translate-y-full group-hover:translate-y-0 transition-transform duration-300">
                <p className="text-white font-playfair text-sm">{item.caption}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Empty State */}
        {filteredItems.length === 0 && (
          <div className="text-center py-20 text-slate-400">
            <Filter className="mx-auto mb-4 opacity-50" size={48} />
            <p className="font-playfair text-xl">Nenhuma memória encontrada neste filtro.</p>
          </div>
        )}

        {/* Load More Button */}
        {hasMore && (
          <div className="flex justify-center mt-12 pb-12">
            <button 
              onClick={handleLoadMore}
              className="group flex items-center gap-2 px-8 py-3 bg-white border border-purple-200 rounded-full shadow-lg text-purple-700 font-playfair hover:bg-purple-50 transition-all"
            >
              <Loader size={18} className="group-hover:animate-spin" />
              Carregar mais memórias
            </button>
          </div>
        )}
      </div>

      {/* LIGHTBOX MODAL */}
      {selectedItem && (
        <div className="fixed inset-0 z-[100] bg-black/95 backdrop-blur-xl flex flex-col items-center justify-center p-4">
          {/* Controls */}
          <button 
            onClick={() => setSelectedItem(null)}
            className="absolute top-6 right-6 text-white/70 hover:text-white hover:bg-white/10 p-2 rounded-full transition-all"
          >
            <X size={32} />
          </button>

          <div className="relative w-full max-w-5xl max-h-[85vh] flex items-center justify-center">
            {selectedItem.type === 'video' ? (
              <video 
                src={selectedItem.url} 
                controls 
                autoPlay 
                className="max-w-full max-h-[80vh] rounded-lg shadow-2xl border border-white/10"
              />
            ) : (
              <img 
                src={selectedItem.url} 
                alt={selectedItem.caption} 
                className="max-w-full max-h-[85vh] object-contain rounded-lg shadow-2xl animate-fade-in"
              />
            )}
          </div>

          <div className="mt-6 text-center">
            <h3 className="text-white font-playfair text-2xl">{selectedItem.caption}</h3>
            <span className="text-white/60 font-cormorant text-sm uppercase tracking-widest mt-1 block">
              {selectedItem.category} • {selectedItem.type === 'video' ? 'Vídeo' : 'Foto'}
            </span>
          </div>
        </div>
      )}
    </div>
  );
};
