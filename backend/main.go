package main

import (
	"log"
	"net/http"

	"college-api/config"
	"college-api/routes"
)

func main() {
	config.ConnectDB()
	routes.RegisterRoutes()

	log.Println("Server running on http://localhost:8080")
	log.Fatal(http.ListenAndServe(":8080", nil))
}
