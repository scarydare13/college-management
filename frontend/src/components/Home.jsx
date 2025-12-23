import "./Home.css";

function Home() {
  return (
    <div className="home">
      <section id="home" className="hero">
        <h1>IIT Madras</h1>
        <p>Indian Institute of Technology Madras – Excellence in Education.</p>
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

      <section id="location" className="section light">
        <h2>🗺 Location</h2>
        <div className="map-container">
          <iframe
            title="IIT Madras"
            src="https://maps.google.com/maps?q=IIT%20Madras&t=&z=14&ie=UTF8&iwloc=&output=embed"
            loading="lazy"
          ></iframe>
        </div>
      </section>
    </div>
  );
}

export default Home;
