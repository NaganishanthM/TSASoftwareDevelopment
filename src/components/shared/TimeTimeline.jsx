import React, { useEffect, useRef, useState } from 'react';

const TimeTimeline = ({ events, selectedDate, onEventClick }) => {
  const scrollContainerRef = useRef(null);
  const [currentTimeMinutes, setCurrentTimeMinutes] = useState(0);

  const todayStr = new Date().toISOString().split('T')[0];
  const isToday = selectedDate === todayStr;

  const richGradientStr = `linear-gradient(90deg, rgba(0, 183, 255, 0.7) 0%, rgba(185, 7, 255, 0.7) 100%)`;

  useEffect(() => {
    const updateTime = () => {
        const now = new Date();
        const mins = now.getHours() * 60 + now.getMinutes();
        setCurrentTimeMinutes(mins);
    };
    updateTime();
    const interval = setInterval(updateTime, 60000);
    return () => clearInterval(interval);
  }, []);

  // --- AUTO-SCROLL TO CURRENT TIME ---
  useEffect(() => {
    if (scrollContainerRef.current) {
        const now = new Date();
        const currentHour = now.getHours(); // 0-23
        
        // Start 1 hour before now for context (e.g. if 2pm, show 1pm at top)
        // Math.max(0, ...) ensures we don't go negative if it's midnight
        const startHour = Math.max(0, currentHour - 1);
        
        // 94px is the height of one time slot
        const scrollPos = startHour * 91;
        
        scrollContainerRef.current.scrollTop = scrollPos; 
    }
  }, []);

  const pixelsPerMinute = 94 / 60;
  const currentLineTop = currentTimeMinutes * pixelsPerMinute;

  const hours = Array.from({ length: 24 }, (_, i) => {
    const h = i % 12 || 12;
    const ampm = i < 12 ? 'AM' : 'PM';
    return `${h} ${ampm}`;
  });

  return (
    <div className="w-full h-full relative overflow-hidden flex flex-col">
      
      <div 
        className="absolute top-0 left-0 w-full h-[230px] pointer-events-none z-20" 
        style={{ 
            background: 'linear-gradient(180deg, #000000 70%, rgba(0, 0, 0, 0) 100%)',
            backdropFilter: 'blur(10px)' 
        }} 
      />

      <div 
        ref={scrollContainerRef}
        className="w-full h-full overflow-y-auto no-scrollbar pb-32 pt-[220px]" 
      >
          <div className="px-[27px] relative min-h-[2400px]">
            
            {isToday && (
                <div 
                    className="absolute left-[10px] w-full flex items-center z-10 transition-all duration-1000 ease-in-out"
                    style={{ top: `${currentLineTop}px` }}
                >
                    <div className="w-[10px] h-[10px] rounded-full shrink-0 shadow-[0_0_10px_#00B7FF]" style={{ background: richGradientStr }} />
                    <div className="h-[1.5px] w-full ml-0 shadow-[0_0_10px_#00B7FF]" style={{ background: richGradientStr }} />
                </div>
            )}

            {hours.map((hour, index) => (
                <div key={index} className="relative h-[94px] w-full border-l-[0px]">
                    <span className="absolute left-0 top-0 text-[12px] font-medium tracking-[1px]" style={{ color: '#878C99', fontFamily: 'Lexend' }}>{hour}</span>
                    <div className="absolute left-[53px] right-0 top-[7px] h-[1px]" style={{ backgroundColor: '#2B303E' }} />
                </div>
            ))}

            {events.map((event) => {
                const [h, m] = event.startTime.split(':').map(Number);
                const startMins = h * 60 + m;
                const topPos = startMins * pixelsPerMinute;
                const height = (parseInt(event.duration) / 60) * 94;

                return (
                    <div 
                        key={event.id}
                        onClick={() => onEventClick(event)}
                        className="absolute left-[82px] z-10 animate-fade-in cursor-pointer active:scale-[0.98] transition-transform"
                        style={{
                            top: `${topPos + 7}px`, 
                            width: '229px',
                            height: `${height}px`,
                            borderRadius: '20px',
                            background: richGradientStr,
                            boxShadow: '0px 6px 18.9px rgba(255, 255, 255, 0.1)',
                            backdropFilter: 'blur(10px)'
                        }}
                    >
                        <div className="p-3 pl-4 h-full flex flex-col justify-center">
                            <h3 className="text-white font-semibold text-[20px] leading-[25px] truncate" style={{ fontFamily: 'Lexend' }}>
                                {event.title}
                            </h3>
                            <p className="text-white text-[12px] font-normal leading-[15px] mt-1 opacity-100" style={{ fontFamily: 'Lexend' }}>
                                {event.location || `${event.startTime} - ${parseInt(event.duration)}m`}
                            </p>
                        </div>
                    </div>
                );
            })}
            
            <div className="h-[50px]"></div>
          </div>
      </div>

      <div 
        className="absolute bottom-0 left-0 w-full h-[150px] pointer-events-none z-20"
        style={{
            background: 'linear-gradient(180deg, rgba(0, 0, 0, 0) 3.65%, #000000 100%)',
            backdropFilter: 'blur(10px)'
        }}
      />
    </div>
  );
};

export default TimeTimeline;