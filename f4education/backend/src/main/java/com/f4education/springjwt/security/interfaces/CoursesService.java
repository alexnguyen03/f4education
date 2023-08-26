package com.f4education.springjwt.security.interfaces;

import com.f4education.springjwt.models.Course;
import com.f4education.springjwt.payload.request.CourseDTO;

import java.util.List;

public interface CoursesService {
	public List<CourseDTO> findAllCourseDTO();

	public Course findById(Integer id);

	public CourseDTO addCourse(CourseDTO course);
}
