import React, { useState, useRef, useEffect } from 'react';
import { BsMicFill } from "react-icons/bs"; 

const QuickInputBar = ({ onEnter, onClose }) => {
  const [text, setText] = useState('');
  const [isListening, setIsListening] = useState(false);
  const [placeholderText, setPlaceholderText] = useState("Physics test tomorrow at 5pm...");
  
  // Refs
  const recognitionRef = useRef(null);
  const silenceTimer = useRef(null); 
  const confirmationRetryCount = useRef(0);
  const isConfirmingRef = useRef(false); 
  const textRef = useRef(''); 
  const inputRef = useRef(null); // Ref for the input element

  // Sync ref with state
  useEffect(() => { textRef.current = text; }, [text]);

  // Auto-scroll input to the end when text changes
  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.scrollLeft = inputRef.current.scrollWidth;
    }
  }, [text]);

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && text.trim().length > 0) {
      onEnter(text);
      setText('');
    }
  };

  const speak = (message, onEndCallback) => {
    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(message);
    utterance.lang = 'en-US';
    utterance.rate = 1.0;
    utterance.onend = () => {
      if (onEndCallback) onEndCallback();
    };
    window.speechSynthesis.speak(utterance);
  };

  const toggleListening = () => {
    if (isListening) {
      if (recognitionRef.current) recognitionRef.current.stop();
    } else {
      startMainRecording();
    }
  };

  // --- PHASE 1: MAIN RECORDING ---
  const startMainRecording = () => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) {
        setPlaceholderText("Voice input not supported");
        return;
    }

    setText(''); 
    isConfirmingRef.current = false;
    confirmationRetryCount.current = 0;
    if (silenceTimer.current) clearTimeout(silenceTimer.current);

    const recognition = new SpeechRecognition();
    recognition.continuous = true; 
    
    // FIX 1: Enable Interim Results
    // This allows us to receive events WHILE you are speaking, not just at the end.
    recognition.interimResults = true; 
    
    recognition.lang = 'en-US';

    recognition.onstart = () => {
        setIsListening(true);
        setPlaceholderText("Listening...");
        resetSilenceTimer(4000); 
    };

    recognition.onresult = (event) => {
      // FIX 2: Reset timer on ANY sound detected (interim or final)
      // This prevents the mic from cutting off while you are in the middle of a long sentence.
      resetSilenceTimer(3000);

      let finalTranscript = '';

      // Loop through results to find the finalized parts
      for (let i = event.resultIndex; i < event.results.length; ++i) {
          if (event.results[i].isFinal) {
              finalTranscript += event.results[i][0].transcript;
          }
      }

      // Only update text state with FINAL results to avoid jittery duplicates
      if (finalTranscript) {
          setText((prev) => {
              const spacer = prev && !prev.endsWith(' ') ? ' ' : '';
              return prev + spacer + finalTranscript;
          });
      }
    };

    recognition.onerror = (event) => {
        if (event.error === 'no-speech') return; 
        console.warn("Speech Error:", event.error);
        hardStop();
    };
    
    recognition.onend = () => {
       if (!isConfirmingRef.current && textRef.current.trim().length > 0) {
           startConfirmationFlow();
       } else if (!isConfirmingRef.current) {
           setIsListening(false);
           setPlaceholderText("Physics test tomorrow at 5pm...");
       }
    };

    recognitionRef.current = recognition;
    recognition.start();
  };

  // --- PHASE 2: CONFIRMATION FLOW ---
  const startConfirmationFlow = () => {
      isConfirmingRef.current = true;
      setIsListening(true); 
      
      if (silenceTimer.current) clearTimeout(silenceTimer.current);

      const message = `${textRef.current}. Is this correct?`;
      setPlaceholderText("Is this correct? (Yes/No)");
      
      speak(message, () => {
          startConfirmationListening();
      });
  };

  const startConfirmationListening = () => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    const recognition = new SpeechRecognition();
    
    recognition.continuous = false; 
    recognition.lang = 'en-US';
    recognition.interimResults = false; // Simple yes/no doesn't need interim

    recognition.onstart = () => {
        resetSilenceTimer(4000);
    };

    recognition.onresult = (event) => {
        const answer = event.results[0][0].transcript.toLowerCase().trim();
        handleConfirmationResponse(answer);
    };

    recognition.onerror = (event) => {
        if (event.error !== 'aborted') {
            handleConfirmationRetry();
        }
    };
    
    recognitionRef.current = recognition;
    recognition.start();
  };

  // --- PHASE 3: LOGIC ---
  const handleConfirmationResponse = (answer) => {
      if (silenceTimer.current) clearTimeout(silenceTimer.current);
      
      const cleanAnswer = answer.replace(/[.,!]/g, '');

      if (['yes', 'yeah', 'correct', 'sure', 'yep'].includes(cleanAnswer)) {
          speak("Event created.", () => {
              onEnter(textRef.current);
              onClose();
          });
      } else if (['no', 'nope', 'incorrect', 'wrong'].includes(cleanAnswer)) {
          speak("Recording again.", () => {
              setText('');
              setTimeout(startMainRecording, 200); 
          });
      } else {
          handleConfirmationRetry();
      }
  };

  const handleConfirmationRetry = () => {
      if (confirmationRetryCount.current < 3) {
          confirmationRetryCount.current += 1;
          setPlaceholderText(`Retry ${confirmationRetryCount.current}/3...`);
          
          setTimeout(() => {
             speak("Is this correct?", () => {
                 startConfirmationListening();
             });
          }, 1000);
      } else {
          speak("Please type manually.");
          hardStop();
      }
  };

  // --- TIMERS ---
  const resetSilenceTimer = (ms) => {
      if (silenceTimer.current) clearTimeout(silenceTimer.current);
      silenceTimer.current = setTimeout(() => {
          if (recognitionRef.current) {
              recognitionRef.current.stop();
          }
      }, ms);
  };

  const hardStop = () => {
    if (recognitionRef.current) recognitionRef.current.abort();
    if (silenceTimer.current) clearTimeout(silenceTimer.current);
    window.speechSynthesis.cancel();
    setIsListening(false);
    isConfirmingRef.current = false;
    setPlaceholderText("Physics test tomorrow at 5pm...");
  };

  useEffect(() => {
    return () => hardStop();
  }, []);

  return (
    <div className="fixed inset-0 z-[100] flex flex-col justify-end items-center pb-6">
        
        <div 
            className="absolute inset-0 bg-black/20 backdrop-blur-md"
            onClick={onClose}
        />

        <div 
            className="flex flex-row justify-between items-center px-[20px] py-[17px] gap-[10px] animate-slide-up relative z-10"
            style={{
                boxSizing: 'border-box',
                width: '372px',
                height: '58px',
                backgroundColor: 'rgba(23, 23, 26, 0.8)',
                border: isListening 
                    ? (isConfirmingRef.current ? '1px solid #00FF00' : '1px solid #00B7FF') 
                    : '1px solid rgba(255, 255, 255, 0.2)', 
                boxShadow: isListening ? '0px 0px 20px rgba(0, 183, 255, 0.3)' : '0px 6px 18.9px rgba(255, 255, 255, 0.1)',
                backdropFilter: 'blur(20px)',
                borderRadius: '40px',
                transition: 'all 0.3s ease'
            }}
        >
            <input 
                ref={inputRef} // Attached Ref for auto-scroll
                autoFocus
                type="text"
                value={text}
                onChange={(e) => setText(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder={placeholderText}
                className="flex-grow bg-transparent border-none outline-none font-semibold text-[16px] leading-[20px]"
                style={{
                    fontFamily: 'Lexend',
                    color: '#E5E5E5',
                    '--placeholder-color': isListening ? '#FFFFFF' : 'linear-gradient(90deg, #00B7FF 0%, #B907FF 100%)'
                }}
            />
            
            <button 
                onClick={toggleListening}
                className={`w-[30px] h-[30px] flex items-center justify-center shrink-0 rounded-full transition-transform duration-200 active:scale-90 ${isListening ? 'animate-pulse' : ''}`}
                style={{ outline: 'none' }}
            >
                 <div style={{ width: 24, height: 24, position: 'relative' }}>
                    <svg width="0" height="0">
                      <linearGradient id="mic-gradient" x1="0%" y1="0%" x2="100%" y2="0%">
                        <stop stopColor={isListening ? "#FF4444" : "rgba(0, 183, 255, 0.7)"} offset="0%" />
                        <stop stopColor={isListening ? "#FF0000" : "rgba(185, 7, 255, 0.7)"} offset="100%" />
                      </linearGradient>
                    </svg>
                    
                    <BsMicFill size={20} style={{ fill: "url(#mic-gradient)", filter: isListening ? "drop-shadow(0 0 5px rgba(255, 0, 0, 0.5))" : "none" }} />
                 </div>
            </button>
        </div>

        <style>{`
            .animate-slide-up {
                animation: slideUp 0.3s cubic-bezier(0.16, 1, 0.3, 1) forwards;
            }
            @keyframes slideUp {
                from { transform: translateY(100%); opacity: 0; }
                to { transform: translateY(0); opacity: 1; }
            }
            input::placeholder {
                background: var(--placeholder-color);
                -webkit-background-clip: text;
                -webkit-text-fill-color: transparent;
                opacity: 1;
            }
        `}</style>
    </div>
  );
};

export default QuickInputBar;