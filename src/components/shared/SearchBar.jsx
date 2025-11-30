import React, { useState, useRef, useEffect } from 'react';
import { BsMicFill } from "react-icons/bs"; 

const SearchBar = ({ value, onChange }) => {
  const [isListening, setIsListening] = useState(false);
  const recognitionRef = useRef(null);
  const silenceTimer = useRef(null); 

  // --- SPEECH LOGIC ---
  const toggleListening = () => {
    if (isListening) {
      stopListening();
    } else {
      startListening();
    }
  };

  const startListening = () => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) return;

    const recognition = new SpeechRecognition();
    recognition.continuous = true; 
    recognition.interimResults = true; 
    recognition.lang = 'en-US';

    recognition.onstart = () => {
        setIsListening(true);
        resetSilenceTimer();
    };

    recognition.onresult = (event) => {
      resetSilenceTimer();
      let finalTranscript = '';

      for (let i = event.resultIndex; i < event.results.length; ++i) {
          if (event.results[i].isFinal) {
              finalTranscript += event.results[i][0].transcript;
          }
      }

      if (finalTranscript) {
          const newText = value ? `${value} ${finalTranscript}` : finalTranscript;
          onChange(newText);
      }
    };

    recognition.onerror = () => stopListening();
    recognition.onend = () => setIsListening(false);

    recognitionRef.current = recognition;
    recognition.start();
  };

  const resetSilenceTimer = () => {
      if (silenceTimer.current) clearTimeout(silenceTimer.current);
      silenceTimer.current = setTimeout(() => {
          stopListening();
      }, 2500);
  };

  const stopListening = () => {
    if (recognitionRef.current) recognitionRef.current.stop();
    if (silenceTimer.current) clearTimeout(silenceTimer.current);
    setIsListening(false);
  };

  useEffect(() => {
    return () => stopListening();
  }, []);

  return (
    <div 
        className="w-full flex flex-row justify-between items-center px-[20px] gap-[10px] relative transition-all duration-300"
        style={{
            height: '58px',
            backgroundColor: 'rgba(23, 23, 26, 0.6)',
            border: isListening ? '1px solid #00B7FF' : '1px solid rgba(255, 255, 255, 0.2)',
            boxShadow: isListening ? '0px 0px 15px rgba(0, 183, 255, 0.3)' : '0px 6px 18.9px rgba(255, 255, 255, 0.1)',
            backdropFilter: 'blur(10px)',
            borderRadius: '40px'
        }}
    >
        {/* REMOVED: BsSearch Icon */}

        {/* Input Field */}
        <input 
            type="text" 
            value={value}
            onChange={(e) => onChange(e.target.value)}
            placeholder={isListening ? "Listening..." : "Search through your items..."}
            className="flex-grow bg-transparent border-none outline-none font-semibold text-[16px] leading-[20px]"
            style={{
                fontFamily: 'Lexend',
                color: '#E5E5E5', 
            }}
        />
        
        {/* Mic Button */}
        <button 
            onClick={toggleListening}
            className={`w-[30px] h-[30px] flex items-center justify-center shrink-0 rounded-full transition-transform active:scale-90 ${isListening ? 'animate-pulse' : ''}`}
        >
             <div style={{ width: 24, height: 24, position: 'relative' }}>
                <svg width="0" height="0">
                  <linearGradient id="search-mic-gradient" x1="0%" y1="0%" x2="100%" y2="0%">
                    <stop stopColor={isListening ? "#FF4444" : "rgba(0, 183, 255, 0.7)"} offset="0%" />
                    <stop stopColor={isListening ? "#FF0000" : "rgba(185, 7, 255, 0.7)"} offset="100%" />
                  </linearGradient>
                </svg>
                <BsMicFill 
                    size={24} 
                    style={{ 
                        fill: "url(#search-mic-gradient)", 
                        filter: isListening ? "drop-shadow(0 0 5px rgba(255, 0, 0, 0.5))" : "none" 
                    }} 
                />
             </div>
        </button>

        <style>{`
            /* Gradient Placeholder Trick */
            input::placeholder {
                background: linear-gradient(90deg, rgba(0, 183, 255, 0.7) 0%, rgba(185, 7, 255, 0.7) 100%);
                -webkit-background-clip: text;
                -webkit-text-fill-color: transparent;
                background-clip: text;
                text-fill-color: transparent;
                opacity: 1; 
            }
        `}</style>
    </div>
  );
};

export default SearchBar;