package controllers

import (
	"encoding/json"
	"net/http"

	"college-api/config"
)

func GetCompletedCourses(w http.ResponseWriter, r *http.Request) {
	w.Header().Set("Content-Type", "application/json")

	studentID := r.URL.Query().Get("student_id")
	if studentID == "" {
		http.Error(w, "student_id required", http.StatusBadRequest)
		return
	}

	rows, err := config.DB.Query(`
		SELECT
			c.name AS course,
			u.name AS staff,
			g.grade
		FROM enrollments e
		JOIN courses c ON c.id = e.course_id
		JOIN staff s ON s.id = c.staff_id
		JOIN users u ON u.id = s.user_id
		JOIN grades g ON g.enrollment_id = e.id
		WHERE e.student_id = $1
		ORDER BY c.name
	`, studentID)

	if err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}
	defer rows.Close()

	var result []map[string]string

	for rows.Next() {
		var course, staff, grade string
		rows.Scan(&course, &staff, &grade)

		result = append(result, map[string]string{
			"course": course,
			"staff":  staff,
			"grade":  grade,
		})
	}

	json.NewEncoder(w).Encode(result)
}

func GetOngoingCourses(w http.ResponseWriter, r *http.Request) {
	w.Header().Set("Content-Type", "application/json")

	studentID := r.URL.Query().Get("student_id")
	if studentID == "" {
		http.Error(w, "student_id required", http.StatusBadRequest)
		return
	}

	rows, err := config.DB.Query(`
		SELECT
			c.name AS course,
			u.name AS staff
		FROM enrollments e
		JOIN courses c ON c.id = e.course_id
		JOIN staff s ON s.id = c.staff_id
		JOIN users u ON u.id = s.user_id
		WHERE e.student_id = $1
		  AND e.status = 'ongoing'
		ORDER BY c.name
	`, studentID)

	if err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}
	defer rows.Close()

	var result []map[string]string

	for rows.Next() {
		var course, staff string
		rows.Scan(&course, &staff)

		result = append(result, map[string]string{
			"course": course,
			"staff":  staff,
		})
	}

	json.NewEncoder(w).Encode(result)
}
