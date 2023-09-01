package com.f4education.springjwt.controllers;

import java.io.File;
import java.io.IOException;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.MediaType;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RequestPart;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

import com.f4education.springjwt.payload.request.CourseDTO;
import com.f4education.springjwt.payload.request.CourseRequest;
import com.f4education.springjwt.security.services.CourseServiceImpl;

import com.f4education.springjwt.ultils.XFile;
import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;

import lombok.RequiredArgsConstructor;

@RestController
@CrossOrigin("*")
@RequestMapping("/api/courses")
@RequiredArgsConstructor
public class CoursesController {
	@Autowired
	CourseServiceImpl courseService;

	@Autowired
	XFile xfileService;

	@GetMapping
	// @PreAuthorize("hasRole('ADMIN')")
	public List<CourseDTO> getAllCourse() {
		return courseService.findAllCourseDTO();
	}

	@PostMapping(value = "", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
	@ResponseBody
	// @PreAuthorize("hasRole('ADMIN')")
	public CourseDTO addCourse(@RequestPart("courseRequest") String courseRequestString,
			@RequestParam("file") MultipartFile file) {
		ObjectMapper mapper = new ObjectMapper();
		// String newFile = "";
		CourseRequest courseRequest = new CourseRequest();

		try {
			if (!file.isEmpty()) {
				File savedFile = xfileService.save(file, "/courses");
			}
			courseRequest = mapper.readValue(courseRequestString,
					CourseRequest.class);
		} catch (JsonProcessingException e) {
			e.printStackTrace();
		} catch (IOException e) {
			e.printStackTrace();
		}
		return courseService.saveCourse(courseRequest);
	}

	@PutMapping
	@PreAuthorize("hasRole('ADMIN')")
	public CourseDTO updateCourse(@RequestBody CourseRequest courseRequest) {
		return courseService.saveCourse(courseRequest);
	}

	@GetMapping("/actor/{adminId}")
	@PreAuthorize("hasRole('ADMIN')")
	public List<CourseDTO> findAllByAdminId(@PathVariable("adminId") String adminId) {
		return courseService.findAllByAdminId(adminId);
	}

}
