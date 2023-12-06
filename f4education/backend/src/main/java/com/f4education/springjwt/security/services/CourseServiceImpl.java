package com.f4education.springjwt.security.services;

import java.util.ArrayList;
import java.util.Date;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

import org.springframework.beans.BeanUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.f4education.springjwt.DriveQuickstart;
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
import com.f4education.springjwt.repository.GoogleDriveRepository;
import com.f4education.springjwt.repository.RegisterCourseRepository;
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
	@Autowired
	GoogleDriveRepository googleDriveRepository;

	@Autowired
	RegisterCourseRepository registerCourseRepository;

	@Override
	public List<CourseDTO> findAllCourseDTO() {
		return courseRepository.findAll().stream().map(this::convertEntityToDTO).collect(Collectors.toList());
	}

	@Override
	public CourseResponse findCourseByCourseId(Integer courseId, String studentId) {
		Optional<Course> course = courseRepository.findById(courseId);

		Boolean isPurchase = false;
		Integer registerCourseId = 0;

		for (RegisterCourse rg : course.get().getRegisterCourses()) {
			if (rg.getStudent().getStudentId().equalsIgnoreCase(studentId)) {
				isPurchase = true;
			}
			if (course.get().getCourseId().equals(rg.getCourse().getCourseId())) {
				registerCourseId = rg.getRegisterCourseId();
			}
		}

		if (course.isPresent()) {
			return this.convertToResponseDTO(course.get(), isPurchase, registerCourseId);
		}

		return null;
	}

	@Override
	public List<CourseResponse> findNewestCourse(String studentId) {
		List<Course> courses = courseRepository.findTop10LatestCourses(true);
		List<CourseResponse> courseResponses = new ArrayList<>();

		for (Course course : courses) {
			Boolean isPurchase = false;

			for (RegisterCourse rg : course.getRegisterCourses()) {
				if (rg.getStudent().getStudentId().equalsIgnoreCase(studentId)) {
					isPurchase = true;
					break;
				}
			}

			CourseResponse courseResponse = convertToResponseDTO(course, isPurchase, null);
			courseResponses.add(courseResponse);
		}

		return courseResponses;
	}

	@Override
	public List<CourseResponse> findTop10SoldCourse(String studentId) {
		List<Object[]> list = courseRepository.findTop10CoursesWithBillDetails(true);

		List<Course> courses = new ArrayList<>();

		for (Object[] objArray : list) {
			if (objArray.length >= 1) {
				Course courseData = new Course();
				courseData.setAdmin(null);
				courseData.setBillDetail(null);
				courseData.setCourseHistories(null);
				courseData.setQuestions(null);
				courseData.setResources(null);
				courseData.setQuizResults(null);

				courseData.setCourseId((Integer) objArray[0]);
				courseData.setCourseName((String) objArray[1]);
				Object value = objArray[2];
				Float floatValue = null;

				if (value != null) {
					String stringValue = value.toString();

					try {
						floatValue = Float.parseFloat(stringValue);
					} catch (NumberFormatException e) {
						e.printStackTrace();
					}
				}

				System.out.println(objArray[5]);
				System.out.println(objArray[6]);
				System.out.println(objArray[7]);

				courseData.setCoursePrice(floatValue);
				courseData.setCourseDuration((Integer) objArray[3]);
				courseData.setCourseDescription((String) objArray[4]);
				courseData.setImage((String) objArray[5]);
				Object subjectId = objArray[6];

				Subject subject = null;
				if (subjectId != null) {
					Integer subjectIdvalue = Integer.parseInt(subjectId.toString());
					try {
						subject = subjectRepository.findById(subjectIdvalue).get();
					} catch (NumberFormatException e) {
						e.printStackTrace();
					}
				}
				courseData.setSubject(subject);

				List<RegisterCourse> rg = registerCourseRepository.findByCourseId((Integer) objArray[0]);
				System.out.println(rg);
				courseData.setRegisterCourses(rg);
				courseData.setStatus((Boolean) objArray[8].toString().equals("1") ? true : false);

				courses.add(courseData);
			}
		}
		List<CourseResponse> courseResponses = new ArrayList<>();

		for (Course course : courses) {
			Boolean isPurchase = false;

			for (RegisterCourse rg : course.getRegisterCourses()) {
				if (rg.getStudent().getStudentId().equalsIgnoreCase(studentId)) {
					isPurchase = true;
					break;
				}
			}

			CourseResponse courseResponse = convertToResponseDTO(course, isPurchase, null);
			courseResponses.add(courseResponse);
		}

		// for (Course course : courses) {
		// CourseResponse courseResponse = convertToResponseDTO(course, false, null);
		// courseResponses.add(courseResponse);
		// }

		return courseResponses;
	}

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

		course.setStatus(true);

		if (idCourse != null) {
			action = "UPDATE";
			Course foundCourse = courseRepository.findById(idCourse).get();
			if (!course.getCourseName().equalsIgnoreCase(foundCourse.getCourseName())) {
				try {
					googleDriveRepository.renameFolder(foundCourse.getCourseName(), course.getCourseName());
				} catch (Exception e) {
					// TODO Auto-generated catch block
					e.printStackTrace();
				}
			}
		} else {
			try {
				String folderIdCreated = googleDriveRepository.getFolderId(course.getCourseName());

				googleDriveRepository.createFolderWithoutUploadFile(folderIdCreated);

			} catch (Exception e) {
				// TODO Auto-generated catch block
				e.printStackTrace();
			}
		}
		Subject subject = subjectRepository.findById(courseRequest.getSubjectId()).get();
		course.setAdmin(subject.getAdmin());
		course.setSubject(subject);
		course.setCourseDuration(courseRequest.getCourseDuration());
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
		CourseDTO courseDTO = new CourseDTO();
		BeanUtils.copyProperties(course, courseDTO);
		
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

		courseDTO.setRating(totalRating);
		courseDTO.setReviewNumber(totalReview);
		courseDTO.setTotalStudent(totalStudent);
		
		return courseDTO;
	}

	private CourseResponse convertToResponseDTO(Course course, Boolean isPurchase, Integer registerCourseId) {
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
		courseResponse.setIsPurchase(isPurchase);
		courseResponse.setRegisterCourseId(registerCourseId);

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
		courseHistory.setModifyDate(new Date());
		courseHistory.setAction(action);
		courseHistory.setCourseDuration(course.getCourseDuration());
		courseHistory.setCourse(course);
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

	@Override
	public String renameFolder(String folderName, String newFolderName) throws Exception {
		return googleDriveRepository.renameFolder(folderName, newFolderName);
	}

	@Override
	public Boolean isCourseNameExist(String courseName) {
		return !courseRepository.isCourseNameExist(courseName).isEmpty();
	}

}
