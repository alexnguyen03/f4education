package com.f4education.springjwt.controllers;

import com.f4education.springjwt.payload.response.CourseHistoryDTO;
import com.f4education.springjwt.security.services.CourseHistoryServiceImpl;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@CrossOrigin("*")
@RequestMapping("api/courses-history")
public class CourseHistoryContrller {

	@Autowired
	CourseHistoryServiceImpl courseHistoryService;

	@GetMapping("")
	public List<CourseHistoryDTO> getAllCourseHistory() {
		return courseHistoryService.findAll();
	}

	@GetMapping("/{id}")
	public List<CourseHistoryDTO> getAllCourseById(@PathVariable("id") Integer courseId) {
		return courseHistoryService.findByCourseID(courseId);
	}
}
