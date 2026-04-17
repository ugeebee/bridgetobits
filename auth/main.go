package main

import (
	"fmt"
	"log"
	"net/http"
)

func enableCORS(next http.HandlerFunc) http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		w.Header().Set("Access-Control-Allow-Origin", "http://localhost:3000")
		w.Header().Set("Access-Control-Allow-Credentials", "true")
		w.Header().Set("Access-Control-Allow-Methods", "POST, GET, OPTIONS, PUT, DELETE")
		w.Header().Set("Access-Control-Allow-Headers", "Accept, Content-Type, Content-Length, Accept-Encoding, Authorization")
		if r.Method == "OPTIONS" {
			w.WriteHeader(http.StatusOK)
			return
		}

		next.ServeHTTP(w, r)
	}
}

func main() {
	initDB()
	defer db.Close()

	http.HandleFunc("/signup", enableCORS(SignupHandler))
	http.HandleFunc("/login", enableCORS(LoginHandler))
	http.HandleFunc("/logout", enableCORS(LogoutHandler))

	port := ":8080"
	fmt.Printf("Go Auth Server running on http://localhost%s\n", port)
	log.Fatal(http.ListenAndServe(port, nil))
}
