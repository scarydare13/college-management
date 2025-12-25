import { useEffect, useState } from "react";
import "./StudentDashboard.css";

function StudentDashboard({ user }) {
  const [completedCourses, setCompletedCourses] = useState([]);
  const [ongoingCourses, setOngoingCourses] = useState([]);
  const [availableCourses, setAvailableCourses] = useState([]);
  const [selectedCourse, setSelectedCourse] = useState("");
  const [message, setMessage] = useState("");

  useEffect(() => {
    if (!user?.id) return;

    fetch(`http://localhost:8080/api/student/completed-courses?student_id=${user.id}`)
      .then(res => res.json())
      .then(setCompletedCourses);

    fetch(`http://localhost:8080/api/student/ongoing-courses?student_id=${user.id}`)
      .then(res => res.json())
      .then(setOngoingCourses);

    fetch(`http://localhost:8080/api/student/available-courses?student_id=${user.id}`)
      .then(res => res.json())
      .then(setAvailableCourses);
  }, [user]);

  const handleEnroll = async () => {
    if (!selectedCourse) {
      setMessage("Please select a course to enroll");
      return;
    }

    try {
      const res = await fetch(`http://localhost:8080/api/student/enroll`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          student_id: user.id,
          course_id: selectedCourse,
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Enroll failed");

      setMessage("✅ Enrolled successfully!");

      const enrolled = availableCourses.find(
        (c) => c.id === Number(selectedCourse)
      );

      setOngoingCourses((prev) => [...prev, enrolled]);
      setAvailableCourses((prev) =>
        prev.filter((c) => c.id !== Number(selectedCourse))
      );
      setSelectedCourse("");
    } catch (err) {
      setMessage(err.message);
    }
  };

  return (
    <div className="student-page fade-in">
      <h2 className="title">🎓 Student Dashboard</h2>
      <p className="subtitle">Track your courses and academic progress</p>

      {/* Summary */}
      <div className="summary-grid">
        <div className="summary-card">
          <h4>Ongoing</h4>
          <span>{ongoingCourses.length}</span>
        </div>
        <div className="summary-card">
          <h4>Completed</h4>
          <span>{completedCourses.length}</span>
        </div>
        <div className="summary-card">
          <h4>Available</h4>
          <span>{availableCourses.length}</span>
        </div>
      </div>

      {/* Enroll */}
      <section className="card-section slide-up delay-1">
        <div className="section-header">
          <h3>➕ Enroll New Course</h3>
          <span className="section-desc">Choose a course to add this semester</span>
        </div>

        <div className="enroll-box">
          <select
            value={selectedCourse}
            onChange={(e) => setSelectedCourse(e.target.value)}
          >
            <option value="">-- Select a course --</option>
            {availableCourses.map((c) => (
              <option key={c.id} value={c.id}>
                {c.course} — {c.staff}
              </option>
            ))}
          </select>

          <button className="enroll-btn" onClick={handleEnroll}>
            Enroll
          </button>
        </div>

        {message && <p className="enroll-msg">{message}</p>}
      </section>

      <div className="grid-2">
        {/* Ongoing */}
        <section className="card-section slide-up delay-2">
          <div className="section-header">
            <h3>⏳ Ongoing Courses</h3>
          </div>
          <ul className="ongoing-list">
            {ongoingCourses.length === 0 && <p className="empty">No ongoing courses</p>}
            {ongoingCourses.map((c, i) => (
              <li key={i}>
                <strong>{c.course}</strong>
                <span>{c.staff}</span>
              </li>
            ))}
          </ul>
        </section>

        {/* Completed */}
        <section className="card-section slide-up delay-3">
          <div className="section-header">
            <h3>✅ Completed Courses</h3>
          </div>
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
                {completedCourses.length === 0 && (
                  <tr>
                    <td colSpan="3" className="empty">No completed courses</td>
                  </tr>
                )}
                {completedCourses.map((c, i) => (
                  <tr key={i}>
                    <td>{c.course}</td>
                    <td>{c.staff}</td>
                    <td className="grade">{c.grade}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      </div>
    </div>
  );
}

export default StudentDashboard;
