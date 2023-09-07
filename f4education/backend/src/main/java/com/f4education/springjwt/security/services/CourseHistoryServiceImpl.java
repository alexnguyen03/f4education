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
		return courseHistoryRepository.findAll()
				.stream()
				.map(this::convertEntityToDTO)
				.collect(Collectors.toList());
	}

	private CourseHistoryDTO convertEntityToDTO(CourseHistory courseHistory) {
		return new CourseHistoryDTO(
				courseHistory.getCourseHistoryId(),
				courseHistory.getCourse().getCourseId(),
				courseHistory.getCourse().getSubject().getSubjectName(),
				courseHistory.getCourse().getAdmin().getFullname(),
				courseHistory.getCourseName(),
				courseHistory.getCoursePrice(), courseHistory.getCourseDuration(), courseHistory.getCourseDescription(),
				courseHistory.getNumberSession(), courseHistory.getImage(),
				courseHistory.getAction(),
				courseHistory.getModifyDate());
	}

	@Override
	public List<CourseHistoryDTO> findByCourseID(Integer courseId) {
		return courseHistoryRepository.findAllByCourseCourseId(courseId)
				.stream()
				.map(this::convertEntityToDTO)
				.collect(Collectors.toList());
	}

}
