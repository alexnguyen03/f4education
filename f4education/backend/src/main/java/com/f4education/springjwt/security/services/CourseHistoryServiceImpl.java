package com.f4education.springjwt.security.services;

import com.f4education.springjwt.interfaces.CourseHistoryService;
import com.f4education.springjwt.models.CourseHistory;
import com.f4education.springjwt.payload.response.CourseHistoryDTO;
import com.f4education.springjwt.repository.CourseHistoryRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class CourseHistoryServiceImpl implements CourseHistoryService {
	@Autowired
	CourseHistoryRepository courseHistoryRepository;

	@Override
	public List<CourseHistoryDTO> findAll() {
		return courseHistoryRepository
				.findAll()
				.stream()
				.map(this::convertEntityToDTO)
				.collect(Collectors.toList());
	}

	private CourseHistoryDTO convertEntityToDTO(CourseHistory courseHistory) {
		CourseHistoryDTO courseHistoryDTO = new CourseHistoryDTO();

		courseHistoryDTO.setCourseHistoryId(courseHistory.getCourseHistoryId());
		;
		courseHistoryDTO.setCourseName(courseHistory.getCourseName());
		courseHistoryDTO.setCoursePrice(courseHistory.getCoursePrice());
		courseHistoryDTO.setCourseDuration(courseHistory.getCourseDuration());
		courseHistoryDTO.setCourseDescription(courseHistory.getCourseDescription());
		courseHistoryDTO.setImage(courseHistory.getImage());
		courseHistoryDTO.setCourseId(courseHistory.getCourse().getCourseId());
		courseHistoryDTO.setAdminName(courseHistory.getCourse().getAdmin().getFullname());
		courseHistoryDTO.setAction(courseHistory.getAction());
		courseHistoryDTO.setModifyDate(courseHistory.getModifyDate());
		courseHistoryDTO.setSubjectName(courseHistory.getCourse().getSubject().getSubjectName());
		return courseHistoryDTO;
	}

	@Override
	public List<CourseHistoryDTO> findByCourseID(Integer courseId) {
		return courseHistoryRepository.findAllByCourseCourseId(courseId)
				.stream()
				.map(this::convertEntityToDTO)
				.collect(Collectors.toList());
	}
}
