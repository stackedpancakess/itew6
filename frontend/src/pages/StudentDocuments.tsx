import React, { useEffect, useState } from 'react';
import { studentDocumentService, studentService } from '../services/api';
import { useToast } from '../components/ToastProvider';

interface Student {
  id: number;
  student_id: string;
  first_name: string;
  last_name: string;
  full_name: string;
  email: string;
  phone: string;
  year_level: number;
  program: string;
  status: 'active' | 'inactive' | 'graduated';
  date_enrolled: string;
  created_at: string;
  updated_at: string;
}

interface StudentDocument {
  id: number;
  student_id: number;
  student?: {
    id: number;
    full_name: string;
  };
  document_type: string;
  document_name: string;
  file_url: string;
  original_file_name: string;
  mime_type: string;
  created_at: string;
  updated_at: string;
}

const documentOptions = [
  { value: 'resume', label: 'Resume' },
  { value: 'certificate', label: 'Certificate' },
  { value: 'webinar', label: 'Webinar / Seminar' },
  { value: 'other', label: 'Other Document' },
];

const StudentDocuments: React.FC = () => {
  const [students, setStudents] = useState<Student[]>([]);
  const [documents, setDocuments] = useState<StudentDocument[]>([]);
  const [selectedStudentId, setSelectedStudentId] = useState<number | undefined>(undefined);
  const [documentType, setDocumentType] = useState('resume');
  const [documentName, setDocumentName] = useState('');
  const [attachment, setAttachment] = useState<File | null>(null);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [filterStudentId, setFilterStudentId] = useState<number | undefined>(undefined);
  const toast = useToast();

  useEffect(() => {
    loadPageData();
  }, []);

  const loadPageData = async () => {
    try {
      setLoading(true);
      const [studentData, documentData] = await Promise.all([
        studentService.getAll(),
        studentDocumentService.getAll(),
      ]);

      setStudents(studentData);
      setDocuments(documentData || []);
      if (!selectedStudentId && studentData.length > 0) {
        setSelectedStudentId(studentData[0].id);
      }
    } catch (error) {
      console.error('Failed to load document hub data', error);
    } finally {
      setLoading(false);
    }
  };

  const refreshDocuments = async () => {
    try {
      setLoading(true);
      const response = await studentDocumentService.getAll(filterStudentId);
      setDocuments(response || []);
    } catch (error) {
      console.error('Failed to refresh documents', error);
    } finally {
      setLoading(false);
    }
  };

  const handleUpload = async (event: React.FormEvent) => {
    event.preventDefault();

    if (!selectedStudentId) {
      toast.error('Please select a student to attach the document to.');
      return;
    }

    if (!documentName.trim()) {
      toast.error('Please provide a name for the document.');
      return;
    }

    if (!attachment) {
      toast.error('Please choose a file to upload.');
      return;
    }

    try {
      setUploading(true);
      const formData = new FormData();
      formData.append('student_id', String(selectedStudentId));
      formData.append('document_type', documentType);
      formData.append('document_name', documentName.trim());
      formData.append('attachment', attachment);

      await studentDocumentService.create(formData);
      toast.success('Document uploaded successfully.');
      setDocumentName('');
      setAttachment(null);
      await refreshDocuments();
    } catch (error: any) {
      console.error('Upload failed', error);
      toast.error(error?.response?.data?.message || 'Unable to upload document.');
    } finally {
      setUploading(false);
    }
  };

  const handleDelete = async (id: number) => {
    if (!window.confirm('Delete this document?')) {
      return;
    }

    try {
      await studentDocumentService.delete(id);
      toast.success('Document removed successfully.');
      await refreshDocuments();
    } catch (error) {
      console.error('Delete failed', error);
      toast.error('Unable to remove document.');
    }
  };

  const studentLabel = (student: Student | undefined) => {
    if (!student) return 'Unknown student';
    return `${student.full_name} (${student.student_id})`;
  };

  const filteredDocuments = filterStudentId
    ? documents.filter(doc => doc.student_id === filterStudentId)
    : documents;

  if (loading) {
    return (
      <div style={{ padding: '28px', minHeight: '100vh', background: '#f1f5f9', fontFamily: 'Segoe UI, sans-serif' }}>
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '60vh' }}>
          <div style={{ width: 48, height: 48, border: '4px solid #ff6b35', borderTop: '4px solid transparent', borderRadius: '50%', animation: 'spin 1s linear infinite' }} />
        </div>
        <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
      </div>
    );
  }

  return (
    <div style={{ padding: '28px', minHeight: '100vh', background: '#f1f5f9', fontFamily: 'Segoe UI, sans-serif' }}>
      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>

      <div style={{ background: 'linear-gradient(135deg,#111827 0%,#1f2937 100%)', borderRadius: '16px', padding: '24px 28px', marginBottom: '24px', color: '#f8fafc' }}>
        <h1 style={{ fontSize: '28px', margin: 0, fontWeight: 700 }}>Student Document Hub</h1>
        <p style={{ marginTop: '10px', color: '#cbd5e1', maxWidth: '720px', lineHeight: 1.7 }}>
          Upload and manage resumes, certificates, webinars, and other student documents from one place.
          Documents are stored securely and can be downloaded by staff.
        </p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 380px', gap: '24px', marginBottom: '24px' }}>
        <section style={{ background: '#fff', borderRadius: '18px', padding: '24px', boxShadow: '0 18px 40px rgba(15,23,42,0.06)' }}>
          <h2 style={{ fontSize: '20px', fontWeight: 700, marginBottom: '18px' }}>Upload a New Student Document</h2>
          <form onSubmit={handleUpload}>
            <div style={{ display: 'grid', gap: '18px' }}>
              <div>
                <label style={{ display: 'block', marginBottom: '8px', fontWeight: 600, color: '#334155' }}>Student</label>
                <select
                  value={selectedStudentId ?? ''}
                  onChange={(e) => setSelectedStudentId(Number(e.target.value))}
                  style={{ width: '100%', minHeight: '46px', padding: '0 14px', borderRadius: '12px', border: '1px solid #cbd5e1', fontSize: '14px', color: '#0f172a' }}
                >
                  <option value="">Select a student</option>
                  {students.map((student) => (
                    <option key={student.id} value={student.id}>{studentLabel(student)}</option>
                  ))}
                </select>
              </div>

              <div>
                <label style={{ display: 'block', marginBottom: '8px', fontWeight: 600, color: '#334155' }}>Document Type</label>
                <select
                  value={documentType}
                  onChange={(e) => setDocumentType(e.target.value)}
                  style={{ width: '100%', minHeight: '46px', padding: '0 14px', borderRadius: '12px', border: '1px solid #cbd5e1', fontSize: '14px', color: '#0f172a' }}
                >
                  {documentOptions.map((option) => (
                    <option key={option.value} value={option.value}>{option.label}</option>
                  ))}
                </select>
              </div>

              <div>
                <label style={{ display: 'block', marginBottom: '8px', fontWeight: 600, color: '#334155' }}>Document Name</label>
                <input
                  type="text"
                  value={documentName}
                  onChange={(e) => setDocumentName(e.target.value)}
                  placeholder="Example: Resume 2026 / Certificate of Training"
                  style={{ width: '100%', minHeight: '46px', padding: '0 14px', borderRadius: '12px', border: '1px solid #cbd5e1', fontSize: '14px', color: '#0f172a' }}
                />
              </div>

              <div>
                <label style={{ display: 'block', marginBottom: '8px', fontWeight: 600, color: '#334155' }}>Upload File</label>
                <input
                  type="file"
                  accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
                  onChange={(e) => setAttachment(e.target.files?.[0] ?? null)}
                  style={{ width: '100%', fontSize: '14px', color: '#0f172a' }}
                />
                <p style={{ marginTop: '8px', fontSize: '12px', color: '#64748b' }}>Accepted formats: PDF, DOC, DOCX, JPG, PNG.</p>
              </div>

              <button
                type="submit"
                disabled={uploading}
                style={{ width: '100%', marginTop: '8px', minHeight: '46px', borderRadius: '12px', background: 'linear-gradient(135deg,#ff6b35 0%,#f97316 100%)', border: 'none', color: '#fff', fontWeight: 700, fontSize: '14px', cursor: 'pointer', opacity: uploading ? 0.75 : 1 }}
              >
                {uploading ? 'Uploading...' : 'Upload Document'}
              </button>
            </div>
          </form>
        </section>

        <aside style={{ background: '#fff', borderRadius: '18px', padding: '24px', boxShadow: '0 18px 40px rgba(15,23,42,0.06)' }}>
          <h2 style={{ fontSize: '20px', fontWeight: 700, marginBottom: '16px' }}>Quick Guide</h2>
          <ul style={{ listStyle: 'none', padding: 0, margin: 0, color: '#475569', lineHeight: 1.9 }}>
            <li>• Upload resumes, certificates or seminar attendance proofs.</li>
            <li>• Use the student selector to associate the document.</li>
            <li>• Files are stored under the student document hub for later review.</li>
            <li>• Download or delete entries from the table below.</li>
          </ul>
        </aside>
      </div>

      <section style={{ background: '#fff', borderRadius: '18px', padding: '24px', boxShadow: '0 18px 40px rgba(15,23,42,0.06)' }}>
        <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between', gap: '16px', marginBottom: '20px' }}>
          <div>
            <h2 style={{ fontSize: '20px', fontWeight: 700, margin: 0 }}>Uploaded Documents</h2>
            <p style={{ margin: '8px 0 0', color: '#64748b' }}>Manage student files, filter records, and open downloads directly.</p>
          </div>
          <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap', alignItems: 'center' }}>
            <label style={{ fontWeight: 600, color: '#334155' }}>Filter by Student</label>
            <select
              value={filterStudentId ?? ''}
              onChange={(e) => setFilterStudentId(e.target.value ? Number(e.target.value) : undefined)}
              style={{ minWidth: '220px', minHeight: '46px', padding: '0 14px', borderRadius: '12px', border: '1px solid #cbd5e1', fontSize: '14px', color: '#0f172a' }}
            >
              <option value="">All students</option>
              {students.map((student) => (
                <option key={student.id} value={student.id}>{studentLabel(student)}</option>
              ))}
            </select>
            <button
              onClick={() => { setFilterStudentId(undefined); }}
              style={{ minHeight: '46px', padding: '0 16px', borderRadius: '12px', border: '1px solid #cbd5e1', background: '#fff', color: '#0f172a', cursor: 'pointer' }}
            >Clear</button>
          </div>
        </div>

        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', minWidth: '760px' }}>
            <thead>
              <tr style={{ textAlign: 'left', borderBottom: '1px solid #e2e8f0', color: '#334155' }}>
                <th style={{ padding: '16px 12px' }}>Student</th>
                <th style={{ padding: '16px 12px' }}>Document</th>
                <th style={{ padding: '16px 12px' }}>Type</th>
                <th style={{ padding: '16px 12px' }}>Uploaded</th>
                <th style={{ padding: '16px 12px' }}></th>
              </tr>
            </thead>
            <tbody>
              {filteredDocuments.length === 0 ? (
                <tr>
                  <td colSpan={5} style={{ padding: '24px 12px', textAlign: 'center', color: '#64748b' }}>
                    No documents found. Upload the first student document to get started.
                  </td>
                </tr>
              ) : filteredDocuments.map((document) => (
                <tr key={document.id} style={{ borderBottom: '1px solid #e2e8f0' }}>
                  <td style={{ padding: '16px 12px', verticalAlign: 'middle' }}>{document.student?.full_name || 'Unknown student'}</td>
                  <td style={{ padding: '16px 12px', verticalAlign: 'middle' }}>
                    <a href={document.file_url} target="_blank" rel="noreferrer" style={{ color: '#1d4ed8', textDecoration: 'none', fontWeight: 600 }}>{document.document_name}</a>
                    <div style={{ color: '#64748b', fontSize: '13px', marginTop: '4px' }}>{document.original_file_name}</div>
                  </td>
                  <td style={{ padding: '16px 12px', verticalAlign: 'middle', textTransform: 'capitalize' }}>{document.document_type}</td>
                  <td style={{ padding: '16px 12px', verticalAlign: 'middle' }}>{new Date(document.created_at).toLocaleDateString()}</td>
                  <td style={{ padding: '16px 12px', verticalAlign: 'middle' }}>
                    <button
                      onClick={() => handleDelete(document.id)}
                      style={{ border: '1px solid #f97316', background: '#fff', color: '#f97316', borderRadius: '10px', padding: '10px 14px', cursor: 'pointer' }}
                    >Delete</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
};

export default StudentDocuments;
