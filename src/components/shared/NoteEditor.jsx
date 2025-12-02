import React, { useState, useEffect, useRef } from 'react';
import { ArrowLeft, Save, Paperclip, Trash2, FileText, X, Mic, MicOff, UploadCloud, Sparkles, Calendar } from 'lucide-react';

// ADDED prop: onAddEvent
const NoteEditor = ({ note, onClose, onSave, onDelete, onAddEvent }) => {
  const defaultState = {
    id: Date.now().toString(),
    title: '',
    subject: '',
    content: '',
    attachment: null
  };

  const [formData, setFormData] = useState(defaultState);
  const [isListening, setIsListening] = useState(false); 
  const [isProcessingAudio, setIsProcessingAudio] = useState(false);
  const [smartSuggestion, setSmartSuggestion] = useState(null); 
  
  const fileInputRef = useRef(null);
  const audioInputRef = useRef(null);
  const recognitionRef = useRef(null); 

  useEffect(() => {
    if (note) setFormData(note);
    return () => {
        if (recognitionRef.current) recognitionRef.current.stop();
    };
  }, [note]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  //  AUDIO FILE UPLOAD & SMART SIMULATION 
  const handleAudioUploadClick = () => {
      audioInputRef.current?.click();
  };

  const handleAudioFileChange = (e) => {
      const file = e.target.files[0];
      if (!file) return;

      setIsProcessingAudio(true);
      setSmartSuggestion(null);

      setTimeout(() => {
          const mockLecture = `[Transcribed from ${file.name}]: \n\n"Alright class, settle down. Today we are focusing on Newton's Second Law. Remember that Force equals Mass times Acceleration. F equals M A. This is the foundation of classical mechanics. We will go over free body diagrams in the lab. Also, pay attention: we have the Physics Unit Test tomorrow at 10 AM. Make sure you review Chapter 4 tonight. That is all."`;
          
          setFormData(prev => ({
              ...prev,
              title: prev.title || "Physics Lecture",
              subject: prev.subject || "Science",
              content: prev.content + (prev.content ? '\n\n' : '') + mockLecture
          }));
          
          setIsProcessingAudio(false);
          e.target.value = ''; 

          // SMART SCAN SIMULATION
          setTimeout(() => {
              setSmartSuggestion({
                  type: 'event',
                  title: 'Physics Unit Test',
                  time: 'Tomorrow at 10:00 AM',
                  rawText: 'Physics Unit Test tomorrow at 10 AM'
              });
          }, 800);

      }, 2500);
  };

  //  REAL EVENT CREATION LOGIC 
  const handleAcceptSuggestion = () => {
      // 1. Calculate "Tomorrow" based on current date
      const tomorrow = new Date();
      tomorrow.setDate(tomorrow.getDate() + 1);
      const dateStr = tomorrow.toISOString().split('T')[0];

      // 2. Create Valid Event Object
      const newEvent = {
          id: Date.now().toString(),
          title: smartSuggestion.title, // "Physics Unit Test"
          startTime: "10:00",
          duration: "60",
          date: dateStr,
          location: "Classroom",
          repeat: "none",
          reminder: "15",
          notes: `Created from Audio Note: "${formData.title}"`
      };

      // 3. Send to Global State
      if (onAddEvent) {
          onAddEvent(newEvent);
          alert("Event Created Successfully!"); // Feedback
      }
      
      // 4. Clear Suggestion
      setSmartSuggestion(null);
  };

  //  LIVE TRANSCRIPTION 
  const toggleTranscription = () => {
    if (isListening) stopTranscription();
    else startTranscription();
  };

  const startTranscription = () => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) return;
    
    const recognition = new SpeechRecognition();
    recognition.continuous = true; 
    recognition.interimResults = true; 
    recognition.lang = 'en-US';

    recognition.onstart = () => setIsListening(true);
    
    recognition.onresult = (event) => {
      let finalTranscript = '';
      for (let i = event.resultIndex; i < event.results.length; ++i) {
        if (event.results[i].isFinal) {
          finalTranscript += event.results[i][0].transcript + ' ';
        }
      }
      if (finalTranscript) {
        setFormData(prev => ({
            ...prev,
            content: prev.content + (prev.content ? ' ' : '') + finalTranscript
        }));
      }
    };

    recognition.onerror = (event) => {
        if (event.error === 'not-allowed') setIsListening(false);
    };
    recognition.onend = () => {
        if (isListening) try { recognition.start(); } catch(e) {}
    };
    recognitionRef.current = recognition;
    recognition.start();
  };

  const stopTranscription = () => {
      setIsListening(false);
      if (recognitionRef.current) recognitionRef.current.stop();
  };

  //  ATTACHMENTS 
  const handleAttachClick = () => fileInputRef.current?.click();
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
        setFormData(prev => ({
            ...prev,
            attachment: { name: file.name, size: (file.size / 1024).toFixed(1) + ' KB', type: file.type }
        }));
    }
  };
  const removeAttachment = (e) => {
    e.stopPropagation();
    setFormData(prev => ({ ...prev, attachment: null }));
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const handleSave = () => {
    if (!formData.title) return;
    stopTranscription(); 
    onSave(formData);
    onClose();
  };

  const handleDelete = () => {
    if (note && onDelete) {
        onDelete(note.id);
        onClose();
    }
  };

  // Styles
  const mainGradient = 'linear-gradient(90deg, rgba(0, 183, 255, 0.7) 0%, rgba(185, 7, 255, 0.7) 100%)';
  const glassFill = 'rgba(23, 23, 26, 0.1)';
  const inputBase = "w-full bg-transparent outline-none text-[#E5E5E5] font-light placeholder-white/20 transition-all";

  return (
    <div className="fixed inset-0 z-[200] bg-black flex flex-col animate-slide-up">
        
        {/* HEADER */}
        <div className="flex justify-between items-center px-6 pt-12 pb-6 shrink-0 z-20">
            <button onClick={onClose} className="relative w-12 h-12 rounded-full flex items-center justify-center active:scale-90 transition-transform">
                <div className="absolute inset-0 rounded-full" style={{ background: glassFill, backdropFilter: 'blur(10px)' }} />
                <div className="absolute inset-0 pointer-events-none rounded-full" style={{ padding: '1.5px', background: mainGradient, WebkitMask: 'linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)', WebkitMaskComposite: 'xor', maskComposite: 'exclude', boxShadow: '0px 6px 18.9px rgba(255, 255, 255, 0.1)' }} />
                <ArrowLeft size={24} color="white" className="relative z-10" />
            </button>

            <h2 className="text-2xl font-bold text-[#E5E5E5]" style={{ fontFamily: 'Lexend' }}>
                {note ? 'Edit Note' : 'New Note'}
            </h2>

            <div className="flex gap-3">
                {note && (
                    <button onClick={handleDelete} className="relative w-12 h-12 rounded-full flex items-center justify-center active:scale-90 transition-transform">
                        <div className="absolute inset-0 rounded-full" style={{ background: glassFill, backdropFilter: 'blur(10px)' }} />
                        <div className="absolute inset-0 pointer-events-none rounded-full" style={{ padding: '1.5px', background: mainGradient, WebkitMask: 'linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)', WebkitMaskComposite: 'xor', maskComposite: 'exclude', boxShadow: '0px 6px 18.9px rgba(255, 255, 255, 0.1)' }} />
                        <Trash2 size={22} className="relative z-10 text-red-500" />
                    </button>
                )}
                <button onClick={handleSave} className="relative w-12 h-12 rounded-full flex items-center justify-center active:scale-90 transition-transform">
                    <div className="absolute inset-0 rounded-full" style={{ background: glassFill, backdropFilter: 'blur(10px)' }} />
                    <div className="absolute inset-0 pointer-events-none rounded-full" style={{ padding: '1.5px', background: mainGradient, WebkitMask: 'linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)', WebkitMaskComposite: 'xor', maskComposite: 'exclude', boxShadow: '0px 6px 18.9px rgba(255, 255, 255, 0.1)' }} />
                    <Save size={22} color="white" className="relative z-10" />
                </button>
            </div>
        </div>

        {/* EDITOR BODY */}
        <div className="flex-1 overflow-y-auto px-6 pb-12 flex flex-col gap-6 relative z-10 no-scrollbar">
            
            {/* META CARD */}
            <div className="relative w-full rounded-[32px] shrink-0">
                <div className="absolute inset-0 pointer-events-none rounded-[32px] z-20" style={{ padding: '1.5px', background: mainGradient, WebkitMask: 'linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)', WebkitMaskComposite: 'xor', maskComposite: 'exclude', boxShadow: '0px 6px 18.9px rgba(255, 255, 255, 0.1)' }} />
                <div className="relative z-10 backdrop-blur-xl rounded-[32px] p-6 flex flex-col gap-4" style={{ backgroundColor: glassFill }}>
                    <div className="flex flex-col gap-1">
                        <label className="text-[#B0B0B0] text-xs font-medium uppercase tracking-wider ml-1">Title</label>
                        <input name="title" value={formData.title} onChange={handleChange} placeholder="Enter title..." className={`${inputBase} text-2xl font-bold`} style={{ fontFamily: 'Lexend' }} autoFocus={!note} />
                    </div>
                    <div className="h-[1px] w-full bg-white/5" />
                    <div className="flex flex-col gap-1">
                        <label className="text-[#B0B0B0] text-xs font-medium uppercase tracking-wider ml-1">Subject</label>
                        <input name="subject" value={formData.subject} onChange={handleChange} placeholder="e.g. Science, Personal..." className={`${inputBase} text-lg text-[#00B7FF]`} style={{ fontFamily: 'Lexend' }} />
                    </div>
                </div>
            </div>

            {/* CONTENT CARD */}
            <div className="relative w-full flex-1 min-h-[300px] rounded-[32px]">
                <div 
                    className="absolute inset-0 pointer-events-none rounded-[32px] z-20 transition-all duration-300" 
                    style={{ 
                        padding: '1.5px', 
                        background: isListening ? 'linear-gradient(90deg, #FF4444, #FF0000)' : isProcessingAudio ? 'linear-gradient(90deg, #00FF00, #00CC00)' : mainGradient, 
                        WebkitMask: 'linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)', 
                        WebkitMaskComposite: 'xor', 
                        maskComposite: 'exclude', 
                        boxShadow: isListening ? '0px 0px 20px rgba(255, 0, 0, 0.3)' : isProcessingAudio ? '0px 0px 20px rgba(0, 255, 0, 0.3)' : '0px 6px 18.9px rgba(255, 255, 255, 0.1)' 
                    }} 
                />
                
                <div className="relative z-10 backdrop-blur-xl rounded-[32px] p-6 h-full flex flex-col" style={{ backgroundColor: glassFill }}>
                    <div className="flex justify-between items-center mb-2">
                        <label className="text-[#B0B0B0] text-xs font-medium uppercase tracking-wider ml-1">
                            {isListening ? "Listening..." : isProcessingAudio ? "Analyzing Audio..." : "Content"}
                        </label>
                        {isListening && <div className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />}
                        {isProcessingAudio && <div className="w-2 h-2 rounded-full bg-green-500 animate-bounce" />}
                    </div>
                    <textarea 
                        name="content"
                        value={formData.content}
                        onChange={handleChange}
                        placeholder={isListening ? "Speak now..." : isProcessingAudio ? "Transcribing and scanning for events..." : "Start typing, tap the mic, or upload audio..."}
                        disabled={isProcessingAudio}
                        className={`${inputBase} flex-1 resize-none text-lg leading-relaxed disabled:opacity-50`}
                        style={{ fontFamily: 'Lexend' }}
                    />
                </div>
            </div>

            {/* FOOTER ACTIONS */}
            <div className="flex gap-4">
                {/* ATTACHMENT */}
                <input type="file" ref={fileInputRef} className="hidden" onChange={handleFileChange} />
                {!formData.attachment ? (
                    <button onClick={handleAttachClick} className="flex-[2] h-[60px] rounded-[30px] flex items-center justify-center gap-3 relative overflow-hidden group active:scale-[0.98] transition-transform">
                        <div className="absolute inset-0 backdrop-blur-xl" style={{ backgroundColor: glassFill }} />
                        <div className="absolute inset-0 pointer-events-none rounded-[30px]" style={{ padding: '1.5px', background: mainGradient, WebkitMask: 'linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)', WebkitMaskComposite: 'xor', maskComposite: 'exclude' }} />
                        <Paperclip size={20} className="text-[#00B7FF] relative z-10" />
                        <span className="text-[#E5E5E5] font-medium relative z-10">Add Attachment</span>
                    </button>
                ) : (
                    <div className="flex-[2] h-[60px] rounded-[30px] flex items-center justify-between px-6 relative overflow-hidden animate-slide-up">
                        <div className="absolute inset-0 backdrop-blur-xl" style={{ backgroundColor: glassFill }} />
                        <div className="absolute inset-0 pointer-events-none rounded-[30px]" style={{ padding: '1.5px', background: mainGradient, WebkitMask: 'linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)', WebkitMaskComposite: 'xor', maskComposite: 'exclude' }} />
                        <div className="relative z-10 flex items-center gap-3 min-w-0">
                            <FileText size={16} className="text-[#00B7FF] shrink-0" />
                            <span className="text-[#E5E5E5] font-medium text-sm truncate">{formData.attachment.name}</span>
                        </div>
                        <button onClick={removeAttachment} className="relative z-10 p-2 bg-white/10 rounded-full hover:bg-red-500/20 transition-colors"><X size={18} className="text-white hover:text-red-500" /></button>
                    </div>
                )}

                {/* AUDIO UPLOAD */}
                <input type="file" accept="audio/*" ref={audioInputRef} className="hidden" onChange={handleAudioFileChange} />
                <button onClick={handleAudioUploadClick} className="w-[60px] h-[60px] rounded-[30px] flex items-center justify-center relative overflow-hidden shrink-0 active:scale-90 transition-transform">
                    <div className="absolute inset-0 backdrop-blur-xl" style={{ backgroundColor: glassFill }} />
                    <div className="absolute inset-0 pointer-events-none rounded-[30px]" style={{ padding: '1.5px', background: mainGradient, WebkitMask: 'linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)', WebkitMaskComposite: 'xor', maskComposite: 'exclude' }} />
                    <UploadCloud size={24} className="text-[#B907FF] relative z-10" />
                </button>

                {/* LIVE MIC */}
                <button onClick={toggleTranscription} className={`w-[60px] h-[60px] rounded-[30px] flex items-center justify-center relative overflow-hidden shrink-0 active:scale-90 transition-transform ${isListening ? 'animate-pulse' : ''}`}>
                    <div className="absolute inset-0 backdrop-blur-xl" style={{ backgroundColor: glassFill }} />
                    <div className="absolute inset-0 pointer-events-none rounded-[30px]" style={{ padding: '1.5px', background: isListening ? 'linear-gradient(90deg, #FF4444, #FF0000)' : mainGradient, WebkitMask: 'linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)', WebkitMaskComposite: 'xor', maskComposite: 'exclude' }} />
                    {isListening ? <MicOff size={24} className="text-red-500 relative z-10" /> : <Mic size={24} className="text-[#00B7FF] relative z-10" />}
                </button>
            </div>
        </div>

        {/*  SMART SUGGESTION TOAST  */}
        {smartSuggestion && (
            <div className="absolute bottom-[100px] left-6 right-6 z-50 animate-slide-up">
                <div className="relative w-full rounded-[24px] overflow-hidden p-[1.5px]">
                    {/* Gradient Border */}
                    <div className="absolute inset-0 bg-gradient-to-r from-[#00B7FF] to-[#B907FF]" />
                    
                    {/* Content */}
                    <div className="relative bg-[#17171A] rounded-[23px] p-4 flex items-center justify-between backdrop-blur-xl">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center text-[#B907FF]">
                                <Sparkles size={20} />
                            </div>
                            <div>
                                <p className="text-[#B0B0B0] text-xs uppercase font-bold tracking-wider">Event Detected</p>
                                <h4 className="text-white font-medium text-sm">{smartSuggestion.title}</h4>
                                <p className="text-[#00B7FF] text-xs">{smartSuggestion.time}</p>
                            </div>
                        </div>
                        
                        <div className="flex gap-2">
                            <button onClick={() => setSmartSuggestion(null)} className="p-2 rounded-full hover:bg-white/10 text-[#B0B0B0]"><X size={18} /></button>
                            <button onClick={handleAcceptSuggestion} className="px-4 py-2 rounded-full bg-gradient-to-r from-[#00B7FF] to-[#B907FF] text-white text-sm font-bold shadow-lg active:scale-95 transition-transform">
                                Add
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        )}

        <div className="absolute top-0 left-0 w-full h-[100px] pointer-events-none z-0" style={{ background: 'linear-gradient(180deg, #000000 0%, rgba(0, 0, 0, 0) 100%)' }} />
        <div className="absolute bottom-0 left-0 w-full h-[50px] pointer-events-none z-0" style={{ background: 'linear-gradient(0deg, #000000 0%, rgba(0, 0, 0, 0) 100%)' }} />

        <style>{`
            .animate-slide-up { animation: slideUp 0.4s cubic-bezier(0.16, 1, 0.3, 1) backwards; }
            @keyframes slideUp { from { transform: translateY(100px); opacity: 0; } to { transform: translateY(0); opacity: 1; } }
        `}</style>
    </div>
  );
};

export default NoteEditor;