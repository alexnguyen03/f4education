package com.f4education.springjwt.security.services;

import java.util.Date;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

import org.springframework.beans.BeanUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.f4education.springjwt.interfaces.CoursesDetailService;
import com.f4education.springjwt.models.Course;
import com.f4education.springjwt.models.CourseDetail;
import com.f4education.springjwt.payload.request.CourseDetailDTO;
import com.f4education.springjwt.repository.CourseDetailRepository;
import com.f4education.springjwt.repository.CourseRepository;

@Service
public class CourseDetailServiceImpl implements CoursesDetailService {
	@Autowired
	CourseDetailRepository courseDetailRepository;

	@Autowired
	CourseRepository courseRepository;

	@Override
	public List<CourseDetailDTO> getAllCourseDetail() {
		List<CourseDetail> courseDetail = courseDetailRepository.findAll();
		return courseDetail.stream().map(this::convertToQuestionResponse).collect(Collectors.toList());
	}

	@Override
	public List<CourseDetailDTO> getAllCourseDetailByCourseId(Integer courseId) {
		List<CourseDetail> courseDetail = courseDetailRepository.findAllByCourseId(courseId);
		return courseDetail.stream().map(this::convertToQuestionResponse).collect(Collectors.toList());
	}

	@Override
	public CourseDetailDTO createCourseDetail(CourseDetailDTO courseDetailDTO) {
		CourseDetail courseDetail = this.convertRequestToEntity(courseDetailDTO);

		if (courseDetail != null) {
			courseDetail.setCreateDate(new Date());

			CourseDetail saveCourse = courseDetailRepository.save(courseDetail);
			return this.convertToQuestionResponse(saveCourse);
		}

		return null;
	}

	@Override
	public CourseDetailDTO updateCourseDetail(Integer courseDetailId, CourseDetailDTO courseDetailDTO) {
		Optional<CourseDetail> existingCourse = courseDetailRepository.findById(courseDetailId);
		System.out.println(existingCourse);
		if (existingCourse.isPresent()) {
			CourseDetail newCourse = existingCourse.get();

			this.convertRequestToEntity(courseDetailDTO, newCourse);

			CourseDetail updateCourse = courseDetailRepository.save(newCourse);
			return this.convertToQuestionResponse(updateCourse);
		}

		return null;
	}

	@Override
	public void deleteCourseDetail(Integer courseDetailId) {
		courseDetailRepository.deleteById(courseDetailId);
	}

	private CourseDetailDTO convertToQuestionResponse(CourseDetail courseDetail) {
		CourseDetailDTO courseDetailDTO = new CourseDetailDTO();

		BeanUtils.copyProperties(courseDetail, courseDetailDTO);

		courseDetailDTO.setCourseId(courseDetail.getCourse().getCourseId());

		return courseDetailDTO;
	}

	private CourseDetail convertRequestToEntity(CourseDetailDTO courseDetailDTO) {
		CourseDetail courseDetail = new CourseDetail();

		Optional<Course> course = courseRepository.findById(courseDetailDTO.getCourseId());

		if (course.isPresent()) {
			courseDetail.setCourse(course.get());
		}

		courseDetail.setLessionTitle(courseDetailDTO.getLessionTitle());
		courseDetail.setLessionContent(courseDetailDTO.getLessionContent());
		courseDetail.setCreateDate(courseDetailDTO.getCreateDate());

		return courseDetail;
	}

	private void convertRequestToEntity(CourseDetailDTO courseDetailDTO, CourseDetail courseDetail) {
		Optional<Course> course = courseRepository.findById(courseDetailDTO.getCourseId());

		if (course.isPresent()) {
			courseDetail.setCourse(course.get());
		}

		courseDetail.setLessionTitle(courseDetailDTO.getLessionTitle());
		courseDetail.setLessionContent(courseDetailDTO.getLessionContent());
	}
}
