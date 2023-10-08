package com.f4education.springjwt.interfaces;

import com.f4education.springjwt.models.Course;
import com.f4education.springjwt.payload.request.CourseDTO;
import com.f4education.springjwt.payload.request.CourseRequest;

import java.util.List;

import org.springframework.data.repository.query.Param;

public interface CoursesService {
	List<CourseDTO> findAllCourseDTO();

	CourseDTO findById(Integer id);

	CourseDTO saveCourse(CourseRequest courseRequest);

	List<CourseDTO> findAllByAdminId(String adminId);
	
	List<CourseDTO> findBySubjectNames(List<String> subjectNames);
	
	List<CourseDTO> findByThoiLuongInRange(List<String> checkedDurations);
	
	List<CourseDTO> findAllCourseDTOByAccountId(Integer accountId);
}
