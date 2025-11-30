import React, { useState, useMemo, useEffect } from 'react';
import { BsPlus } from "react-icons/bs";
import NoteCard from '../components/shared/NoteCard';
import NoteEditor from '../components/shared/NoteEditor';
import SearchBar from '../components/shared/SearchBar'; 

const NotesScreen = ({ notes, onSaveNote, onDeleteNote, onAddEvent, itemToOpen, clearItemToOpen }) => {
  // --- UI STATE ---
  const [isEditorOpen, setIsEditorOpen] = useState(false);
  const [editingNote, setEditingNote] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');

  const richGradientStr = `linear-gradient(90deg, rgba(0, 183, 255, 0.7) 0%, rgba(185, 7, 255, 0.7) 100%)`;

  // --- LISTEN FOR NAVIGATION FROM GLOBAL SEARCH ---
  useEffect(() => {
    if (itemToOpen && itemToOpen.type === 'note') {
        setEditingNote(itemToOpen.data);
        setIsEditorOpen(true);
        clearItemToOpen();
    }
  }, [itemToOpen]);

  // --- SEARCH & SORT LOGIC ---
  const filteredNotes = useMemo(() => {
    if (!searchQuery) return notes;
    
    const lowerQuery = searchQuery.toLowerCase();
    
    return notes.filter(note => 
        note.title.toLowerCase().includes(lowerQuery) || 
        note.content.toLowerCase().includes(lowerQuery) ||
        note.subject.toLowerCase().includes(lowerQuery)
    ).sort((a, b) => {
        // Priority 1: Subject Match
        const aSub = a.subject.toLowerCase().includes(lowerQuery);
        const bSub = b.subject.toLowerCase().includes(lowerQuery);
        if (aSub && !bSub) return -1;
        if (!aSub && bSub) return 1;

        // Priority 2: Title Match
        const aTitle = a.title.toLowerCase().includes(lowerQuery);
        const bTitle = b.title.toLowerCase().includes(lowerQuery);
        if (aTitle && !bTitle) return -1;
        if (!aTitle && bTitle) return 1;

        return 0;
    });
  }, [notes, searchQuery]);

  // --- HANDLERS ---
  const handleSave = (noteData) => {
      onSaveNote(noteData);
  };
  
  const handleDelete = (noteId) => {
      onDeleteNote(noteId);
      setIsEditorOpen(false);
  };

  // Open Editor for NEW Note
  const handleAddClick = () => {
      setEditingNote(null); // Clear editing state
      setIsEditorOpen(true);
  };

  // Open Editor for EXISTING Note
  const handleNoteClick = (note) => {
      setEditingNote(note);
      setIsEditorOpen(true);
  };

  return (
    <div className="h-full w-full relative bg-black overflow-hidden flex flex-col">
      
      {/* --- SEARCH BAR --- */}
      {/* Positioned at top: 90px padding to match design */}
      <div className="px-[20px] pt-[90px] pb-4 shrink-0 z-20">
         <SearchBar 
            value={searchQuery}
            onChange={setSearchQuery}
         />
      </div>

      {/* --- TOP FADE OVERLAY --- */}
      <div 
        className="absolute left-0 w-full h-[50px] pointer-events-none z-10"
        style={{
            top: '148px', 
            background: 'linear-gradient(180deg, #000000 20%, rgba(0, 0, 0, 0) 100%)',
            backdropFilter: 'blur(1px)'
        }}
      />

      {/* --- NOTES GRID --- */}
      <div className="flex-1 w-full relative overflow-y-auto no-scrollbar px-[27px] pb-32">
          <div className="grid grid-cols-2 gap-x-[24px] gap-y-[24px] pb-20 pt-4">
              {filteredNotes.map(note => (
                  <NoteCard 
                    key={note.id}
                    title={note.title}
                    preview={note.content}
                    onClick={() => handleNoteClick(note)}
                  />
              ))}
          </div>
      </div>

      {/* --- BOTTOM FADE --- */}
      <div 
        className="absolute bottom-0 left-0 w-full h-[150px] pointer-events-none z-20"
        style={{
            background: 'linear-gradient(180deg, rgba(0, 0, 0, 0) 3.65%, #000000 100%)',
            backdropFilter: 'blur(10px)'
        }}
      />

      {/* --- FAB (Standard Click) --- */}
      <div className="absolute bottom-[110px] right-[20px] z-[60]">
          <button 
            className="flex items-center justify-center active:scale-95 transition-transform select-none outline-none"
            style={{
                width: '100px',
                height: '100px',
                borderRadius: '100px',
                background: richGradientStr,
                boxShadow: '0px 6px 18.9px rgba(255, 255, 255, 0.1)',
                backdropFilter: 'blur(10px)',
                WebkitTapHighlightColor: 'transparent'
            }}
            onClick={handleAddClick} // Direct Click -> Open Editor
          >
              <BsPlus size={48} color="#FFFFFF" />
          </button>
      </div>

      {/* --- FULL EDITOR --- */}
      {isEditorOpen && (
          <NoteEditor 
            note={editingNote}
            onClose={() => setIsEditorOpen(false)}
            onSave={handleSave}
            onDelete={handleDelete}
            onAddEvent={onAddEvent} // Pass event creator down for Smart Suggestions
          />
      )}

    </div>
  );
};

export default NotesScreen;