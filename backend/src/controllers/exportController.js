import PDFDocument from 'pdfkit';
import ExcelJS from 'exceljs';
import Timetable from '../models/Timetable.js';

const formatTime12h = (time) => {
  if (!time) return '';
  const [hours, minutes] = time.split(':');
  const h = parseInt(hours);
  const ampm = h >= 12 ? 'PM' : 'AM';
  const displayH = h % 12 || 12;
  return `${displayH}:${minutes} ${ampm}`;
};

export const exportPDF = async (req, res) => {
  try {
    const timetable = await Timetable.findById(req.params.id)
      .populate('schedule.subjectId')
      .populate('schedule.classroomId')
      .populate('schedule.facultyId');

    if (!timetable) return res.status(404).json({ message: 'Not found' });

    const doc = new PDFDocument({ margin: 30, size: 'A4' });
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', `attachment; filename=Timetable-${timetable.title}.pdf`);
    doc.pipe(res);

    doc.fontSize(20).text(timetable.title, { align: 'center' }).moveDown();
    
    // Group schedule by day
    const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'];
    days.forEach(day => {
      const dayEntries = timetable.schedule.filter(s => s.day === day);
      if (dayEntries.length > 0) {
        doc.fontSize(16).text(day, { underline: true }).moveDown(0.5);
        dayEntries.forEach(entry => {
          const timeRange = `${formatTime12h(entry.startTime)} - ${formatTime12h(entry.endTime)}`;
          doc.fontSize(12).text(`${timeRange} | ${entry.subjectId?.name || 'Unknown'} | Room: ${entry.classroomId?.name || 'Unknown'} | Faculty: ${entry.facultyId?.name || 'Unknown'}`);
        });
        doc.moveDown();
      }
    });

    doc.end();
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const exportExcel = async (req, res) => {
  try {
    const timetable = await Timetable.findById(req.params.id)
      .populate('schedule.subjectId')
      .populate('schedule.classroomId')
      .populate('schedule.facultyId');

    if (!timetable) return res.status(404).json({ message: 'Not found' });

    const workbook = new ExcelJS.Workbook();
    const sheet = workbook.addWorksheet('Timetable');

    sheet.columns = [
      { header: 'Day', key: 'day', width: 15 },
      { header: 'Time Slot', key: 'time', width: 25 },
      { header: 'Subject', key: 'subject', width: 25 },
      { header: 'Classroom', key: 'classroom', width: 20 },
      { header: 'Faculty', key: 'faculty', width: 25 }
    ];

    timetable.schedule.forEach(entry => {
      sheet.addRow({
        day: entry.day,
        time: `${formatTime12h(entry.startTime)} - ${formatTime12h(entry.endTime)}`,
        subject: entry.subjectId?.name || '',
        classroom: entry.classroomId?.name || '',
        faculty: entry.facultyId?.name || ''
      });
    });

    res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
    res.setHeader('Content-Disposition', `attachment; filename=Timetable-${timetable.title}.xlsx`);

    await workbook.xlsx.write(res);
    res.end();
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
