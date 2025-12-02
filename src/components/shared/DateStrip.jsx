import React, { useState, useRef, useEffect, useCallback, useLayoutEffect } from 'react';

//  HELPER FUNCTIONS 
const formatDateInfo = (dateObj) => {
  const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  
  const dayName = dateObj.toLocaleDateString('en-US', { weekday: 'long' });
  const dateNum = dateObj.getDate();
  
  return {
    id: dateObj.toISOString().split('T')[0], 
    day: dateObj.getDate().toString().padStart(2, '0'),
    month: months[dateObj.getMonth()],
    fullDate: `${dayName}, ${dateObj.getFullYear()}`,
    rawDate: dateObj
  };
};

const generateDateRange = (centerDate) => {
  const range = [];
  // 41 Items (Index 20 is center)
  for (let i = -20; i <= 20; i++) {
    const newDate = new Date(centerDate);
    newDate.setDate(centerDate.getDate() + i);
    range.push(formatDateInfo(newDate));
  }
  return range;
};

const DateStrip = ({ onDateSelected }) => {
  const [dates, setDates] = useState(() => generateDateRange(new Date()));
  const [currentTitle, setCurrentTitle] = useState(() => formatDateInfo(new Date()).fullDate);
  
  const scrollRef = useRef(null);
  const itemsRef = useRef({}); 
  const scrollTimeout = useRef(null);
  const rafRef = useRef(null);
  
  const isProgrammaticScroll = useRef(false);
  const isResetting = useRef(false); 
  const targetScrollId = useRef(null);

  //  STYLES 
  const mainGradient = 'linear-gradient(90deg, rgba(0, 183, 255, 0.7) 0%, rgba(185, 7, 255, 0.7) 100%)';
  const richGradientStr = `${mainGradient}, ${mainGradient}, ${mainGradient}`;

  useEffect(() => {
    if(onDateSelected) onDateSelected(dates[20].id);
  }, []);

  //  CORE ANIMATION LOOP (CLEAN VERSION) 
  // Removed all "Push" and "Margin" logic. Only Scale and Opacity.
  const updateVisuals = useCallback(() => {
    if (!scrollRef.current) return;

    const container = scrollRef.current;
    const centerPoint = container.scrollLeft + (container.offsetWidth / 2);
    
    let closestDist = Infinity;
    let closestId = null;

    dates.forEach((date) => {
      const el = itemsRef.current[date.id];
      if (!el) return;

      const elCenter = el.offsetLeft + (el.offsetWidth / 2);
      const dist = Math.abs(centerPoint - elCenter);
      
      if (dist < closestDist) {
        closestDist = dist;
        closestId = date.id;
      }

      // Range: 90px
      const range = 90; 
      const progress = Math.max(0, 1 - (dist / range)); 

      // 1. SCALE
      // Base: 1.0 (70px). Max: 1.57 (110px).
      const scale = 1.0 + (0.57 * progress); 
      
      // Apply Transform
      el.style.transform = `scale(${scale})`;
      
      // Z-Index: Ensures the active card sits ON TOP of neighbors if they overlap
      el.style.zIndex = Math.round(progress * 100); 

      // 2. OPACITY
      const gradientLayer = el.querySelector('.active-fill');
      if (gradientLayer) {
        gradientLayer.style.opacity = Math.pow(progress, 3); 
      }

      // 3. FONT STYLES
      const monthSpan = el.querySelector('.month-text');
      const daySpan = el.querySelector('.day-text');

      if (daySpan && monthSpan) {
         if (progress > 0.6) {
             // Active
             daySpan.style.fontWeight = '700';
             
             monthSpan.style.fontSize = '14px'; 
             monthSpan.style.lineHeight = '18px';
             monthSpan.style.fontWeight = '300';
             monthSpan.style.opacity = '1';
         } else {
             // Inactive
             daySpan.style.fontWeight = '400';
             
             monthSpan.style.fontSize = '12px';
             monthSpan.style.lineHeight = '19px';
             monthSpan.style.fontWeight = '300';
             monthSpan.style.opacity = '0.8';
         }
      }
    });

    if (closestId && !isResetting.current) {
        const activeDate = dates.find(d => d.id === closestId);
        if (activeDate && activeDate.fullDate !== currentTitle) {
            setCurrentTitle(activeDate.fullDate);
            if(onDateSelected) onDateSelected(activeDate.id);
        }
    }
  }, [dates, currentTitle]);


  //  SCROLL HANDLER 
  const handleScroll = () => {
    if (rafRef.current) cancelAnimationFrame(rafRef.current);
    rafRef.current = requestAnimationFrame(updateVisuals);

    if (isProgrammaticScroll.current || isResetting.current) return;

    if (scrollTimeout.current) clearTimeout(scrollTimeout.current);
    
    scrollTimeout.current = setTimeout(() => {
        if (!scrollRef.current) return;
        const container = scrollRef.current;
        const centerPoint = container.scrollLeft + (container.offsetWidth / 2);
        let closestId = null;
        let minDistance = Infinity;

        dates.forEach((date) => {
            const el = itemsRef.current[date.id];
            if (el) {
                const elCenter = el.offsetLeft + (el.offsetWidth / 2);
                const dist = Math.abs(elCenter - centerPoint);
                if (dist < minDistance) {
                    minDistance = dist;
                    closestId = date.id;
                }
            }
        });

        if (closestId) {
            const centerItem = dates[20];
            if (closestId !== centerItem.id) {
                const selectedDateObj = dates.find(d => d.id === closestId);
                if(selectedDateObj) handleDateSelection(selectedDateObj);
            } else {
                snapToId(closestId);
            }
        }
    }, 100); 
  };

  const snapToId = (id) => {
    isProgrammaticScroll.current = true;
    targetScrollId.current = id;
    
    let startTime = Date.now();
    const duration = 400;

    const animate = () => {
        if (Date.now() - startTime < duration) {
            updateVisuals();
            requestAnimationFrame(animate);
        } else {
            isProgrammaticScroll.current = false;
            targetScrollId.current = null;
        }
    };
    animate();
    
    if (itemsRef.current[id]) {
        itemsRef.current[id].scrollIntoView({
            behavior: 'smooth',
            block: 'nearest',
            inline: 'center'
        });
    }
  };

  const handleDateSelection = (dateObj) => {
    isProgrammaticScroll.current = true;
    if (itemsRef.current[dateObj.id]) {
        itemsRef.current[dateObj.id].scrollIntoView({
            behavior: 'smooth',
            block: 'nearest',
            inline: 'center'
        });
    }
    setTimeout(() => {
        isProgrammaticScroll.current = false;
        const newDates = generateDateRange(dateObj.rawDate);
        setDates(newDates);
    }, 400);
  };

  const handleDateClick = (dateObj) => {
    handleDateSelection(dateObj);
  };

  useLayoutEffect(() => {
    const container = scrollRef.current;
    if (container) {
        const centerItem = dates[20];
        const centerEl = itemsRef.current[centerItem.id];

        if(centerEl) {
            isResetting.current = true;
            container.style.scrollBehavior = 'auto';
            const elCenter = centerEl.offsetLeft + (centerEl.offsetWidth / 2);
            const containerCenter = container.offsetWidth / 2;
            container.scrollLeft = elCenter - containerCenter;
            
            updateVisuals();

            setTimeout(() => {
                container.style.scrollBehavior = 'smooth';
                isResetting.current = false;
            }, 50);
        }
    }
  }, [dates]);

  useEffect(() => {
      setTimeout(() => {
        const centerItem = dates[20];
        if (itemsRef.current[centerItem.id]) {
            itemsRef.current[centerItem.id].scrollIntoView({ behavior: 'auto', inline: 'center' });
            updateVisuals();
        }
      }, 50);
  }, []);

  return (
    <div className="w-full pt-0 pb-4 shrink-0 z-20 relative">
      <div className="absolute left-0 top-0 w-[50px] h-[100%] z-30 pointer-events-none" style={{ background: 'linear-gradient(90deg, #000000 0%, rgba(0,0,0,0) 100%)', backdropFilter: 'blur(0.5px)' }} />
      <div className="absolute right-0 top-0 w-[50px] h-[100%] z-30 pointer-events-none" style={{ background: 'linear-gradient(90deg, rgba(0,0,0,0) 0%, #000000 100%)', backdropFilter: 'blur(0.5px)' }} />

      <div 
          ref={scrollRef}
          onScroll={handleScroll}
          className="flex items-center gap-[14px] px-[calc(50%-35px)] overflow-x-auto no-scrollbar py-14"
      >
          {dates.map((dateObj) => {
              return (
                  <button
                      key={dateObj.id}
                      ref={el => itemsRef.current[dateObj.id] = el}
                      onClick={() => handleDateClick(dateObj)}
                      className="shrink-0 flex flex-col items-center justify-center relative outline-none"
                      style={{ 
                          width: '70px', 
                          height: '70px', 
                          borderRadius: '26px', 
                          position: 'relative',
                          overflow: 'visible',
                      }}
                  >
                      {/* WRAPPER */}
                      <div className="absolute inset-0 rounded-[26px] overflow-hidden">
                          <div className="absolute inset-0 w-full h-full" style={{ backgroundColor: 'rgba(23, 23, 26, 0.7)', backdropFilter: 'blur(10px)' }} />
                          <div className="active-fill absolute inset-0 w-full h-full" style={{ background: richGradientStr, opacity: 0 }} />
                      </div>

                      {/* STROKE */}
                      <div className="absolute inset-0 pointer-events-none rounded-[26px] z-20" style={{ padding: '1.5px', background: mainGradient, WebkitMask: 'linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)', WebkitMaskComposite: 'xor', maskComposite: 'exclude', boxShadow: '0px 4px 12px rgba(255, 255, 255, 0.1)' }} />

                      {/* CONTENT */}
                      <div className="relative z-30 flex flex-col items-center justify-center pointer-events-none">
                        <span 
                            className="month-text text-white font-light transition-all duration-200"
                            style={{ 
                                fontFamily: 'Lexend',
                                marginBottom: '-4px',
                                fontSize: '12px',
                                lineHeight: '19px',
                            }}
                        >
                            {dateObj.month}
                        </span>
                        <span 
                            className="day-text text-[#E5E5E5] transition-all duration-200"
                            style={{ 
                                fontFamily: 'Lexend',
                                marginTop: '-4px', 
                                fontSize: '32px', 
                                lineHeight: '40px',
                                paddingLeft: '3px', 
                                textAlign: 'center'
                            }}
                        >
                            {dateObj.day}
                        </span>
                      </div>
                  </button>
              );
          })}
      </div>

      <div className="px-[27px] mt-[-21px]">
          <h2 className="font-medium text-[24px] leading-[30px]" style={{ fontFamily: 'Lexend', color: 'rgba(176, 176, 176, 0.8)' }}>
              {currentTitle}
          </h2>
      </div>
    </div>
  );
};

export default DateStrip;