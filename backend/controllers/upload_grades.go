package controllers

import (
	"encoding/json"
	"fmt"
	"net/http"
	// "strconv"

	"college-api/config"
	"github.com/tealeg/xlsx"
)

func UploadGrades(w http.ResponseWriter, r *http.Request) {
	w.Header().Set("Content-Type", "application/json")

	if r.Method != http.MethodPost {
		w.WriteHeader(http.StatusMethodNotAllowed)
		json.NewEncoder(w).Encode(map[string]string{"error": "Method not allowed"})
		return
	}

	// courseIDStr := r.FormValue("course_id")
	// courseID, err := strconv.Atoi(courseIDStr)
	// if err != nil {
	// 	w.WriteHeader(http.StatusBadRequest)
	// 	json.NewEncoder(w).Encode(map[string]string{"error": "Invalid course_id"})
	// 	return
	// }

	file, _, err := r.FormFile("file")
	if err != nil {
		w.WriteHeader(http.StatusBadRequest)
		json.NewEncoder(w).Encode(map[string]string{"error": "File is required"})
		return
	}
	defer file.Close()

	xlFile, err := xlsx.OpenReaderAt(file, r.ContentLength)
	if err != nil {
		w.WriteHeader(http.StatusBadRequest)
		json.NewEncoder(w).Encode(map[string]string{"error": "Invalid Excel file"})
		return
	}

	// Iterate rows and update grades
	for _, sheet := range xlFile.Sheets {
		for i, row := range sheet.Rows {
			if i == 0 {
				continue // skip header row
			}

			if len(row.Cells) < 2 {
				continue
			}

			enrollmentID, err := row.Cells[0].Int()
			if err != nil {
				continue
			}

			grade := row.Cells[1].String()

			_, err = config.DB.Exec(`
				INSERT INTO grades (enrollment_id, grade)
				VALUES ($1, $2)
				ON CONFLICT (enrollment_id)
				DO UPDATE SET grade = EXCLUDED.grade, graded_at = CURRENT_TIMESTAMP
			`, enrollmentID, grade)

			if err != nil {
				fmt.Println("Failed to update grade for enrollment:", enrollmentID, err)
			}
		}
	}

	json.NewEncoder(w).Encode(map[string]string{"message": "Grades updated successfully"})
}
