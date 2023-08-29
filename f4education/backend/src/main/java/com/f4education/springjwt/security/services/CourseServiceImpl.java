package com.f4education.springjwt.security.services;

import com.f4education.springjwt.interfaces.CoursesService;
import com.f4education.springjwt.models.Admin;
import com.f4education.springjwt.models.Course;
import com.f4education.springjwt.models.CourseHistory;
import com.f4education.springjwt.models.Subject;
import com.f4education.springjwt.payload.request.CourseDTO;
import com.f4education.springjwt.payload.request.CourseRequest;
import com.f4education.springjwt.repository.AdminRepository;
import com.f4education.springjwt.repository.CourseHistoryRepository;
import com.f4education.springjwt.repository.CourseRepository;
import com.f4education.springjwt.repository.SubjectRepository;
import org.springframework.beans.BeanUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.util.Date;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class CourseServiceImpl implements CoursesService {
	@Autowired
	CourseRepository courseRepository;
	@Autowired
	AdminRepository adminRepository;
	@Autowired
	SubjectRepository subjectRepository;
	@Autowired
	CourseHistoryRepository courseHistoryRepository;

	@Override
	public List<CourseDTO> findAllCourseDTO() {
		return courseRepository.findAll()
				.stream()
				.map(this::convertEntityToDTO)
				.collect(Collectors.toList());
	}

	@Override
	public Course findById(Integer id) {
		return courseRepository.findById(id).get();
	}

	@Override
	public CourseDTO saveCourse(CourseRequest courseRequest) {
		String action = "CREATE";
		Course course = this.convertRequestToEntity(courseRequest);
		Integer idCouse = course.getCourseId();
		if (idCouse != null) {
			action = "UPDATE";
		}
		Subject subject = subjectRepository.findById(courseRequest.getSubjectId()).get();
		course.setAdmin(subject.getAdmin());
		course.setSubject(subject);
		Course savedCourse = courseRepository.save(course);
		this.saveCourseHistory(savedCourse, action);
		return this.convertEntityToDTO(savedCourse);
	}

	@Override
	public List<CourseDTO> findAllByAdminId(String adminId) {
		return courseRepository.findAllByAdmin_AdminId(adminId).stream()
				.map(this::convertEntityToDTO)
				.collect(Collectors.toList());
	}

	private CourseDTO convertEntityToDTO(Course course) {
		return new CourseDTO(course.getCourseId(), course.getCourseName(), course.getCoursePrice(),
				course.getCourseDuration(), course.getCourseDescription(), course.getNumberSession(),
				course.getSubject(), course.getImage());
	}

	private Course convertRequestToEntity(CourseRequest courseRequest) {
		Course course = new Course();
		BeanUtils.copyProperties(courseRequest, course);
		Subject subject = subjectRepository.findById(courseRequest.getSubjectId()).get();
		if (subject == null) {
			throw new RuntimeException("Can not find subject with id " + courseRequest.getSubjectId());
		}
		course.setSubject(subject);
		return course;
	}

	private void saveCourseHistory(Course course, String action) {
		CourseHistory courseHistory = new CourseHistory();
		BeanUtils.copyProperties(course, courseHistory);
		courseHistory.setCourse(course);
		courseHistory.setModifyDate(new Date());
		courseHistory.setAction(action);
		courseHistoryRepository.save(courseHistory);
	}
}
