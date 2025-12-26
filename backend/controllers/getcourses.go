package controllers

import (
	"encoding/json"
	"net/http"

	"college-api/config"
)

func GetCourses(w http.ResponseWriter, r *http.Request) {
	w.Header().Set("Content-Type", "application/json")

	rows, err := config.DB.Query(`
		SELECT
			id,
			name AS course
		FROM courses
		GROUP BY id, name
		ORDER BY name
	`)
	if err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}
	defer rows.Close()

	var courses []map[string]interface{}

	for rows.Next() {
		var id int
		var course string

		if err := rows.Scan(&id, &course); err != nil {
			http.Error(w, err.Error(), http.StatusInternalServerError)
			return
		}

		courses = append(courses, map[string]interface{}{
			"id":     id,
			"course": course,
		})
	}

	json.NewEncoder(w).Encode(courses)
}
