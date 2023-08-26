package com.f4education.springjwt.controllers;

import com.f4education.springjwt.payload.request.CourseDTO;
import com.f4education.springjwt.security.services.CourseServiceImpl;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@CrossOrigin("*")
@RequestMapping("/api/courses")
@RequiredArgsConstructor

public class CoursesController {
	@Autowired
	CourseServiceImpl courseService;

	@GetMapping
	@PreAuthorize("hasRole('ADMIN')")
	public List<CourseDTO> getAllCourse() {
		return courseService.findAllCourseDTO();
	}

	@PostMapping
	@PreAuthorize("hasRole('ADMIN')")
	public CourseDTO addCourse(@RequestBody CourseDTO courseDTO ){
		return  courseService.addCourse(courseDTO);
	}
}
