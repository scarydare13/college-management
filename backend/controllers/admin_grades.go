package controllers

import (
	"encoding/json"
	"net/http"

	"college-api/config"
)

type GradeInput struct {
	EnrollmentID int    `json:"enrollment_id"`
	Grade        string `json:"grade"`
}

func SaveGrades(w http.ResponseWriter, r *http.Request) {
	w.Header().Set("Content-Type", "application/json")

	if r.Method != http.MethodPost {
		http.Error(w, "Method not allowed", http.StatusMethodNotAllowed)
		return
	}

	var grades []GradeInput
	if err := json.NewDecoder(r.Body).Decode(&grades); err != nil {
		http.Error(w, "Invalid request body", http.StatusBadRequest)
		return
	}

	for _, g := range grades {
		_, err := config.DB.Exec(`
			INSERT INTO grades (enrollment_id, grade)
			VALUES ($1, $2)
			ON CONFLICT (enrollment_id)
			DO UPDATE SET
				grade = EXCLUDED.grade,
				graded_at = CURRENT_TIMESTAMP
		`, g.EnrollmentID, g.Grade)

		if err != nil {
			http.Error(w, err.Error(), http.StatusInternalServerError)
			return
		}
	}

	json.NewEncoder(w).Encode(map[string]string{
		"message": "Grades saved successfully",
	})
}
