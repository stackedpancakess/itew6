import React, { useState, useEffect } from 'react';
import { studentService, employeeService, deploymentService, subjectService } from '../services/api';

interface Student {
  id: number;
  student_id: string;
  first_name: string;
  last_name: string;
  full_name: string;
  email: string;
  phone: string;
  year_level: number;
  section?: string;
  program: string;
  status: 'active' | 'inactive' | 'graduated';
  date_enrolled: string;
  created_at: string;
  updated_at: string;
}

interface Employee {
  id: number;
  first_name: string;
  last_name: string;
  full_name: string;
  email: string;
  phone: string;
  position: string;
  status: 'active' | 'inactive' | 'terminated';
  created_at: string;
  updated_at: string;
}

interface Subject {
  id: number;
  code: string;
  name: string;
}

interface Deployment {
  id: number;
  student: Student;
  professor: Employee;
  subject: Subject;
  semester: string;
  academic_year: string;
  status: 'active' | 'completed';
  created_at: string;
  updated_at: string;
}

const Deployments: React.FC = () => {
  const [students, setStudents] = useState<Student[]>([]);
  const [professors, setProfessors] = useState<Employee[]>([]);
  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [deployments, setDeployments] = useState<Deployment[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const currentYear = new Date().getFullYear();
  const defaultAcademicYear = `${currentYear}-${currentYear + 1}`;

  const [formData, setFormData] = useState({
    student_id: '',
    professor_id: '',
    subject: '',
    semester: '',
    academic_year: defaultAcademicYear,
    status: 'active' as 'active' | 'completed',
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [studentsData, employeesData, subjectsData, deploymentsData] = await Promise.all([
        studentService.getAll(),
        employeeService.getAll(),
        subjectService.getAll(),
        deploymentService.getAll(),
      ]);

      const professorsData = employeesData.filter(emp => 
        emp.position.includes('Professor') || emp.position.includes('Dean') || emp.position.includes('Chair')
      );

      setStudents(Array.isArray(studentsData) ? studentsData : []);
      setProfessors(professorsData);
      setSubjects(Array.isArray(subjectsData) ? subjectsData : []);
      setDeployments(Array.isArray(deploymentsData) ? deploymentsData : []);
    } catch (error) {
      console.error('Error fetching data:', error);
      setStudents([]);
      setProfessors([]);
      setSubjects([]);
      setDeployments([]);
    } finally {
      setLoading(false);
    }
  };

  const sortedDeployments = React.useMemo(() => {
    return [...deployments].sort((a, b) => {
      const aYear = a.student?.year_level ?? 0;
      const bYear = b.student?.year_level ?? 0;
      if (aYear !== bYear) return aYear - bYear;

      const aSection = (a.student?.section ?? '').toString().toLowerCase();
      const bSection = (b.student?.section ?? '').toString().toLowerCase();
      const sectionCompare = aSection.localeCompare(bSection);
      if (sectionCompare !== 0) return sectionCompare;

      const aLastName = (a.student?.last_name ?? '').toString().toLowerCase();
      const bLastName = (b.student?.last_name ?? '').toString().toLowerCase();
      const nameCompare = aLastName.localeCompare(bLastName);
      if (nameCompare !== 0) return nameCompare;

      return (a.student?.first_name ?? '').toString().toLowerCase().localeCompare((b.student?.first_name ?? '').toString().toLowerCase());
    });
  }, [deployments]);

  const totalPages = Math.max(1, Math.ceil(sortedDeployments.length / rowsPerPage));

  React.useEffect(() => {
    if (currentPage > totalPages) {
      setCurrentPage(totalPages);
    }
  }, [currentPage, totalPages]);

  React.useEffect(() => {
    setCurrentPage(1);
  }, [rowsPerPage, sortedDeployments.length]);

  const paginatedDeployments = React.useMemo(() => {
    const start = (currentPage - 1) * rowsPerPage;
    return sortedDeployments.slice(start, start + rowsPerPage);
  }, [sortedDeployments, currentPage, rowsPerPage]);

  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    
    if (!formData.student_id) newErrors.student_id = 'Student is required';
    if (!formData.professor_id) newErrors.professor_id = 'Professor is required';
    if (!formData.subject.trim()) newErrors.subject = 'Subject is required';
    if (!formData.semester.trim()) newErrors.semester = 'Semester is required';
    if (!formData.academic_year.trim()) newErrors.academic_year = 'Academic year is required';
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;

    try {
      // TODO: Save deployment data
      console.log('Deployment data:', formData);
      
      setShowModal(false);
      resetForm();
      setErrors({});
    } catch (error: any) {
      console.error('Error saving deployment:', error);
    }
  };

  const resetForm = () => {
    const currentYear = new Date().getFullYear();
    const defaultAcademicYear = `${currentYear}-${currentYear + 1}`;
    
    setFormData({
      student_id: '',
      professor_id: '',
      subject: '',
      semester: '',
      academic_year: defaultAcademicYear,
      status: 'active' as 'active' | 'completed',
    });
  };

  if (loading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '256px' }}>
        <div style={{ 
          border: '4px solid #3b82f6',
          borderTop: '4px solid transparent',
          borderRadius: '50%',
          width: '48px',
          height: '48px',
          animation: 'spin 1s linear infinite'
        }}></div>
      </div>
    );
  }

  return (
    <div>
      <div style={{ marginBottom: '32px' }}>
        <h1 style={{ fontSize: '30px', fontWeight: 'bold', color: '#111827', margin: 0 }}>
          Student Deployments
        </h1>
        <p style={{ color: '#6b7280', marginTop: '8px' }}>
          Assign students to professors for specific subjects
        </p>
      </div>

      <div style={{ marginBottom: '24px' }}>
        <button
          onClick={() => {
            resetForm();
            setShowModal(true);
          }}
          style={{
            padding: '12px 20px',
            backgroundColor: '#3b82f6',
            color: 'white',
            border: 'none',
            borderRadius: '8px',
            fontSize: '14px',
            fontWeight: '500',
            cursor: 'pointer'
          }}
        >
          New Deployment
        </button>
      </div>

      <div style={{ 
        backgroundColor: 'white', 
        borderRadius: '8px', 
        boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
        overflow: 'hidden'
      }}>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead style={{ backgroundColor: '#f9fafb', borderBottom: '1px solid #e5e7eb' }}>
            <tr>
              <th style={{ padding: '12px 16px', textAlign: 'left', fontSize: '12px', fontWeight: '500', color: '#6b7280', textTransform: 'uppercase' }}>
                Student
              </th>
              <th style={{ padding: '12px 16px', textAlign: 'left', fontSize: '12px', fontWeight: '500', color: '#6b7280', textTransform: 'uppercase' }}>
                Year
              </th>
              <th style={{ padding: '12px 16px', textAlign: 'left', fontSize: '12px', fontWeight: '500', color: '#6b7280', textTransform: 'uppercase' }}>
                Section
              </th>
              <th style={{ padding: '12px 16px', textAlign: 'left', fontSize: '12px', fontWeight: '500', color: '#6b7280', textTransform: 'uppercase' }}>
                Professor
              </th>
              <th style={{ padding: '12px 16px', textAlign: 'left', fontSize: '12px', fontWeight: '500', color: '#6b7280', textTransform: 'uppercase' }}>
                Subject
              </th>
              <th style={{ padding: '12px 16px', textAlign: 'left', fontSize: '12px', fontWeight: '500', color: '#6b7280', textTransform: 'uppercase' }}>
                Semester
              </th>
              <th style={{ padding: '12px 16px', textAlign: 'left', fontSize: '12px', fontWeight: '500', color: '#6b7280', textTransform: 'uppercase' }}>
                Academic Year
              </th>
              <th style={{ padding: '12px 16px', textAlign: 'left', fontSize: '12px', fontWeight: '500', color: '#6b7280', textTransform: 'uppercase' }}>
                Status
              </th>
            </tr>
          </thead>
          <tbody style={{ backgroundColor: 'white' }}>
            {sortedDeployments.length === 0 ? (
              <tr>
                <td colSpan={8} style={{ padding: '48px', textAlign: 'center', color: '#6b7280' }}>
                  No deployments found. Click "New Deployment" to assign students to professors.
                </td>
              </tr>
            ) : (
              paginatedDeployments.map((deployment) => (
                <tr key={deployment.id} style={{ borderBottom: '1px solid #f3f4f6' }}>
                  <td style={{ padding: '16px' }}>
                    <div style={{ fontSize: '14px', fontWeight: '500', color: '#111827' }}>
                      {deployment.student?.full_name ?? 'Unknown Student'}
                    </div>
                    <div style={{ fontSize: '12px', color: '#6b7280' }}>{deployment.student?.student_id}</div>
                  </td>
                  <td style={{ padding: '16px' }}>
                    <div style={{ fontSize: '14px', color: '#111827' }}>{deployment.student?.year_level ?? '—'}</div>
                  </td>
                  <td style={{ padding: '16px' }}>
                    <div style={{ fontSize: '14px', color: '#111827' }}>{deployment.student?.section ?? '—'}</div>
                  </td>
                  <td style={{ padding: '16px' }}>
                    <div style={{ fontSize: '14px', color: '#111827' }}>
                      {deployment.professor?.full_name ?? 'Unknown Professor'}
                    </div>
                    <div style={{ fontSize: '12px', color: '#6b7280' }}>{deployment.professor?.position}</div>
                  </td>
                  <td style={{ padding: '16px' }}>
                    <div style={{ fontSize: '14px', color: '#111827' }}>{deployment.subject?.name ?? 'Unknown Subject'}</div>
                    <div style={{ fontSize: '12px', color: '#6b7280' }}>{deployment.subject?.code}</div>
                  </td>
                  <td style={{ padding: '16px' }}>
                    <div style={{ fontSize: '14px', color: '#111827' }}>{deployment.semester}</div>
                  </td>
                  <td style={{ padding: '16px' }}>
                    <div style={{ fontSize: '14px', color: '#111827' }}>{deployment.academic_year}</div>
                  </td>
                  <td style={{ padding: '16px' }}>
                    <span style={{
                      padding: '4px 8px',
                      fontSize: '12px',
                      fontWeight: '500',
                      borderRadius: '9999px',
                      backgroundColor: deployment.status === 'active' ? '#dcfce7' : '#f3f4f6',
                      color: deployment.status === 'active' ? '#166534' : '#6b7280',
                    }}>
                      {deployment.status}
                    </span>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '12px', marginTop: '16px' }}>
        <div style={{ color: '#6b7280', fontSize: '14px' }}>
          Showing {(sortedDeployments.length === 0 ? 0 : (currentPage - 1) * rowsPerPage + 1)}–{Math.min(sortedDeployments.length, currentPage * rowsPerPage)} of {sortedDeployments.length} deployments
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', flexWrap: 'wrap' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span style={{ color: '#374151', fontSize: '14px' }}>Rows per page:</span>
            <select
              value={rowsPerPage}
              onChange={(e) => setRowsPerPage(Number(e.target.value))}
              style={{
                padding: '8px 10px',
                border: '1px solid #d1d5db',
                borderRadius: '6px',
                backgroundColor: 'white',
                color: '#111827',
                fontSize: '14px'
              }}
            >
              <option value={10}>10</option>
              <option value={20}>20</option>
              <option value={50}>50</option>
            </select>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <button
              type="button"
              onClick={() => setCurrentPage((prev) => Math.max(1, prev - 1))}
              disabled={currentPage === 1}
              style={{
                padding: '8px 12px',
                backgroundColor: currentPage === 1 ? '#e5e7eb' : '#fff',
                color: currentPage === 1 ? '#9ca3af' : '#111827',
                border: '1px solid #d1d5db',
                borderRadius: '6px',
                cursor: currentPage === 1 ? 'not-allowed' : 'pointer'
              }}
            >
              Previous
            </button>
            <span style={{ color: '#374151', fontSize: '14px' }}>
              Page {currentPage} of {Math.max(1, Math.ceil(sortedDeployments.length / rowsPerPage))}
            </span>
            <button
              type="button"
              onClick={() => setCurrentPage((prev) => Math.min(totalPages, prev + 1))}
              disabled={currentPage === totalPages}
              style={{
                padding: '8px 12px',
                backgroundColor: currentPage === totalPages ? '#e5e7eb' : '#fff',
                color: currentPage === totalPages ? '#9ca3af' : '#111827',
                border: '1px solid #d1d5db',
                borderRadius: '6px',
                cursor: currentPage === totalPages ? 'not-allowed' : 'pointer'
              }}
            >
              Next
            </button>
          </div>
        </div>
      </div>

      {showModal && (
        <div style={{
          position: 'fixed',
          inset: 0,
          backgroundColor: 'rgba(0, 0, 0, 0.5)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 50
        }}>
          <div style={{
            backgroundColor: 'white',
            borderRadius: '8px',
            width: '90%',
            maxWidth: '500px',
            maxHeight: '90vh',
            overflowY: 'auto'
          }}>
            <div style={{ padding: '24px', borderBottom: '1px solid #e5e7eb' }}>
              <h2 style={{ fontSize: '20px', fontWeight: '600', color: '#111827', margin: 0 }}>
                New Student Deployment
              </h2>
            </div>
            
            <form onSubmit={handleSubmit} style={{ padding: '24px' }}>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '14px', fontWeight: '500', color: '#374151', marginBottom: '4px' }}>
                    Student
                  </label>
                  <select
                    required
                    value={formData.student_id}
                    onChange={(e) => setFormData({ ...formData, student_id: e.target.value })}
                    style={{
                      width: '100%',
                      padding: '8px 12px',
                      border: errors.student_id ? '1px solid #ef4444' : '1px solid #d1d5db',
                      borderRadius: '6px',
                      fontSize: '14px'
                    }}
                  >
                    <option value="">Select Student</option>
                    {students.map((student) => (
                      <option key={student.id} value={student.id}>
                        {student.student_id} - {student.first_name} {student.last_name}
                      </option>
                    ))}
                  </select>
                  {errors.student_id && (
                    <div style={{ color: '#ef4444', fontSize: '12px', marginTop: '4px' }}>
                      {errors.student_id}
                    </div>
                  )}
                </div>
                
                <div>
                  <label style={{ display: 'block', fontSize: '14px', fontWeight: '500', color: '#374151', marginBottom: '4px' }}>
                    Professor
                  </label>
                  <select
                    required
                    value={formData.professor_id}
                    onChange={(e) => setFormData({ ...formData, professor_id: e.target.value })}
                    style={{
                      width: '100%',
                      padding: '8px 12px',
                      border: errors.professor_id ? '1px solid #ef4444' : '1px solid #d1d5db',
                      borderRadius: '6px',
                      fontSize: '14px'
                    }}
                  >
                    <option value="">Select Professor</option>
                    {professors.map((professor) => (
                      <option key={professor.id} value={professor.id}>
                        {professor.first_name} {professor.last_name} ({professor.position})
                      </option>
                    ))}
                  </select>
                  {errors.professor_id && (
                    <div style={{ color: '#ef4444', fontSize: '12px', marginTop: '4px' }}>
                      {errors.professor_id}
                    </div>
                  )}
                </div>
                
                <div>
                  <label style={{ display: 'block', fontSize: '14px', fontWeight: '500', color: '#374151', marginBottom: '4px' }}>
                    Subject
                  </label>
                  <select
                    required
                    value={formData.subject}
                    onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                    style={{
                      width: '100%',
                      padding: '8px 12px',
                      border: errors.subject ? '1px solid #ef4444' : '1px solid #d1d5db',
                      borderRadius: '6px',
                      fontSize: '14px'
                    }}
                  >
                    <option value="">Select Subject</option>
                    {subjects.map((subject) => (
                      <option key={subject.id} value={subject.id}>
                        {subject.code} - {subject.name}
                      </option>
                    ))}
                  </select>
                  {errors.subject && (
                    <div style={{ color: '#ef4444', fontSize: '12px', marginTop: '4px' }}>
                      {errors.subject}
                    </div>
                  )}
                </div>
                
                <div>
                  <label style={{ display: 'block', fontSize: '14px', fontWeight: '500', color: '#374151', marginBottom: '4px' }}>
                    Semester
                  </label>
                  <select
                    required
                    value={formData.semester}
                    onChange={(e) => setFormData({ ...formData, semester: e.target.value })}
                    style={{
                      width: '100%',
                      padding: '8px 12px',
                      border: errors.semester ? '1px solid #ef4444' : '1px solid #d1d5db',
                      borderRadius: '6px',
                      fontSize: '14px'
                    }}
                  >
                    <option value="">Select Semester</option>
                    <option value="1st Semester">1st Semester</option>
                    <option value="2nd Semester">2nd Semester</option>
                    <option value="Summer">Summer</option>
                  </select>
                  {errors.semester && (
                    <div style={{ color: '#ef4444', fontSize: '12px', marginTop: '4px' }}>
                      {errors.semester}
                    </div>
                  )}
                </div>
                
                <div>
                  <label style={{ display: 'block', fontSize: '14px', fontWeight: '500', color: '#374151', marginBottom: '4px' }}>
                    Academic Year
                  </label>
                  <select
                    required
                    value={formData.academic_year}
                    onChange={(e) => setFormData({ ...formData, academic_year: e.target.value })}
                    style={{
                      width: '100%',
                      padding: '8px 12px',
                      border: errors.academic_year ? '1px solid #ef4444' : '1px solid #d1d5db',
                      borderRadius: '6px',
                      fontSize: '14px'
                    }}
                  >
                    <option value="">Select Academic Year</option>
                    <option value="2024-2025">2024-2025</option>
                    <option value="2025-2026">2025-2026</option>
                    <option value="2026-2027">2026-2027</option>
                    <option value="2027-2028">2027-2028</option>
                    <option value="2028-2029">2028-2029</option>
                  </select>
                  {errors.academic_year && (
                    <div style={{ color: '#ef4444', fontSize: '12px', marginTop: '4px' }}>
                      {errors.academic_year}
                    </div>
                  )}
                </div>
              </div>
              
              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px', marginTop: '24px' }}>
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  style={{
                    padding: '8px 16px',
                    backgroundColor: '#f3f4f6',
                    color: '#374151',
                    border: 'none',
                    borderRadius: '6px',
                    fontSize: '14px',
                    fontWeight: '500',
                    cursor: 'pointer'
                  }}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  style={{
                    padding: '8px 16px',
                    backgroundColor: '#3b82f6',
                    color: 'white',
                    border: 'none',
                    borderRadius: '6px',
                    fontSize: '14px',
                    fontWeight: '500',
                    cursor: 'pointer'
                  }}
                >
                  Create Deployment
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Deployments;
