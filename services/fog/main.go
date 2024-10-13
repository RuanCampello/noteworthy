package main

import (
	"log"
	"net/http"
)

func uploadHandler(w http.ResponseWriter, r *http.Request) {
	file, headers, err := r.FormFile("user-profile-picture")

	if err != nil {
		log.Println("Error retrieving file:", err)
		http.Error(w, "File not found", http.StatusBadRequest)
		return
	}

	log.Println("File name: ", headers.Filename)
	log.Println("File received:", file)
}

func main() {
	http.HandleFunc("POST /", uploadHandler)

	log.Println("Starting server on port 8000")
	if err := http.ListenAndServe(":8000", nil); err != nil {
		log.Fatal(err)
	}
}
