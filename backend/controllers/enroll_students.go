package controllers

import (
	"encoding/json"
	"net/http"

	"college-api/config"
)

type EnrollmentInput struct {
	StudentID int `json:"student_id"`
	CourseID  int `json:"course_id"`
}

func EnrollStudent(w http.ResponseWriter, r *http.Request) {
	w.Header().Set("Content-Type", "application/json")

	if r.Method != http.MethodPost {
		http.Error(w, "Method not allowed", http.StatusMethodNotAllowed)
		return
	}

	var input EnrollmentInput
	if err := json.NewDecoder(r.Body).Decode(&input); err != nil {
		http.Error(w, "Invalid request body", http.StatusBadRequest)
		return
	}

	// Insert into enrollments
	_, err := config.DB.Exec(`
		INSERT INTO enrollments (student_id, course_id, status)
		VALUES ($1, $2, 'ongoing')
	`, input.StudentID, input.CourseID)

	if err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}

	json.NewEncoder(w).Encode(map[string]string{
		"message": "Enrollment successful",
	})
}
