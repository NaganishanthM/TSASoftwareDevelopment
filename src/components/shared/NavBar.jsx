import React, { useMemo } from 'react';
import { 
  BsHouseDoorFill, 
  BsCalendarEventFill, 
  BsCheckCircleFill, 
  BsFileEarmarkTextFill, 
  BsGridFill, 
  BsSearch 
} from "react-icons/bs";

const NavBar = ({ currentScreen, setCurrentScreen, onSearchClick }) => {
    
  const navItems = useMemo(() => [
      { id: 'dashboard', icon: BsHouseDoorFill },
      { id: 'events', icon: BsCalendarEventFill },
      { id: 'reminders', icon: BsCheckCircleFill },
      { id: 'notes', icon: BsFileEarmarkTextFill },
      { id: 'menu', icon: BsGridFill },
  ], []);

  const activeIndex = navItems.findIndex(item => item.id === currentScreen);

  const richGradientStr = `
    linear-gradient(90deg, rgba(0, 183, 255, 0.7) 0%, rgba(185, 7, 255, 0.7) 100%),
    linear-gradient(90deg, rgba(0, 183, 255, 0.7) 0%, rgba(185, 7, 255, 0.7) 100%),
    linear-gradient(90deg, rgba(0, 183, 255, 0.7) 0%, rgba(185, 7, 255, 0.7) 100%)
  `;

  return (
    <div className="absolute bottom-6 left-0 right-0 flex justify-center items-center z-50 pointer-events-none">
      
      {/*  RECTANGLE 13: BOTTOM FADE GRADIENT  */}
      <div 
        className="absolute pointer-events-none"
        style={{
            width: '100%',
            height: '207px',
            left: '0px',
            bottom: '-24px',
            background: 'linear-gradient(180deg, rgba(0, 0, 0, 0) 3.65%, #000000 50.29%)',
            zIndex: 0
        }}
      />

      <div className="flex gap-4 items-center relative z-10">
        
        {/*  MAIN NAVIGATION PILL  */}
        <div 
            className="relative flex items-center px-1 pointer-events-auto"
            style={{
                width: '260px',
                height: '58px',
                backgroundColor: 'rgba(23, 23, 26, 0.6)',
                // No blur here as requested previously
                borderRadius: '79px',
                boxShadow: '0px 6px 18.9px rgba(255, 255, 255, 0.1)',
                justifyContent: 'space-between'
            }}
        >
            {/* THE SLIDING ACTIVE INDICATOR */}
            <div
                className="absolute top-[4px] bottom-[4px] rounded-[39px] transition-all duration-500"
                style={{
                    width: '50px',
                    height: '50px',
                    background: richGradientStr,
                    boxShadow: '0px 6px 18.9px rgba(255, 255, 255, 0.1)',
                    left: '4px', 
                    transform: `translateX(${activeIndex * 50.5}px) scale(${activeIndex === -1 ? 0.5 : 1})`,
                    opacity: activeIndex === -1 ? 0 : 1,
                    transitionTimingFunction: 'cubic-bezier(0.175, 0.885, 0.32, 1.275)' 
                }}
            />

            {/* ICON BUTTONS */}
            {navItems.map((item) => {
                const isActive = currentScreen === item.id;
                
                return (
                    <button 
                        key={item.id}
                        onClick={() => setCurrentScreen(item.id)}
                        className="flex items-center justify-center relative z-10 transition-colors duration-300"
                        style={{
                            width: '50px',
                            height: '50px',
                            borderRadius: '39px',
                            background: 'transparent', 
                        }}
                    >
                        <item.icon 
                            size={20} 
                            className="transition-colors duration-300"
                            color={isActive ? '#FFFFFF' : '#B0B0B0'} 
                            style={{
                                transform: isActive ? 'scale(1.1)' : 'scale(1)',
                                transition: 'transform 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275), color 0.3s ease'
                            }}
                        />
                    </button>
                )
            })}
        </div>

        {/*  SEARCH BUTTON  */}
        <button 
            onClick={onSearchClick} // Triggers the Global Search Overlay
            className="flex items-center justify-center pointer-events-auto active:scale-95 transition-transform duration-300"
            style={{
                width: '54px',
                height: '54px',
                borderRadius: '40px',
                background: richGradientStr,
                boxShadow: '0px 6px 18.9px rgba(255, 255, 255, 0.1)',
                backdropFilter: 'blur(10px)', // Kept blur here per earlier design
            }}
        >
           <BsSearch size={20} color="#FFFFFF" strokeWidth={0.5} />
        </button>

      </div>
    </div>
  );
};

export default NavBar;