package controllers

import (
	"encoding/json"
	"net/http"

	"college-api/config"
)

//Function to get all courses
func GetAllCourses(w http.ResponseWriter, r *http.Request) {
	w.Header().Set("Content-Type", "application/json")

	rows, err := config.DB.Query(`
		SELECT 
			c.id,
			c.name,
			u.name AS staff_name
		FROM courses c
		JOIN staff s ON s.id = c.staff_id
		JOIN users u ON u.id = s.user_id
		ORDER BY c.id
	`)
	if err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}
	defer rows.Close()

	var courses []map[string]interface{}

	for rows.Next() {
		var id int
		var name, staff string

		rows.Scan(&id, &name, &staff)

		courses = append(courses, map[string]interface{}{
			"id":    id,
			"name":  name,
			"staff": staff,
		})
	}

	json.NewEncoder(w).Encode(courses)
}

//Funtion to fetch courses teach by each staff
func GetMyCourses(w http.ResponseWriter, r *http.Request) {
	w.Header().Set("Content-Type", "application/json")

	userID := r.URL.Query().Get("user_id")
	if userID == "" {
		http.Error(w, "user_id is required", http.StatusBadRequest)
		return
	}

	rows, err := config.DB.Query(`
		SELECT 
			c.id,
			c.name
		FROM courses c
		JOIN staff s ON s.id = c.staff_id
		WHERE s.user_id = $1
		ORDER BY c.id
	`, userID)

	if err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}
	defer rows.Close()

	var courses []map[string]interface{}

	for rows.Next() {
		var id int
		var name string

		rows.Scan(&id, &name)

		courses = append(courses, map[string]interface{}{
			"id":   id,
			"name": name,
		})
	}

	json.NewEncoder(w).Encode(courses)
}
