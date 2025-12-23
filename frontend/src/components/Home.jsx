function Home() {
  return (
    <div className="container">
      <h1>Welcome to ABC College of Engineering</h1>
      <p>
        ABC College is committed to excellence in education and research,
        offering industry-focused programs to shape future leaders.
      </p>

      <h2>🎓 Courses Offered</h2>
      <ul>
        <li>B.Tech - Computer Science</li>
        <li>B.Tech - AI & Data Science</li>
        <li>B.Tech - Electronics</li>
        <li>MBA</li>
      </ul>

      <h2>📍 Address</h2>
      <p>
        ABC College of Engineering,<br />
        OMR Road, Chennai, Tamil Nadu - 600001
      </p>

      <h2>🗺 Location</h2>
      <iframe
        title="college-location"
        src="https://maps.google.com/maps?q=Chennai&t=&z=13&ie=UTF8&iwloc=&output=embed"
        width="100%"
        height="300"
        style={{ border: 0 }}
        loading="lazy"
      ></iframe>
    </div>
  );
}

export default Home;
