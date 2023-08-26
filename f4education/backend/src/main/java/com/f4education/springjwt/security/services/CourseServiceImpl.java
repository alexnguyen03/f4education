package com.f4education.springjwt.security.services;

import com.f4education.springjwt.models.Course;
import com.f4education.springjwt.payload.request.CourseDTO;
import com.f4education.springjwt.repository.AdminRepository;
import com.f4education.springjwt.repository.CourseRepository;
import com.f4education.springjwt.security.interfaces.CoursesService;
import org.springframework.beans.BeanUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class CourseServiceImpl implements CoursesService {
	@Autowired
	CourseRepository courseRepository;
@Autowired
	AdminRepository adminRepository;
	@Override
	public List<CourseDTO> findAllCourseDTO() {
		List<Course> ls = courseRepository.findAll();
		return ls
				.stream()
				.map(this::convertEntityToDTO)
				.collect(Collectors.toList());
	}

	@Override
	public Course findById(Integer id) {
		return courseRepository.findById(id).get();
	}

	@Override
	public CourseDTO addCourse(CourseDTO courseDTO) {
		Course course = this.convertDTOToEntity(courseDTO);
		String  adminId = courseDTO.getAdminId();
		course.setAdmin(adminRepository.findById(adminId).get());
		courseRepository.save(course);
		return courseDTO;
	}

	private CourseDTO convertEntityToDTO(Course course) {
		CourseDTO dto = new CourseDTO(course.getCourseId(), course.getCourseName(), course.getCoursePrice(),
				course.getCourseDuration(), course.getCourseDescription(), course.getNumberSession(),
				course.getSubject(), course.getAdmin().getAdminId());
		return dto;
	}

	private Course convertDTOToEntity(CourseDTO courseDTO) {

		Course course = new Course();
		BeanUtils.copyProperties(course, courseDTO);
		return course;
	}

}
