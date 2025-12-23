package routes

import (
	"net/http"
	"college-api/controllers"
	"college-api/middleware"
)


func RegisterRoutes() {
	loginHandler := http.HandlerFunc(controllers.Login)

	http.Handle(
		"/api/login",
		middlewares.EnableCORS(loginHandler),
	)

	
	http.Handle(
		"/api/admin/all-courses",
		middlewares.EnableCORS(http.HandlerFunc(controllers.GetAllCourses)),
	)

	http.Handle(
		"/api/admin/my-courses",
		middlewares.EnableCORS(http.HandlerFunc(controllers.GetMyCourses)),
	)

	http.Handle(
		"/api/admin/course-students",
		middlewares.EnableCORS(http.HandlerFunc(controllers.GetCourseStudents)),
	)

	http.Handle(
		"/api/admin/save-grades",
		middlewares.EnableCORS(http.HandlerFunc(controllers.SaveGrades)),
	)

	http.Handle(
		"/api/student/completed-courses",
		middlewares.EnableCORS(http.HandlerFunc(controllers.GetCompletedCourses)),
	)

	http.Handle(
		"/api/student/ongoing-courses",
		middlewares.EnableCORS(http.HandlerFunc(controllers.GetOngoingCourses)),
	)
}