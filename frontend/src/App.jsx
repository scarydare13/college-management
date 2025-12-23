import { useState } from "react";
import Navbar from "./components/Navbar";
import Home from "./components/Home";
import Login from "./components/Login";
import StudentDashboard from "./components/StudentDashboard";
import AdminDashboard from "./components/AdminDashboard";

function App() {
  const [activeTab, setActiveTab] = useState("home"); 
  const [user, setUser] = useState(null);

  const handleLogout = () => {
    setUser(null);
    setActiveTab("home");
  };

  return (
    <>
      <Navbar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        user={user}
        onLogout={handleLogout}
      />

      {/* 🔁 Page Rendering */}
      {activeTab === "login" && (
        <Login
          onLogin={(u) => {
            setUser(u);

            // 🔀 Redirect based on role
            if (u.role === "student") setActiveTab("student");
            else if (u.role === "admin") setActiveTab("admin");
            else setActiveTab("home");
          }}
        />
      )}

      {activeTab === "home" && <Home />}

      {activeTab === "student" && user?.role === "student" && (
        <StudentDashboard />
      )}

      {activeTab === "admin" && user?.role === "admin" && (
        <AdminDashboard />
      )}

      {/* 🔒 Safety fallback */}
      {(activeTab === "student" || activeTab === "admin") && !user && (
        <Home />
      )}
    </>
  );
}

export default App;
