import { useState, useEffect } from "react";
import "./AdminDashboard.css";

function AdminDashboard({ user }) {
  const [allCourses, setAllCourses] = useState([]);
  const [myCourses, setMyCourses] = useState([]);
  const [selectedCourse, setSelectedCourse] = useState(null);
  const [students, setStudents] = useState([]);
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetch("http://localhost:8080/api/admin/all-courses")
      .then(res => res.json())
      .then(setAllCourses);

    if (user?.id) {
      fetch(
        `http://localhost:8080/api/admin/my-courses?user_id=${user.id}`
      )
        .then(res => res.json())
        .then(setMyCourses);
    }
  }, [user]);

  const loadStudents = (courseId) => {
    setSelectedCourse(courseId);
    fetch(
      `http://localhost:8080/api/admin/course-students?course_id=${courseId}`
    )
      .then(res => res.json())
      .then(setStudents);
  };

  const handleUpload = async () => {
    if (!file || !selectedCourse) {
      alert("Select a course and Excel file first");
      return;
    }

    const formData = new FormData();
    formData.append("file", file);
    formData.append("course_id", selectedCourse);

    try {
      setLoading(true);
      const formData = new FormData();
      formData.append("file", file);
      formData.append("course_id", selectedCourse);

      const res = await fetch("http://localhost:8080/api/admin/upload-grades", {
        method: "POST",
        body: formData,
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Upload failed");

      alert("Grades updated successfully");
      loadStudents(selectedCourse); // 🔄 refresh
    } catch (err) {
      alert(err.message);
    } finally {
      setLoading(false);
    }
  };


  return (
    <div className="admin-page fade-in">
      <h2 className="title">👨‍💼 Admin Dashboard</h2>
      <p className="subtitle">Manage courses and update grades</p>

      {/* All Courses */}
      <section className="card-section">
        <h3>📚 All Courses</h3>
        <table>
          <tbody>
            {allCourses.map(c => (
              <tr key={c.id}>
                <td>{c.name}</td>
                <td>{c.staff}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>

      {/* My Courses */}
      <section className="card-section">
        <h3>🧑‍🏫 Courses Teach By Me</h3>
        <div className="my-courses">
          {myCourses.map(c => (
            <button
              key={c.id}
              className={`course-btn ${selectedCourse === c.id ? "active" : ""}`}
              onClick={() => loadStudents(c.id)}
            >
              {c.name}
            </button>
          ))}
        </div>
      </section>

      {/* Students & Upload */}
      {selectedCourse && (
        <section className="card-section">
          <h3>🎓 Students (View Grades)</h3>

          <table>
            <thead>
              <tr>
                <th>Name</th>
                <th>Grade</th>
              </tr>
            </thead>
            <tbody>
              {students.map(s => (
                <tr key={s.enrollment_id}>
                  <td>{s.name}</td>
                  <td>{s.grade || "-"}</td>
                </tr>
              ))}
            </tbody>
          </table>

          {/* Upload Excel */}
          <div className="upload-box">
<input
  type="file"
  accept=".xlsx,.xls"
  onChange={(e) => setFile(e.target.files[0])}
/>
<button
  className="save-btn"
  onClick={handleUpload}
  disabled={loading}
>
  {loading ? "Uploading..." : "📤 Upload Excel & Update DB"}
</button>
          </div>
        </section>
      )}
    </div>
  );
}

export default AdminDashboard;