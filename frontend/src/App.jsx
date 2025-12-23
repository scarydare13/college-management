import { useState } from "react";
import Navbar from "./components/Navbar";
import Home from "./components/Home";
import Login from "./components/Login";

function App() {
  const [activeTab, setActiveTab] = useState("home");
  const [user, setUser] = useState(null);

  return (
    <>
      <Navbar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        user={user}
        onLogout={() => setUser(null)}
      />

      {activeTab === "login" ? (
        <Login
          onLogin={(u) => {
            setUser(u);
            setActiveTab("home");
          }}
        />
      ) : (
        <Home />
      )}
    </>
  );
}

export default App;
