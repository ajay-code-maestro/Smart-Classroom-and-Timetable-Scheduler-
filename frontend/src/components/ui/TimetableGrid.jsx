import React from 'react';
import { motion } from 'framer-motion';

const DAYS = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'];

const GRID_COLUMNS = [
  { id: 'day', label: 'HUB', width: '120px' },
  { id: '09:00', label: '9AM - 10AM', width: 'minmax(140px, 1fr)' },
  { id: '10:00', label: '10AM - 11AM', width: 'minmax(140px, 1fr)' },
  { id: '11:00', label: '11AM - 12PM', width: 'minmax(140px, 1fr)' },
  { id: 'lunch', label: 'LUNCH', width: '60px', isBreak: true },
  { id: '13:00', label: '1PM - 2PM', width: 'minmax(140px, 1fr)' },
  { id: '14:00', label: '2PM - 3PM', width: 'minmax(140px, 1fr)' },
  { id: '15:00', label: '3PM - 4PM', width: 'minmax(140px, 1fr)' },
];

export const TimetableGrid = ({ schedule = [], showFaculty = true }) => {
  const getEntry = (day, time) => {
    return schedule.find(s => s.day === day && s.startTime === time);
  };

  const templateColumns = GRID_COLUMNS.map(c => c.width).join(' ');

  return (
    <div className="w-full pb-8 pt-4 rounded-[3rem] overflow-x-auto overflow-y-hidden scrollbar-hide">
      <div 
        className="min-w-max border border-white/5 rounded-[3rem] bg-slate-950/40 backdrop-blur-3xl shadow-[0_0_150px_rgba(0,0,0,0.6)] relative overflow-hidden"
      >
        <div className="absolute inset-0 bg-gradient-to-tr from-primary/[0.05] via-transparent to-accent/[0.05] pointer-events-none" />
        
        {/* Master Grid Container */}
        <div 
          style={{ display: 'grid', gridTemplateColumns: templateColumns }}
          className="relative z-10 w-full"
        >
          {/* Header Row */}
          {GRID_COLUMNS.map((col, idx) => (
            <div 
              key={col.id} 
              style={{ gridColumn: idx + 1, gridRow: 1 }}
              className="p-4 py-6 font-black text-[10px] tracking-[0.15em] uppercase text-white/50 text-center border-r border-b border-white/5 last:border-r-0 bg-white/[0.02] backdrop-blur-3xl sticky top-0 z-30 flex items-center justify-center"
            >
              {col.label}
            </div>
          ))}

          {/* Break Columns (Spanning all rows) */}
          <div 
            style={{ gridColumn: 5, gridRow: `2 / ${DAYS.length + 2}` }}
            className="flex items-center justify-center border-r border-white/5 bg-primary/[0.03] group/lunch"
          >
             <span className="text-[12px] font-black tracking-[0.4em] uppercase text-primary/30 group-hover/lunch:text-primary/50 [writing-mode:vertical-lr] rotate-180 transform scale-110 transition-colors">
               L U N C H
             </span>
          </div>

          {/* Data Rows */}
          {DAYS.map((day, dayIdx) => {
            const rowIndex = dayIdx + 2;

            const cells = [];
            
            // 1. Day Label
            cells.push(
              <div 
                key={`day-${day}`} 
                style={{ gridColumn: 1, gridRow: rowIndex }}
                className="p-4 text-[10px] font-black tracking-[0.2em] uppercase text-center border-r border-b border-white/5 bg-white/[0.03] flex items-center justify-center text-white/40 sticky left-0 z-20 backdrop-blur-3xl group transition-all duration-500 hover:text-primary"
              >
                <span className="[writing-mode:vertical-lr] rotate-180 transform opacity-30 group-hover:opacity-100 transition-opacity">{day}</span>
              </div>
            );

            // Morning Logic
            const morningLab = getEntry(day, '09:00')?.labId ? getEntry(day, '09:00') : null;
            if (morningLab) {
              cells.push(
                <CellBlock 
                  key="m-lab" 
                  entry={morningLab} 
                  gridColumn="2 / span 3" 
                  gridRow={rowIndex} 
                  isLab 
                  showFaculty={showFaculty}
                />
              );
            } else {
              ['09:00', '10:00', '11:00'].forEach((time, idx) => {
                 const col = idx + 2;
                 const entry = getEntry(day, time);
                 cells.push(
                   <CellBlock 
                     key={time} 
                     entry={entry} 
                     gridColumn={`${col} / span 1`} 
                     gridRow={rowIndex} 
                     showFaculty={showFaculty}
                   />
                 );
              });
            }

            // Afternoon Logic
            const afternoonLab = getEntry(day, '13:00')?.labId ? getEntry(day, '13:00') : null;
            if (afternoonLab) {
              cells.push(
                <CellBlock 
                  key="a-lab" 
                  entry={afternoonLab} 
                  gridColumn="6 / span 3" 
                  gridRow={rowIndex} 
                  isLab 
                  showFaculty={showFaculty}
                />
              );
            } else {
              ['13:00', '14:00', '15:00'].forEach((time, idx) => {
                 const col = idx + 6;
                 const entry = getEntry(day, time);
                 cells.push(
                   <CellBlock 
                     key={time} 
                     entry={entry} 
                     gridColumn={`${col} / span 1`} 
                     gridRow={rowIndex} 
                     showFaculty={showFaculty}
                   />
                 );
              });
            }

            return cells;
          })}
        </div>
      </div>
    </div>
  );
};

// Sub-component for individual cell
const CellBlock = ({ entry, gridColumn, gridRow, isLab, showFaculty }) => {
  return (
    <div 
      style={{ gridColumn, gridRow }}
      className={`p-2 border-r border-b border-white/5 last:border-r-0 relative flex flex-col justify-center items-center min-h-[140px] transition-all duration-500 group/cell hover:bg-white/[0.02]`}
    >
      {entry ? (
        <motion.div 
          initial={{ scale: 0.98, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          whileHover={{ scale: 1.02, y: -2 }}
          className={`h-full w-full rounded-[1.5rem] p-3 flex flex-col justify-center items-center text-center transition-all shadow-xl relative overflow-hidden group/entry ${
            isLab 
            ? 'bg-primary/[0.08] border border-primary/20 shadow-primary/[0.05] ring-1 ring-primary/5' 
            : 'bg-white/[0.04] border border-white/10 hover:border-primary/30 hover:bg-white/[0.07]'
          }`}
        >
          <div className="space-y-1 w-full max-w-full">
            {isLab && (
              <span className="text-[8px] font-black tracking-[0.2em] text-primary/90 uppercase bg-primary/20 px-3 py-1 rounded-full block mx-auto w-fit mb-2 border border-primary/20">
                Lab Immersive
              </span>
            )}
            <h3 className={`font-black tracking-tight leading-[1.2] text-white transition-colors duration-500 line-clamp-2 break-words mx-auto ${isLab ? 'text-xl lg:text-2xl group-hover/entry:text-primary max-w-[90%]' : 'text-xs lg:text-sm group-hover/entry:text-primary'}`}>
                {entry.subjectId?.name || entry.labId?.name || 'Academic Block'}
            </h3>
            
            <div className="flex flex-wrap items-center justify-center gap-1.5 mt-2">
               <span className="text-[9px] font-black text-white/30 bg-white/5 rounded-lg px-2 py-1 uppercase tracking-wider border border-white/10">
                 {entry.classroomId?.name || 'Room'}
               </span>
               {isLab && (
                 <span className="text-[9px] font-black text-primary bg-primary/10 rounded-lg px-2 py-1 uppercase border border-primary/30">
                   {entry.labId?.duration || 3}HR
                 </span>
               )}
            </div>

            {showFaculty && (
              <div className="flex items-center justify-center gap-2 opacity-40 mt-2 border-t border-white/5 pt-2 group-hover/entry:opacity-100 transition-opacity">
                <span className="text-[10px] font-black text-white/30 tracking-tight uppercase line-clamp-1">
                  {entry.facultyId?.name || 'Lead'}
                </span>
              </div>
            )}
          </div>
        </motion.div>
      ) : (
        <div className="h-full w-full flex items-center justify-center opacity-30 group-hover/cell:opacity-60 transition-opacity text-white/40">
          <span className="text-xs font-black uppercase tracking-widest">Free</span>
        </div>
      )}
    </div>
  );
};
