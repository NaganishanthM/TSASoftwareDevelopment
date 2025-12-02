import React from 'react';
import { 
  BsBellFill, 
  BsPaletteFill, 
  BsShieldLockFill, 
  BsShieldCheck, 
  BsQuestionCircleFill, 
  BsBoxArrowRight, 
  BsPersonCircle 
} from "react-icons/bs";
import MenuButton from '../components/shared/MenuButton';

const MenuScreen = () => {

  const mainGradient = 'linear-gradient(90deg, rgba(0, 183, 255, 0.7) 0%, rgba(185, 7, 255, 0.7) 100%)';

  return (
    <div className="h-full w-full relative bg-black overflow-hidden flex flex-col">
      
      {/*  HEADER  */}
      <div className="px-[23px] pt-[68px] shrink-0 z-10">
        <h1 
          className="font-bold text-[#E5E5E5]"
          style={{ fontFamily: 'Lexend', fontSize: '48px', lineHeight: '60px' }}
        >
          Menu
        </h1>
      </div>

      {/* --- SCROLLABLE CONTENT --- */}
      <div className="flex-1 w-full overflow-y-auto no-scrollbar px-[23px] pb-32 pt-6">
         
         {/* --- PROFILE CARD --- */}
         {/* Matches CSS: 352x159, Gradient Stroke, Glass Fill */}
         <div className="relative w-full h-[159px] shrink-0 mb-[19px] group active:scale-[0.99] transition-transform">
            {/* Gradient Border */}
            <div 
                className="absolute inset-0 pointer-events-none rounded-[40px] z-20"
                style={{
                    padding: '1.5px', 
                    background: mainGradient, 
                    WebkitMask: 'linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)',
                    WebkitMaskComposite: 'xor',
                    maskComposite: 'exclude',
                    boxShadow: '0px 6px 18.9px rgba(255, 255, 255, 0.1)'
                }}
            />
            
            {/* Content */}
            <div 
                className="absolute inset-0 w-full h-full rounded-[40px] z-10 flex items-center px-8"
                style={{
                    background: 'rgba(23, 23, 26, 0.7)',
                    backdropFilter: 'blur(10px)',
                }}
            >
                {/* Avatar with Gradient Ring */}
                <div className="w-[90px] h-[90px] shrink-0 relative flex items-center justify-center">
                    {/* Avatar Border */}
                    <div className="absolute inset-0 rounded-[40px] pointer-events-none" style={{ padding: '2px', background: mainGradient, WebkitMask: 'linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)', WebkitMaskComposite: 'xor', maskComposite: 'exclude' }} />
                    
                    {/* Avatar Image/Icon */}
                    <div className="w-full h-full rounded-[40px] bg-[#17171A] flex items-center justify-center overflow-hidden">
                         <BsPersonCircle size={48} className="text-[#00B7FF]" />
                    </div>
                </div>

                {/* User Info */}
                <div className="ml-6 flex flex-col justify-center min-w-0">
                    <h2 
                        className="text-[#E5E5E5] font-semibold truncate"
                        style={{ fontFamily: 'Lexend', fontSize: '24px', lineHeight: '30px' }}
                    >
                        Example Name
                    </h2>
                    <p 
                        className="text-[#B0B0B0] font-normal truncate"
                        style={{ fontFamily: 'Lexend', fontSize: '16px', lineHeight: '20px' }}
                    >
                        example@gmail.com
                    </p>
                </div>
            </div>
         </div>

         {/* --- MENU BUTTONS LIST --- */}
         <div className="flex flex-col gap-[19px]">
            <MenuButton icon={BsBellFill} label="Notifications" onClick={() => console.log("Notifications")} />
            <MenuButton icon={BsPaletteFill} label="Appearance" onClick={() => console.log("Appearance")} />
            <MenuButton icon={BsShieldLockFill} label="Privacy" onClick={() => console.log("Privacy")} />
            <MenuButton icon={BsShieldCheck} label="Security" onClick={() => console.log("Security")} />
            <MenuButton icon={BsQuestionCircleFill} label="Help" onClick={() => console.log("Help")} />
            <MenuButton icon={BsBoxArrowRight} label="Log Out" onClick={() => console.log("Log Out")} isDanger />
         </div>

         {/* Spacer for bottom nav */}
         <div className="h-10"></div>
      </div>

      {/* --- BOTTOM FADE --- */}
      <div 
        className="absolute bottom-0 left-0 w-full h-[100px] pointer-events-none z-20"
        style={{
            background: 'linear-gradient(180deg, rgba(0, 0, 0, 0) 3.65%, #000000 50.29%)',
            backdropFilter: 'blur(10px)'
        }}
      />

    </div>
  );
};

export default MenuScreen;