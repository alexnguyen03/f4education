package com.f4education.springjwt.interfaces;

import java.util.List;

import com.f4education.springjwt.payload.request.CourseDTO;
import com.f4education.springjwt.payload.request.CourseRequest;
import com.f4education.springjwt.payload.response.CourseResponse;

public interface CoursesService {
	List<CourseDTO> findAllCourseDTO();

	List<CourseResponse> findNewestCourse();

	CourseResponse findCourseByCourseId(Integer courseId);

//	List<CourseDTO> findTop10SoldCourse();

	CourseDTO findById(Integer id);

	CourseDTO saveCourse(CourseRequest courseRequest);

	List<CourseDTO> findAllByAdminId(String adminId);

	List<CourseDTO> findBySubjectNames(List<String> subjectNames);

	List<CourseDTO> findByThoiLuongInRange(List<String> checkedDurations);

	List<CourseDTO> findAllCourseDTOByStudentId(String studentId);

	List<CourseDTO> getCourseBySubjectName(String subjectName);
}
