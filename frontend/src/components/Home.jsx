import "./Home.css";

function Home() {
  return (
    <div className="home">
      <section id="home" className="hero">
        <h1>AIHT</h1>
        <p>AIHT – Excellence in Education.</p>
        <a href="#courses" className="hero-btn">Explore Courses</a>
      </section>

      <section id="courses" className="section">
        <h2>🎓 Courses Offered</h2>
        <div className="card-grid">
          <div className="card">B.Tech - Computer Science</div>
          <div className="card">B.Tech - AI & Data Science</div>
          <div className="card">B.Tech - Electrical Engineering</div>
          <div className="card">M.Tech & PhD Programs</div>
        </div>
      </section>
    </div>
  );
}

export default Home;
