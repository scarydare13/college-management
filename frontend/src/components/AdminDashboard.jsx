import { useState, useEffect } from "react";
import "./AdminDashboard.css";

function AdminDashboard({ user }) {
  const [allCourses, setAllCourses] = useState([]);
  const [myCourses, setMyCourses] = useState([]);
  const [selectedCourse, setSelectedCourse] = useState(null);
  const [students, setStudents] = useState([]);
  const [grades, setGrades] = useState({});

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

  const handleGradeChange = (enrollmentId, value) => {
    setGrades(prev => ({
      ...prev,
      [enrollmentId]: value
    }));
  };

  const handleSave = () => {
    const payload = Object.entries(grades).map(
      ([enrollment_id, grade]) => ({
        enrollment_id: Number(enrollment_id),
        grade
      })
    );

    fetch("http://localhost:8080/api/admin/save-grades", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    })
      .then(res => res.json())
      .then(() => alert("Grades saved successfully"))
      .catch(console.error);
  };

  return (
    <div className="admin-page fade-in">
      <h2 className="title">👨‍💼 Admin Dashboard</h2>
      <p className="subtitle">Manage courses and assign grades</p>

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
              onClick={() => {
                setSelectedCourse(c.id);
                fetch(
                  `http://localhost:8080/api/admin/course-students?course_id=${c.id}`
                )
                  .then(res => res.json())
                  .then(setStudents);
              }}
            >
              {c.name}
            </button>
          ))}
        </div>
      </section>

      {/* Students */}
      {selectedCourse && (
        <section className="card-section">
          <h3>🎓 Students - Assign Grades</h3>
          <table>
            <tbody>
              {students.map(s => (
                <tr key={s.enrollment_id}>
                  <td>{s.name}</td>
                  <td>
                    <input
                      className="grade-input"
                      defaultValue={s.grade}
                      onChange={(e) =>
                        handleGradeChange(
                          s.enrollment_id,
                          e.target.value
                        )
                      }
                    />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          <button className="save-btn" onClick={handleSave}>
            💾 Save Grades
          </button>
        </section>
      )}
    </div>
  );
}

export default AdminDashboard;
