import "./StudentDashboard.css";

function StudentDashboard() {
  // 🔹 Static data for now (replace with API later)
  const completedCourses = [
    {
      id: 1,
      course: "B.Tech - AI & Data Science",
      staff: "Dr. Suresh Kumar",
      grade: "A",
    },
    {
      id: 2,
      course: "Database Management Systems",
      staff: "Prof. Anitha Rao",
      grade: "A+",
    },
  ];

  const ongoingCourses = [
    {
      id: 3,
      course: "Computer Networks",
      staff: "Dr. Ramesh Iyer",
    },
    {
      id: 4,
      course: "Operating Systems",
      staff: "Prof. Meena Sharma",
    },
  ];

  return (
    <div className="student-page fade-in">
      <h2 className="title">🎓 Student Dashboard</h2>
      <p className="subtitle">Welcome! Here are your course details.</p>

      {/* Completed Courses */}
      <section className="card-section slide-up delay-1">
        <h3>✅ Completed Courses</h3>
        <div className="table-wrapper">
          <table>
            <thead>
              <tr>
                <th>Course</th>
                <th>Staff</th>
                <th>Grade</th>
              </tr>
            </thead>
            <tbody>
              {completedCourses.map((c) => (
                <tr key={c.id}>
                  <td>{c.course}</td>
                  <td>{c.staff}</td>
                  <td className="grade">{c.grade}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {/* Ongoing Courses */}
      <section className="card-section slide-up delay-2">
        <h3>⏳ Ongoing Courses</h3>
        <ul className="ongoing-list">
          {ongoingCourses.map((c) => (
            <li key={c.id}>
              <strong>{c.course}</strong>
              <span> — {c.staff}</span>
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
}

export default StudentDashboard;
