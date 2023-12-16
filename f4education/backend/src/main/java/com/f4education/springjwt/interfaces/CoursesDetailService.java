package com.f4education.springjwt.interfaces;

import java.util.List;

import com.f4education.springjwt.payload.request.CourseDetailDTO;

public interface CoursesDetailService {
	List<CourseDetailDTO> getAllCourseDetail();

	List<CourseDetailDTO> getAllCourseDetailByCourseId(Integer courseId);

	CourseDetailDTO createCourseDetail(CourseDetailDTO courseDetailDTO);

	CourseDetailDTO updateCourseDetail(Integer courseDetailId, CourseDetailDTO courseDetailDTO);

	void deleteCourseDetail(Integer courseDetailId);

	Integer countCourseDetailsByClassId(Integer classId);
}
