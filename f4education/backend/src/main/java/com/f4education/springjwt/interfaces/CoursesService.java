package com.f4education.springjwt.interfaces;

import com.f4education.springjwt.models.Course;
import com.f4education.springjwt.payload.request.CourseDTO;
import com.f4education.springjwt.payload.request.CourseRequest;

import java.util.List;

public interface CoursesService {
	List<CourseDTO> findAllCourseDTO();

	Course findById(Integer id);

	CourseDTO saveCourse(CourseRequest courseRequest);

	List<CourseDTO> findAllByAdminId(String adminId);
	
	List<CourseDTO> getCourseBySubjectName(String subjectName);
}
