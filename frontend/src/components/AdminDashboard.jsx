import { useState } from "react";
import "./AdminDashboard.css";

function AdminDashboard() {
  // 🔹 Static data for now
  const allCourses = [
    { id: 1, name: "AI & Data Science", staff: "Dr. Suresh Kumar" },
    { id: 2, name: "Database Management Systems", staff: "Prof. Anitha Rao" },
    { id: 3, name: "Operating Systems", staff: "Dr. Meena Sharma" },
  ];

  const myCourses = [
    { id: 1, name: "AI & Data Science" },
    { id: 3, name: "Operating Systems" },
  ];

  const studentsByCourse = {
    1: [
      { id: 101, name: "Vetri Vel", grade: "A" },
      { id: 102, name: "Surendar", grade: "B+" },
    ],
    3: [
      { id: 103, name: "Saranya", grade: "A+" },
      { id: 104, name: "Bala", grade: "" },
    ],
  };

  const [selectedCourse, setSelectedCourse] = useState(null);
  const [grades, setGrades] = useState({});

  const handleGradeChange = (sid, value) => {
    setGrades({ ...grades, [sid]: value });
  };

  const handleSave = () => {
    alert("Grades saved (static for now)");
    console.log(grades);
  };

  return (
    <div className="admin-page fade-in">
      <h2 className="title">👨‍💼 Admin Dashboard</h2>
      <p className="subtitle">Manage courses and assign grades</p>

      {/* All Courses */}
      <section className="card-section slide-up delay-1">
        <h3>📚 All Courses</h3>
        <table>
          <thead>
            <tr>
              <th>Course</th>
              <th>Staff</th>
            </tr>
          </thead>
          <tbody>
            {allCourses.map((c) => (
              <tr key={c.id}>
                <td>{c.name}</td>
                <td>{c.staff}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>

      {/* My Courses */}
      <section className="card-section slide-up delay-2">
        <h3>🧑‍🏫 Courses Taken By Me</h3>
        <div className="my-courses">
          {myCourses.map((c) => (
            <button
              key={c.id}
              className={`course-btn ${
                selectedCourse === c.id ? "active" : ""
              }`}
              onClick={() => setSelectedCourse(c.id)}
            >
              {c.name}
            </button>
          ))}
        </div>
      </section>

      {/* Students for selected course */}
      {selectedCourse && (
        <section className="card-section slide-up delay-3">
          <h3>🎓 Students - Assign Grades</h3>
          <table>
            <thead>
              <tr>
                <th>Student</th>
                <th>Grade</th>
              </tr>
            </thead>
            <tbody>
              {studentsByCourse[selectedCourse].map((s) => (
                <tr key={s.id}>
                  <td>{s.name}</td>
                  <td>
                    <input
                      className="grade-input"
                      type="text"
                      defaultValue={s.grade}
                      placeholder="Enter grade"
                      onChange={(e) =>
                        handleGradeChange(s.id, e.target.value)
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
