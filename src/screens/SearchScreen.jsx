import React, { useState, useMemo } from 'react';
import SearchBar from '../components/shared/SearchBar';
import { Calendar, CheckCircle, FileText, Clock, ArrowUpRight, X } from 'lucide-react';

const SearchScreen = ({ events, tasks, notes, onClose, onNavigate }) => {
  const [searchQuery, setSearchQuery] = useState('');

  // --- 1. SMART SUGGESTIONS LOGIC ---
  const smartSuggestions = useMemo(() => {
    const suggestions = new Set();
    
    notes.forEach(n => { if(n.subject) suggestions.add(n.subject); });

    [...events, ...tasks].forEach(item => {
        if (item.title) {
            const firstWord = item.title.split(' ')[0];
            if (firstWord.length > 3) suggestions.add(firstWord);
        }
    });

    if (suggestions.size < 3) {
        suggestions.add('Physics');
        suggestions.add('Meeting');
        suggestions.add('Homework');
        suggestions.add('Ideas');
    }

    return Array.from(suggestions).slice(0, 6); 
  }, [events, tasks, notes]);


  // --- 2. SEARCH LOGIC ---
  const results = useMemo(() => {
    if (!searchQuery.trim()) return [];

    const lowerQ = searchQuery.toLowerCase();
    const combined = [];

    events.forEach(e => {
        if (e.title.toLowerCase().includes(lowerQ) || (e.notes && e.notes.toLowerCase().includes(lowerQ))) {
            combined.push({ type: 'event', data: e });
        }
    });

    tasks.forEach(t => {
        if (t.title.toLowerCase().includes(lowerQ) || (t.notes && t.notes.toLowerCase().includes(lowerQ))) {
            combined.push({ type: 'task', data: t });
        }
    });

    notes.forEach(n => {
        if (
            n.title.toLowerCase().includes(lowerQ) || 
            n.content.toLowerCase().includes(lowerQ) || 
            n.subject.toLowerCase().includes(lowerQ)
        ) {
            combined.push({ type: 'note', data: n });
        }
    });

    return combined;
  }, [searchQuery, events, tasks, notes]);

  // --- RENDER HELPERS ---
  const getIcon = (type) => {
      switch(type) {
          case 'event': return <Calendar size={20} className="text-[#00B7FF]" />;
          case 'task': return <CheckCircle size={20} className="text-[#B907FF]" />;
          case 'note': return <FileText size={20} className="text-white" />;
          default: return <Clock size={20} className="text-white" />;
      }
  };

  const getSubtext = (type, data) => {
      switch(type) {
          case 'event': return `Event • ${data.date} at ${data.startTime}`;
          case 'task': return `Task • Due ${data.date}`;
          case 'note': return `Note • ${data.subject}`;
          default: return '';
      }
  };

  const mainGradient = 'linear-gradient(90deg, rgba(0, 183, 255, 0.7) 0%, rgba(185, 7, 255, 0.7) 100%)';

  return (
    <div className="fixed inset-0 z-[200] flex flex-col animate-fade-in">
        
        {/* BACKDROP BLUR */}
        <div 
            className="absolute inset-0 bg-black/80 backdrop-blur-xl"
            onClick={onClose} 
        />

        {/* CONTENT CONTAINER */}
        <div className="relative z-10 flex flex-col h-full w-full pointer-events-none">
            
            {/* Close Button */}
            <div className="absolute top-12 right-6 z-50 pointer-events-auto">
                <button 
                    onClick={onClose} 
                    className="p-2 bg-white/10 rounded-full text-white active:scale-90 transition-transform hover:bg-white/20"
                >
                    <X size={24} />
                </button>
            </div>

            {/* --- SCROLLABLE RESULTS AREA --- */}
            <div className="flex-1 flex flex-col overflow-y-auto no-scrollbar px-[20px] pt-[80px] pb-32 pointer-events-auto">
                
                {/* WRAPPER FOR BOTTOM ALIGNMENT (Restored) */}
                <div className="mt-auto w-full flex flex-col gap-4">

                    {/* RESULTS LIST */}
                    {searchQuery ? (
                        <div className="flex flex-col gap-3 relative z-30"> 
                            {results.map((item, idx) => (
                                <div 
                                    key={`${item.type}-${item.data.id}`}
                                    className="w-full h-[70px] rounded-full relative flex items-center px-5 gap-4 active:scale-[0.98] transition-transform cursor-pointer animate-slide-up group"
                                    style={{ animationDelay: `${idx * 0.05}s` }}
                                    onClick={() => onNavigate(item.type, item.data)}
                                >
                                    {/* GRADIENT BORDER STROKE */}
                                    <div 
                                        className="absolute inset-0 pointer-events-none rounded-full z-20"
                                        style={{
                                            padding: '1.5px', 
                                            background: mainGradient, 
                                            WebkitMask: 'linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)',
                                            WebkitMaskComposite: 'xor',
                                            maskComposite: 'exclude',
                                            boxShadow: '0px 4px 12px rgba(255, 255, 255, 0.05)' 
                                        }}
                                    />

                                    {/* GLASS BACKGROUND */}
                                    <div 
                                        className="absolute inset-0 rounded-full z-10"
                                        style={{
                                            background: 'rgba(23, 23, 26, 0.8)',
                                            backdropFilter: 'blur(10px)',
                                        }}
                                    />

                                    {/* CONTENT */}
                                    <div className="relative z-30 flex items-center w-full gap-4">
                                        <div className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center shrink-0">
                                            {getIcon(item.type)}
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <h3 className="text-[#E5E5E5] font-medium truncate text-lg" style={{ fontFamily: 'Lexend' }}>
                                                {item.data.title}
                                            </h3>
                                            <p className="text-[#B0B0B0] text-xs truncate">
                                                {getSubtext(item.type, item.data)}
                                            </p>
                                        </div>
                                        <ArrowUpRight size={18} className="text-[#B0B0B0]/50" />
                                    </div>
                                </div>
                            ))}
                            
                            {results.length === 0 && (
                                <div className="text-center mt-10 text-[#B0B0B0]">No results found</div>
                            )}
                        </div>
                    ) : (
                        /* EMPTY STATE / SUGGESTIONS */
                        <div className="flex flex-col gap-6 opacity-0 animate-slide-up-fade mb-4" style={{ animationDelay: '0.1s', animationFillMode: 'forwards' }}>
                            <div>
                                <h2 className="text-[#E5E5E5] text-xl font-semibold mb-4 ml-1" style={{ fontFamily: 'Lexend' }}>Suggestions</h2>
                                <div className="flex flex-wrap gap-3">
                                    {smartSuggestions.map(tag => (
                                        <button 
                                            key={tag}
                                            onClick={() => setSearchQuery(tag)}
                                            className="relative px-5 py-2 rounded-full active:scale-95 transition-transform group overflow-hidden"
                                        >
                                            <div className="absolute inset-0 bg-[#17171A]/60 backdrop-blur-md" />
                                            <div 
                                                className="absolute inset-0 rounded-full pointer-events-none" 
                                                style={{ 
                                                    padding: '1px', 
                                                    background: 'linear-gradient(90deg, rgba(0, 183, 255, 0.3) 0%, rgba(185, 7, 255, 0.3) 100%)', 
                                                    WebkitMask: 'linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)', 
                                                    WebkitMaskComposite: 'xor', 
                                                    maskComposite: 'exclude' 
                                                }} 
                                            />
                                            <span className="relative z-10 text-[#B0B0B0] text-sm font-light group-hover:text-white transition-colors">
                                                {tag}
                                            </span>
                                        </button>
                                    ))}
                                </div>
                            </div>
                        </div>
                    )}

                </div>
                
                <div className="h-4 shrink-0"></div>
            </div>

            {/* --- BOTTOM SEARCH BAR --- */}
            <div className="absolute bottom-[30px] left-0 w-full px-[20px] z-50 pointer-events-auto">
                <SearchBar 
                    value={searchQuery}
                    onChange={setSearchQuery}
                />
            </div>

            {/* Background Fades */}
            <div className="absolute top-0 left-0 w-full h-[60px] pointer-events-none z-0" style={{ background: 'linear-gradient(180deg, #000000 80%, rgba(0, 0, 0, 0) 100%)' }} />
            <div className="absolute bottom-0 left-0 w-full h-[150px] pointer-events-none z-0" style={{ background: 'linear-gradient(0deg, #000000 40%, rgba(0, 0, 0, 0) 100%)' }} />
        </div>
      
        <style>{`
            .animate-fade-in { animation: fadeIn 0.3s ease-out; }
            @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
            
            .animate-slide-up { animation: slideUp 0.4s cubic-bezier(0.16, 1, 0.3, 1) backwards; }
            .animate-slide-up-fade { animation: slideUpFade 0.5s ease-out backwards; }

            @keyframes slideUp { from { opacity: 0; transform: translateY(20px); } to { opacity: 1; transform: translateY(0); } }
            @keyframes slideUpFade { from { opacity: 0; transform: translateY(20px); } to { opacity: 1; transform: translateY(0); } }
        `}</style>
    </div>
  );
};

export default SearchScreen;