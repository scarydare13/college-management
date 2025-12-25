package controllers

import (
	"encoding/json"
	"net/http"

	"college-api/config"
)

func GetCourseStudents(w http.ResponseWriter, r *http.Request) {
	w.Header().Set("Content-Type", "application/json")

	courseID := r.URL.Query().Get("course_id")
	if courseID == "" {
		http.Error(w, "course_id is required", http.StatusBadRequest)
		return
	}

	rows, err := config.DB.Query(`
		SELECT
			e.id AS enrollment_id,
			u.id AS student_id,
			u.name,
			COALESCE(g.grade, '') AS grade
		FROM enrollments e
		JOIN users u ON u.id = e.student_id
		LEFT JOIN grades g ON g.enrollment_id = e.id
		WHERE e.course_id = $1
		ORDER BY u.name
	`, courseID)

	if err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}
	defer rows.Close()

	var students []map[string]interface{}

	for rows.Next() {
		var enrollmentID, studentID int
		var name, grade string

		rows.Scan(&enrollmentID, &studentID, &name, &grade)

		students = append(students, map[string]interface{}{
			"enrollment_id": enrollmentID,
			"student_id":    studentID,
			"name":          name,
			"grade":         grade,
		})
	}

	json.NewEncoder(w).Encode(students)
}
