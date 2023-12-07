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

import com.f4education.springjwt.interfaces.TeacherService;
import com.f4education.springjwt.payload.request.TeacherDTO;
import com.f4education.springjwt.security.services.FirebaseStorageService;
import com.f4education.springjwt.ultils.XFile;
import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;

import lombok.RequiredArgsConstructor;

@CrossOrigin("*")
@RestController
@RequestMapping("/api/teachers")
@RequiredArgsConstructor
public class TeacherController {
	@Autowired
	TeacherService teacherService;

	@Autowired
	FirebaseStorageService firebaseStorageService;

	@GetMapping
	@PreAuthorize("hasRole('ADMIN')")
	public ResponseEntity<?> getAllTeachers() {
		List<TeacherDTO> list = teacherService.getAllTeachersDTO();
		return ResponseEntity.ok(list);
	}

	@GetMapping("/{id}")
	// @PreAuthorize("hasRole('TEACHER') or hasRole('ADMIN')")
	public ResponseEntity<?> getTeacher(@PathVariable("id") String teacherID) {
		TeacherDTO teacher = teacherService.getTeacherDTOByID(teacherID);
		return ResponseEntity.ok(teacher);
	}

	@PutMapping(value = "", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
	// @PreAuthorize("hasRole('ADMIN')")
	public ResponseEntity<?> updateSubject(@RequestPart("teacherRequest") String teacherRequestString,
			@RequestParam("file") Optional<MultipartFile> file) {
		ObjectMapper mapper = new ObjectMapper();
		TeacherDTO teacherRequest = new TeacherDTO();
		try {
			teacherRequest = mapper.readValue(teacherRequestString, TeacherDTO.class);
			// if (file.isPresent()) {
			if (!file.isEmpty()) {

				String imageURL = firebaseStorageService.uploadImage(file.get(),
						"teachers/", teacherRequest.getTeacherId().trim());
				teacherRequest.setImage(teacherRequest.getTeacherId());
			}
			// }
		} catch (JsonProcessingException e) {
			e.printStackTrace();
		} catch (IOException e) {
			e.printStackTrace();
		}
		TeacherDTO teacherDTO = teacherService.updateTeacher(teacherRequest);
		return ResponseEntity.ok(teacherDTO);
	}
}
