package com.f4education.springjwt.interfaces;

import com.f4education.springjwt.payload.response.CourseHistoryDTO;

import java.util.List;

public interface CourseHistoryService {
	List<CourseHistoryDTO> findAll();

	List<CourseHistoryDTO> findByCourseID(Integer Id);

}
