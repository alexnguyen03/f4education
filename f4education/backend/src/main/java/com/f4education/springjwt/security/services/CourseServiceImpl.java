package com.f4education.springjwt.security.services;

import java.util.ArrayList;
import java.util.Date;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

import org.springframework.beans.BeanUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.f4education.springjwt.interfaces.CoursesService;
import com.f4education.springjwt.models.Course;
import com.f4education.springjwt.models.CourseHistory;
import com.f4education.springjwt.models.Evaluate;
import com.f4education.springjwt.models.RegisterCourse;
import com.f4education.springjwt.models.Student;
import com.f4education.springjwt.models.Subject;
import com.f4education.springjwt.payload.request.CourseDTO;
import com.f4education.springjwt.payload.request.CourseRequest;
import com.f4education.springjwt.payload.request.ThoiLuongRange;
import com.f4education.springjwt.payload.response.CourseResponse;
import com.f4education.springjwt.repository.AdminRepository;
import com.f4education.springjwt.repository.CourseHistoryRepository;
import com.f4education.springjwt.repository.CourseRepository;
import com.f4education.springjwt.repository.SubjectRepository;

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
		return courseRepository.findAll().stream().map(this::convertEntityToDTO).collect(Collectors.toList());
	}

	@Override
	public CourseResponse findCourseByCourseId(Integer courseId) {
		Optional<Course> course = courseRepository.findById(courseId);

		if (course.isPresent()) {
			return this.convertToResponseDTO(course.get());
		}

		return null;
	}

	@Override
	public List<CourseResponse> findNewestCourse() {
		return courseRepository.findTop10LatestCourses().stream().map(this::convertToResponseDTO)
				.collect(Collectors.toList());
	}

//	@Override
//	public List<CourseDTO> findTop10SoldCourse() {
//		return courseRepository.findTopSellingCourses().stream().map(this::convertEntityToDTO)
//				.collect(Collectors.toList());
//	}

	@Override
	public CourseDTO findById(Integer id) {
		return convertEntityToDTO(courseRepository.findById(id).get());
	}

	@Override
	public List<CourseDTO> getCourseBySubjectName(String subjectName) {
		List<Course> course = courseRepository.getCourseBySubjectName(subjectName);
		return course.stream().map(this::convertEntityToDTO).collect(Collectors.toList());
	}

	@Override
	public CourseDTO saveCourse(CourseRequest courseRequest) {
		String action = "CREATE";
		Course course = this.convertRequestToEntity(courseRequest);
		Integer idCourse = courseRequest.getCourseId();
		if (idCourse != null) {
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
		return courseRepository.findAllByAdmin_AdminId(adminId).stream().map(this::convertEntityToDTO)
				.collect(Collectors.toList());
	}

	private CourseDTO convertEntityToDTO(Course course) {
		return new CourseDTO(course.getCourseId(), course.getCourseName(), course.getCoursePrice(),
				course.getCourseDuration(), course.getCourseDescription(), course.getNumberSession(),
				course.getSubject(), course.getImage());
	}

	private CourseResponse convertToResponseDTO(Course course) {
		CourseResponse courseResponse = new CourseResponse();

		BeanUtils.copyProperties(course, courseResponse);

		List<RegisterCourse> registerCourse = course.getRegisterCourses();

		Float totalRating = (float) 0;
		List<Evaluate> evaluateList = new ArrayList<>();
		List<Student> studentList = new ArrayList<>();
		for (RegisterCourse rg : registerCourse) {
			for (Evaluate evaluate : rg.getEvaluates()) {
				totalRating += evaluate.getRating();
				evaluateList.add(evaluate);
			}
			studentList.add(rg.getStudent());
		}
		
		// Calculate value		
		Integer totalReview = evaluateList.size();
		Integer totalStudent = studentList.size();
		totalRating = totalRating / evaluateList.size();
		
		courseResponse.setRating(totalRating);
		courseResponse.setReviewNumber(totalReview);
		courseResponse.setTotalStudent(totalStudent);

		return courseResponse;
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

	@Override
	public List<CourseDTO> findBySubjectNames(List<String> checkedSubjects) {
		List<CourseDTO> list = courseRepository.findBySubjectNames(checkedSubjects).stream()
				.map(this::convertEntityToDTO).collect(Collectors.toList());
		return list;
	}

	@Override
	public List<CourseDTO> findByThoiLuongInRange(List<String> checkedDurations) {
		List<CourseDTO> list = new ArrayList<>();
		List<ThoiLuongRange> ketQua = this.kiemTraChu(checkedDurations);
		System.out.println(ketQua);
		for (ThoiLuongRange range : ketQua) {
			list = courseRepository.findByThoiLuongInRange(range.getMinThoiLuong(), range.getMaxThoiLuong()).stream()
					.map(this::convertEntityToDTO).collect(Collectors.toList());
		}
		return list;
	}

	public List<ThoiLuongRange> kiemTraChu(List<String> danhSach) {
		List<ThoiLuongRange> ketQua = new ArrayList<>();

		boolean coShort = danhSach.contains("short");
		boolean coMedium = danhSach.contains("medium");
		boolean coLong = danhSach.contains("long");

		if (coShort && coMedium) {
			ketQua.add(new ThoiLuongRange(0, 90));
		} else if (coShort && coLong) {
			ketQua.add(new ThoiLuongRange(0, 120));
		} else if (coMedium && coLong) {
			ketQua.add(new ThoiLuongRange(60, 120));
		} else if (coShort) {
			ketQua.add(new ThoiLuongRange(0, 60));
		} else if (coMedium) {
			ketQua.add(new ThoiLuongRange(60, 90));
		} else if (coLong) {
			ketQua.add(new ThoiLuongRange(90, 120));
		}

		return ketQua;
	}

	@Override
	public List<CourseDTO> findAllCourseDTOByStudentId(String studentId) {
		List<CourseDTO> list = courseRepository.findByStudentId(studentId).stream().map(this::convertEntityToDTO)
				.collect(Collectors.toList());
		System.out.println(list);
		return list;
	}

}
