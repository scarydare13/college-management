package controllers

import (
	"database/sql"
	"encoding/json"
	"log"
	"net/http"

	"college-api/config"
)

func Login(w http.ResponseWriter, r *http.Request) {
	w.Header().Set("Content-Type", "application/json")

	if r.Method != http.MethodPost {
		w.WriteHeader(http.StatusMethodNotAllowed)
		json.NewEncoder(w).Encode(map[string]string{
			"message": "Method not allowed",
		})
		return
	}

	var req struct {
		Email    string `json:"email"`
		Password string `json:"password"`
		Role     string `json:"role"`
	}

	if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
		w.WriteHeader(http.StatusBadRequest)
		json.NewEncoder(w).Encode(map[string]string{
			"message": "Invalid request body",
		})
		return
	}

	// Log incoming UI values
	log.Printf("Login request from UI -> email=%s role=%s password=%s", req.Email, req.Role, req.Password)

	var (
		id     int
		name   string
		email  string
		dbPass string
		role   string
	)

	err := config.DB.QueryRow(`
		SELECT id, name, email, password, role
		FROM users
		WHERE email = $1 AND role = $2
	`, req.Email, req.Role).Scan(&id, &name, &email, &dbPass, &role)

	if err == sql.ErrNoRows {
		log.Printf("DB query returned no rows for email=%s role=%s", req.Email, req.Role)
		w.WriteHeader(http.StatusUnauthorized)
		json.NewEncoder(w).Encode(map[string]string{
			"message": "Invalid credentials",
		})
		return
	} else if err != nil {
		log.Printf("DB query error for email=%s role=%s: %v", req.Email, req.Role, err)
		w.WriteHeader(http.StatusInternalServerError)
		json.NewEncoder(w).Encode(map[string]string{
			"message": "Server error",
		})
		return
	}

	// Log DB values retrieved
	log.Printf("DB record -> id=%d name=%s email=%s role=%s password=%s", id, name, email, role, dbPass)

	// ⚠️ Plain text comparison (OK for now, but use bcrypt later)
	if req.Password != dbPass {
		w.WriteHeader(http.StatusUnauthorized)
		json.NewEncoder(w).Encode(map[string]string{
			"message": "Invalid credentials",
		})
		return
	}

	// ✅ Login success — include DB debug info
	w.WriteHeader(http.StatusOK)
	json.NewEncoder(w).Encode(map[string]interface{}{
		"user": map[string]interface{}{
			"id":    id,
			"name":  name,
			"email": email,
			"role":  role,
		},
		"db_debug": map[string]interface{}{
			"id":       id,
			"name":     name,
			"email":    email,
			"role":     role,
			"password": dbPass,
		},
	})
}
