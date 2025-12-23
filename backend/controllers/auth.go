package controllers

import (
	"database/sql"
	"encoding/json"
	"net/http"

	"college-api/config"
)

func Login(w http.ResponseWriter, r *http.Request) {
	w.Header().Set("Content-Type", "application/json")

	if r.Method != http.MethodPost {
		http.Error(w, "Method not allowed", http.StatusMethodNotAllowed)
		return
	}

	var req struct {
		Email    string `json:"email"`
		Password string `json:"password"`
		Role     string `json:"role"`
	}

	if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
		http.Error(w, "Invalid request body", http.StatusBadRequest)
		return
	}

	var (
		id       int
		name     string
		email    string
		dbPass   string
		role     string
	)

	err := config.DB.QueryRow(`
		SELECT id, name, email, password, role
		FROM users
		WHERE email = $1 AND role = $2
	`, req.Email, req.Role).Scan(&id, &name, &email, &dbPass, &role)

	if err == sql.ErrNoRows {
		http.Error(w, "Invalid credentials", http.StatusUnauthorized)
		return
	} else if err != nil {
		http.Error(w, "Server error", http.StatusInternalServerError)
		return
	}

	// ❌ NO HASHING — DIRECT STRING COMPARISON
	if req.Password != dbPass {
		http.Error(w, "Invalid credentials", http.StatusUnauthorized)
		return
	}

	// ✅ Login success
	json.NewEncoder(w).Encode(map[string]interface{}{
		"user": map[string]interface{}{
			"id":    id,
			"name":  name,
			"email": email,
			"role":  role,
		},
	})
}
