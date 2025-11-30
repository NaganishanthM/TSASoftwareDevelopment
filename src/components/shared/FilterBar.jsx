import React from 'react';

const FilterBar = ({ selectedFilter, onSelect }) => {
  const filters = ['All Tasks', 'Important', 'Low Priority', 'Completed'];

  const mainGradient = 'linear-gradient(90deg, rgba(0, 183, 255, 0.7) 0%, rgba(185, 7, 255, 0.7) 100%)';
  const secondaryGradient = 'linear-gradient(90deg, rgba(0, 183, 255, 0.3) 0%, rgba(185, 7, 255, 0.3) 100%)';

  return (
    <div className="w-full overflow-x-auto no-scrollbar pl-6 py-4">
      <div className="flex gap-3">
        {filters.map((filter) => {
          const isActive = selectedFilter === filter;
          return (
            <button
              key={filter}
              onClick={() => onSelect(filter)}
              className="px-6 py-3 rounded-full shrink-0 transition-all duration-300 active:scale-95"
              style={{
                background: isActive ? mainGradient : secondaryGradient,
                boxShadow: '0px 6px 18.9px rgba(255, 255, 255, 0.1)',
                backdropFilter: 'blur(10px)',
              }}
            >
              <span 
                className="font-semibold text-white text-[16px]" 
                style={{ fontFamily: 'Lexend' }}
              >
                {filter}
              </span>
            </button>
          );
        })}
        {/* Spacer for right padding */}
        <div className="w-6 shrink-0" />
      </div>
    </div>
  );
};

export default FilterBar;