package com.f4education.springjwt.controllers;

import java.io.File;
import java.io.IOException;
import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import com.f4education.springjwt.interfaces.StudentService;
import com.f4education.springjwt.interfaces.TeacherService;
import com.f4education.springjwt.payload.request.StudentDTO;
import com.f4education.springjwt.payload.request.TeacherDTO;
import com.f4education.springjwt.security.services.FirebaseStorageService;
import com.f4education.springjwt.ultils.XFile;
import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;

import lombok.RequiredArgsConstructor;

@CrossOrigin("*")
@RestController
@RequestMapping("/api/students")
@RequiredArgsConstructor
public class StudentController {
	@Autowired
	StudentService studentService;

	@Autowired
	XFile xfileService;
	@Autowired
	FirebaseStorageService firebaseStorageService;

	@GetMapping("/{id}")
	// @PreAuthorize("hasRole('TEACHER') or hasRole('ADMIN')")
	public ResponseEntity<?> getStudent(@PathVariable("id") String studentID) {
		StudentDTO studentDTO = studentService.getStudentDTOByID(studentID);
		return ResponseEntity.ok(studentDTO);
	}

	@PutMapping(value = "", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
	// @PreAuthorize("hasRole('ADMIN')")
	public ResponseEntity<?> updateStudent(@RequestPart("studentRequest") String studentRequestString,
			@RequestParam("file") Optional<MultipartFile> file) {
		ObjectMapper mapper = new ObjectMapper();
		StudentDTO studentRequest = new StudentDTO();
		try {
			studentRequest = mapper.readValue(studentRequestString, StudentDTO.class);
			if (!file.isEmpty()) {

				String imageURL = firebaseStorageService.uploadImage(file.get(),
						"students/", studentRequest.getStudentId().trim());
				firebaseStorageService.isUpdatedNoCahe("students/");
				studentRequest.setImage(studentRequest.getStudentId());
			}
		} catch (JsonProcessingException e) {
			e.printStackTrace();
		} catch (IOException e) {
			e.printStackTrace();
		}
		StudentDTO studentDTO = studentService.updateStudent(studentRequest);
		return ResponseEntity.ok(studentDTO);
	}
}
