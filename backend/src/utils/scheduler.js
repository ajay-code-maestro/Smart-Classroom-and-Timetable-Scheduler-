// backend/src/utils/scheduler.js

/**
 * Deterministic Round-Robin Rule-Based Timetable Scheduling Algorithm
 * Sequentially forces subjects into a fixed 100% density timetable matrix 
 * adhering exactly to hour quotas and skipping pre-placed labs.
 */

const DAYS = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'];
const SLOTS = [
  '09:00-10:00',
  '10:00-11:00',
  '11:00-12:00',
  '13:00-14:00',
  '14:00-15:00',
  '15:00-16:00'
];

export const generateTimetable = (classrooms, subjects, labs = []) => {
  let assignedMatrix = [];

  // Default to a master classroom for the single linear batch sequence
  const mainClassroom = classrooms.length > 0 ? classrooms[0]._id.toString() : null;

  // ==========================================
  // 1. PRE-PLACE LAB SESSIONS
  // ==========================================
  // Labs take priority, occupy 3 contiguous slots, and remove availability for subjects.
  for (const lab of labs) {
    const startIdx = SLOTS.findIndex(s => s.startsWith(lab.startSlot));
    const assignedRoom = mainClassroom;

    if (startIdx !== -1) {
      for (let i = 0; i < lab.duration; i++) {
        if (startIdx + i < SLOTS.length) {
          const time = SLOTS[startIdx + i];
          assignedMatrix.push({
            day: lab.day,
            startTime: time.split('-')[0],
            endTime: time.split('-')[1],
            labId: lab._id.toString(),
            facultyId: (lab.facultyId?._id || lab.facultyId).toString(),
            classroomId: assignedRoom
          });
        }
      }
    }
  }

  // ==========================================
  // 2. CREATE A ROUND-ROBIN SUBJECT POOL
  // ==========================================
  // Sort subjects cleanly, then interleave them to create a round-robin cycle.
  // Example: [OS, DBMS, SE] based on hoursPerWeek becomes [OS, DBMS, SE, OS, DBMS, SE, ...]
  
  const sortedSubjects = [...subjects].sort((a, b) => b.hoursPerWeek - a.hoursPerWeek);
  const maxHours = Math.max(...sortedSubjects.map(s => s.hoursPerWeek), 0);
  
  const subjectPool = [];
  
  for (let hourIdx = 0; hourIdx < maxHours; hourIdx++) {
    for (const sub of sortedSubjects) {
      if (hourIdx < sub.hoursPerWeek) {
        subjectPool.push({
          _id: sub._id.toString(),
          name: sub.name,
          facultyId: (sub.facultyId?._id || sub.facultyId).toString()
        });
      }
    }
  }

  // ==========================================
  // 3. SEQUENTIALLY FILL EMPTY TIMETABLE SLOTS
  // ==========================================
  // Iterate strictly Day -> Slot to visually cascade across the grid continuously.
  
  for (let dayIdx = 0; dayIdx < DAYS.length; dayIdx++) {
    const day = DAYS[dayIdx];
    let prevSubjectId = null;

    for (let slotIdx = 0; slotIdx < SLOTS.length; slotIdx++) {
      const time = SLOTS[slotIdx];
      const startTime = time.split('-')[0];

      // Skip this physical cell if a Lab Session occupies it
      const isOccupied = assignedMatrix.some(a => a.day === day && a.startTime === startTime);
      if (isOccupied) {
        // A lab breaks the continuous 'previous slot' sequence constraints
        prevSubjectId = null; 
        continue;
      }

      // If we run out of subjects in the pool before the timeline finishes,
      // the slot remains perfectly unpopulated ("Free" naturally on the frontend UI)
      if (subjectPool.length === 0) {
        prevSubjectId = null;
        continue;
      }

      // Scan pool for the very first subject that avoids "consecutive in same day" conflict
      let selectedPoolIdx = -1;
      for (let i = 0; i < subjectPool.length; i++) {
        if (subjectPool[i]._id !== prevSubjectId) {
          selectedPoolIdx = i;
          break;
        }
      }

      // Conflict Handling / Fallback: 
      // If the only subjects remaining are consecutive matches (which means the pool is nearly empty),
      // we are mathematically forced to use it to ensure all Subjects are strictly assigned.
      if (selectedPoolIdx === -1 && subjectPool.length > 0) {
        selectedPoolIdx = 0;
      }

      // Pop the validated subject out of the dynamic pool list
      const subToAssign = subjectPool.splice(selectedPoolIdx, 1)[0];

      // Lock it directly into the matrix
      assignedMatrix.push({
        day,
        startTime: time.split('-')[0],
        endTime: time.split('-')[1],
        subjectId: subToAssign._id,
        facultyId: subToAssign.facultyId,
        classroomId: mainClassroom
      });

      // Log it dynamically so the very next slot actively avoids creating a back-to-back sequence
      prevSubjectId = subToAssign._id;
    }
  }

  // ==========================================
  // 4. FINAL OUTPUT RETURN
  // ==========================================
  // Any element left inside subjectPool structurally failed to fit (e.g. required hours 
  // critically exceed visual slots available).
  
  return { 
    schedule: assignedMatrix, 
    unassigned: subjectPool 
  };
};
