package main

import (
	"archive/zip"
	"io"
	"net/http"
	"os"
)

const zipname = "mogai.zip"

func main() {
	download()
	unzip()
}

func download() {
	res, err := http.Get("https://laof.github.io/blob/files/mogai.zip")

	if err != nil {
		panic(err)
	}

	defer res.Body.Close()
	file, e := os.Create(zipname)

	if e != nil {
		panic(e)
	}

	io.Copy(file, res.Body)
}

func unzip() error {
	reader, err := zip.OpenReader(zipname)
	if err != nil {
		return err
	}
	defer reader.Close()
	for _, file := range reader.File {

		filename := "./" + file.Name

		if file.FileInfo().IsDir() {
			os.MkdirAll(filename, 0755)
			continue
		}

		rc, err := file.Open()
		if err != nil {
			return err
		}
		defer rc.Close()

		w, _ := os.Create(filename)
		defer w.Close()
		io.Copy(w, rc)
		w.Close()
		rc.Close()
	}
	return nil

}
