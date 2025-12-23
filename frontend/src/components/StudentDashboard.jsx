import { useEffect, useState } from "react";
import "./StudentDashboard.css";

function StudentDashboard({ user }) {
  const [completedCourses, setCompletedCourses] = useState([]);
  const [ongoingCourses, setOngoingCourses] = useState([]);

  useEffect(() => {
    if (!user?.id) return;

    fetch(
      `http://localhost:8080/api/student/completed-courses?student_id=${user.id}`
    )
      .then(res => res.json())
      .then(setCompletedCourses);

    fetch(
      `http://localhost:8080/api/student/ongoing-courses?student_id=${user.id}`
    )
      .then(res => res.json())
      .then(setOngoingCourses);
  }, [user]);

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

      {/* Ongoing Courses */}
      <section className="card-section slide-up delay-2">
        <h3>⏳ Ongoing Courses</h3>
        <ul className="ongoing-list">
          {ongoingCourses.map((c, i) => (
            <li key={i}>
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
