import React from 'react';
import { Routes, Route } from 'react-router-dom';
import { Layout } from './components/layout/Layout';

import { Landing } from './pages/Landing';
import { Login } from './pages/Login';
import { Register } from './pages/Register';

import { AdminDashboard } from './pages/AdminDashboard';
import { SubjectManagement } from './pages/SubjectManagement';
import { ClassroomManagement } from './pages/ClassroomManagement';
import { FacultyDashboard } from './pages/FacultyDashboard';
import { StudentDashboard } from './pages/StudentDashboard';

const App = () => {
  return (
    <Layout>
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        
        <Route path="/admin" element={<AdminDashboard />} />
        <Route path="/admin/subjects" element={<SubjectManagement />} />
        <Route path="/admin/classrooms" element={<ClassroomManagement />} />
        <Route path="/faculty" element={<FacultyDashboard />} />
        <Route path="/student" element={<StudentDashboard />} />
      </Routes>
    </Layout>
  );
};

export default App;
