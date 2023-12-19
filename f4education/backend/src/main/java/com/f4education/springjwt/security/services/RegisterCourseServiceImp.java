package com.f4education.springjwt.security.services;

import com.f4education.springjwt.interfaces.ClassService;
import com.f4education.springjwt.interfaces.PointService;
import com.f4education.springjwt.interfaces.RegisterCourseService;
import com.f4education.springjwt.interfaces.TeacherService;
import com.f4education.springjwt.models.*;
import com.f4education.springjwt.payload.HandleResponseDTO;
import com.f4education.springjwt.payload.request.RegisterCourseRequestDTO;
import com.f4education.springjwt.payload.request.ScheduleCourseProgressDTO;
import com.f4education.springjwt.payload.response.CourseProgressResponseDTO;
import com.f4education.springjwt.payload.response.RegisterCourseResponseDTO;
import com.f4education.springjwt.repository.*;
import org.springframework.beans.BeanUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.ArrayList;
import java.util.Date;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
public class RegisterCourseServiceImp implements RegisterCourseService {
	@Autowired
	private RegisterCourseRepository registerCourseRepository;
	@Autowired
	MailerServiceImpl mailer;
	@Autowired
	private CourseRepository courseRepository;
	@Autowired
	private StudentRepository studentRepository;
	@Autowired
	GoogleDriveRepository googleDriveRepository;
	@Autowired
	private ClassRepository classRepository;

	@Autowired
	private ScheduleRepository scheduleRepository;

	@Autowired
	private final JdbcTemplate jdbcTemplate = new JdbcTemplate();

	@Autowired
	SessionsRepository sessionsRepository;

	@Autowired
	TeacherService teacherService;

	@Autowired
	TeacherRepository teacherRepository;
	@Autowired
	ClassRoomRepository classRoomRepository;

	@Autowired
	PointService pointService;

	@Autowired
	ClassService classService;

	@Override
	public HandleResponseDTO<List<RegisterCourseResponseDTO>> getAllRegisterCourse() {
		List<RegisterCourse> registerCourses = registerCourseRepository.findAll();
		List<RegisterCourseResponseDTO> responseDTOs = registerCourses.stream().map(this::convertToResponseDTO)
				.collect(Collectors.toList());
		return new HandleResponseDTO<>(HttpStatus.OK.value(), "List RegisterCourse", responseDTOs);
	}

	@Override
	public HandleResponseDTO<List<RegisterCourseResponseDTO>> findAllRegisterCourseByStudentId(String studentId) {
		List<RegisterCourse> registerCourses = registerCourseRepository.findByStudentId(studentId);
		if (registerCourses.isEmpty()) {
			return new HandleResponseDTO<>(HttpStatus.BAD_REQUEST.value(), "Student ID cannot be found", null);
		}
		List<RegisterCourseResponseDTO> responseDTOS = registerCourses.stream().map(this::convertToResponseDTO)
				.toList();
		return new HandleResponseDTO<>(HttpStatus.OK.value(), "List RegisterCourse by Student ID", responseDTOS);
	}

	@Override
	public List<CourseProgressResponseDTO> getCourseProgressByStudentID(String studentId) {
		List<RegisterCourse> registerCourses = registerCourseRepository.findCourseProgressByStudentId(studentId);
		return registerCourses.stream().map(this::convertToCourseProgressResponseDTO).toList();
	}

	@Override
	public Boolean checkIfCourseIsDone(String studentId, Integer classId, Integer RegisterCourseId) {
		RegisterCourse rg = registerCourseRepository.findIfCourseIsDone(studentId, classId, RegisterCourseId,
				(float) 5.0);
		return rg != null;
	}

	@Override
	public List<ScheduleCourseProgressDTO> findAllScheduleByClassId(Integer classId) {
		List<Schedule> registerCourses = scheduleRepository.findAllScheduleByClassId(classId);
		return registerCourses.stream().map(this::convertToScheduleCourseProgressDTO).toList();
	}

	public ScheduleCourseProgressDTO convertToScheduleCourseProgressDTO(Schedule schedule) {
		ScheduleCourseProgressDTO courseResponse = new ScheduleCourseProgressDTO();
		courseResponse.setClassId(schedule.getClasses().getClassId());
		courseResponse.setStudyDate(schedule.getStudyDate());
		courseResponse.setScheduleId(schedule.getScheduleId());
		return courseResponse;
	}

	public CourseProgressResponseDTO convertToCourseProgressResponseDTO(RegisterCourse registerCourse) {
		CourseProgressResponseDTO courseResponse = new CourseProgressResponseDTO();

		courseResponse.setCourse(registerCourse.getCourse());
		courseResponse.setClasses(registerCourse.getClasses());
		courseResponse.setTeacherName(registerCourse.getClasses().getTeacher().getFullname());
		courseResponse.setRegisterCourseId(registerCourse.getRegisterCourseId());

		return courseResponse;
	}

	@Override
	public HandleResponseDTO<RegisterCourseResponseDTO> getRegisterCourseById(Integer registerCourseId) {
		Optional<RegisterCourse> registerCourseOptional = registerCourseRepository.findById(registerCourseId);
		if (registerCourseOptional.isEmpty()) {
			return new HandleResponseDTO<>(HttpStatus.BAD_REQUEST.value(), "RegisterCourse ID cannot be found", null);
		}
		RegisterCourse registerCourse = registerCourseOptional.get();
		RegisterCourseResponseDTO responseDTO = convertToResponseDTO(registerCourse);
		return new HandleResponseDTO<>(HttpStatus.OK.value(), "Success", responseDTO);
	}

	@Override
	public HandleResponseDTO<RegisterCourseResponseDTO> createRegisterCourse(
			RegisterCourseRequestDTO registerCourseRequestDTO) {
		Optional<Student> student = studentRepository.findById(registerCourseRequestDTO.getStudentId());
		Optional<Course> course = courseRepository.findById(registerCourseRequestDTO.getCourseId());
		if (student.isEmpty()) {
			return new HandleResponseDTO<>(HttpStatus.BAD_REQUEST.value(), "Student cannot be found", null);
		}
		if (course.isEmpty()) {
			return new HandleResponseDTO<>(HttpStatus.BAD_REQUEST.value(), "Course cannot be found", null);
		}
		RegisterCourse registerCourse = convertRequestToEntity(registerCourseRequestDTO);
		registerCourse.setStatus("Đã đăng ký");
		registerCourse.setRegistrationDate(new Date());
		registerCourse.setClasses(null);
		registerCourse.setStartDate(null);
		registerCourse.setEndDate(null);
		RegisterCourse createdRegisterCourse = registerCourseRepository.save(registerCourse);
		RegisterCourseResponseDTO responseDTO = convertToResponseDTO(createdRegisterCourse);
		System.out.println(createdRegisterCourse);
		return new HandleResponseDTO<>(HttpStatus.CREATED.value(), "Create Success", responseDTO);
	}

	@Override
	public HandleResponseDTO<RegisterCourseResponseDTO> updateRegisterCourse(Integer registerCourseId,
			RegisterCourseRequestDTO registerCourseRequestDTO) {
		Optional<RegisterCourse> registerCourseOptional = registerCourseRepository.findById(registerCourseId);
		if (registerCourseOptional.isEmpty()) {
			return new HandleResponseDTO<>(HttpStatus.BAD_REQUEST.value(), "RegisterCourse ID cannot be found", null);
		}
		RegisterCourse existRegisterCourse = registerCourseOptional.get();
		existRegisterCourse.setStatus("Đã hủy");
		existRegisterCourse.setRegistrationDate(new Date());
		if (!existRegisterCourse.getRegisterCourseId().equals(registerCourseRequestDTO.getRegisterCourseId())) {
			return new HandleResponseDTO<>(HttpStatus.BAD_REQUEST.value(), "RegisterCourse ID mismatch", null);
		}
		convertRequestToEntity(registerCourseRequestDTO, existRegisterCourse);
		RegisterCourse updatedRegisterCourse = registerCourseRepository.save(existRegisterCourse);
		RegisterCourseResponseDTO responseDTO = convertToResponseDTO(updatedRegisterCourse);
		return new HandleResponseDTO<>(HttpStatus.OK.value(), "Update Success", responseDTO);
	}

	private RegisterCourseResponseDTO convertToResponseDTO(RegisterCourse registerCourse) {
		RegisterCourseResponseDTO registerCourseDTO = new RegisterCourseResponseDTO();
		BeanUtils.copyProperties(registerCourse, registerCourseDTO);
		registerCourseDTO.setRegisterCourseId(registerCourse.getRegisterCourseId());
		registerCourseDTO.setStatus(registerCourse.getStatus());
		registerCourseDTO.setRegistrationDate(registerCourse.getRegistrationDate());
		registerCourseDTO.setCourseDuration(registerCourse.getCourseDuration());
		registerCourseDTO.setCoursePrice(registerCourse.getCoursePrice());
		registerCourseDTO.setCourseDescription(registerCourse.getCourseDescription());
		registerCourseDTO.setImage(registerCourseDTO.getImage());
		registerCourseDTO.setCourseName(registerCourse.getCourse().getCourseName());
		registerCourseDTO.setStudentName(registerCourse.getStudent().getFullname());
		registerCourse.setClasses(registerCourse.getClasses());
		registerCourseDTO.setStartDate(registerCourse.getStartDate());
		registerCourseDTO.setStartDate(registerCourse.getEndDate());
		registerCourseDTO.setCourseId(registerCourse.getCourse().getCourseId());
		registerCourseDTO.setStudentId(registerCourse.getStudent().getStudentId());
		if (registerCourse.getClasses() != null) {
			registerCourseDTO.setClassId(registerCourse.getClasses().getClassId());
		}
		return registerCourseDTO;
	}

	private RegisterCourse convertRequestToEntity(RegisterCourseRequestDTO registerCourseRequestDTO) {
		RegisterCourse registerCourse = new RegisterCourse();

		Student student = studentRepository.findById(registerCourseRequestDTO.getStudentId()).orElse(null);
		Course course = courseRepository.findById(registerCourseRequestDTO.getCourseId()).orElse(null);

		BeanUtils.copyProperties(registerCourseRequestDTO, registerCourse);

		if (course != null) {
			registerCourse.setCourse(course);
			registerCourse.setCourseDuration(course.getCourseDuration());
			registerCourse.setCoursePrice(course.getCoursePrice());
			registerCourse.setImage(course.getImage());
			registerCourse.setCourseDescription(course.getCourseDescription());
		}

		if (student != null) {
			registerCourse.setStudent(student);
		}

		return registerCourse;
	}

	private void convertRequestToEntity(RegisterCourseRequestDTO registerCourseRequestDTO,
			RegisterCourse registerCourse) {
		Student student = studentRepository.findById(registerCourseRequestDTO.getStudentId()).orElse(null);
		Course course = courseRepository.findById(registerCourseRequestDTO.getCourseId()).orElse(null);
		BeanUtils.copyProperties(registerCourseRequestDTO, registerCourse);
		if (course != null) {
			registerCourse.setCourse(course);
			registerCourse.setCourseDuration(course.getCourseDuration());
			registerCourse.setCoursePrice(course.getCoursePrice());
			registerCourse.setImage(course.getImage());
			registerCourse.setCourseDescription(course.getCourseDescription());
		}
		if (student != null) {
			registerCourse.setStudent(student);
		}
	}

	@Override
	public List<RegisterCourseResponseDTO> getAllRegisterCoursesByCourse_CourseName() {
		return registerCourseRepository.getAllNotHasClass().stream()
				.collect(Collectors.toMap(registration -> registration.getCourse().getCourseId(),
						registration -> registration, (a, b) -> a))
				.values().stream().map(this::convertToResponseDTO).collect(Collectors.toList());
	}

	@Override
	@Transactional
	public List<RegisterCourseResponseDTO> updateRegisterCourseInClass(
			RegisterCourseRequestDTO registerCourseRequestDTO) {

		RegisterCourse registerCourseFound = registerCourseRepository
				.findById(registerCourseRequestDTO.getRegisterCourseId())
				.get();
		List<RegisterCourse> listRegisterCourse = registerCourseRepository
				.findByCourseId(registerCourseFound.getCourse().getCourseId());
		List<Integer> listRegisterCourseIdToAdd = registerCourseRequestDTO.getListRegisterCourseIdToAdd();
		List<Integer> listRegisterCourseIdToDelete = registerCourseRequestDTO.getListRegisterCourseIdToDelete();
		List<Point> listPoint = new ArrayList<Point>();
		Classes foundClass = classRepository.findById(registerCourseRequestDTO.getClassId()).get();
		List<EvaluationTeacher> lsEvaluationTeacher = foundClass.getEvaluationTeacher();
		List<Attendance> lsAttendance = new ArrayList<>();

		if (foundClass.getTeacher() == null
				|| registerCourseRequestDTO.getTeacherId() != foundClass.getTeacher().getTeacherId()) {
			String[] teacherMail = { registerCourseRequestDTO.getTeacherId() + "@gmail.com" };

			mailer.sendToTeacherWhenClassSeted(
					teacherMail,
					foundClass.getClassName(),
					registerCourseFound.getCourse().getCourseName());

		}
		Teacher foundTeacher = teacherRepository.findById(registerCourseRequestDTO.getTeacherId()).get();
		foundClass.setTeacher(foundTeacher);
		foundClass.setEvaluationTeacher(lsEvaluationTeacher);
		foundClass.setAttendances(lsAttendance);
		foundClass.setStatus("Đang diễn ra");
		List<RegisterCourse> filteredRegisterCoursesToAdd = new ArrayList<>();
		if (!listRegisterCourseIdToAdd.isEmpty()) {
			filteredRegisterCoursesToAdd = listRegisterCourse.stream()
					.filter(registerCourse -> listRegisterCourseIdToAdd
							.contains(registerCourse.getRegisterCourseId()))
					.collect(Collectors.toList());
			Classes classes = foundClass;
			filteredRegisterCoursesToAdd.forEach(registerCourse -> {
				registerCourse.setClasses(classes);
				Point point = new Point();
				point.setClasses(classes);
				point.setStudent(registerCourse.getStudent());
				point.setAttendancePoint((double) 0);
				point.setExercisePoint((double) 0);
				point.setAveragePoint((double) 0);
				point.setQuizzPoint((double) 0);
				listPoint.add(point);
				pointService.save(listPoint);
				registerCourseRepository.save(registerCourse);
			});
		}
		List<RegisterCourse> filteredRegisterCoursesToDelete = new ArrayList<>();
		if (!listRegisterCourseIdToDelete.isEmpty()) {
			filteredRegisterCoursesToDelete = listRegisterCourse.stream()
					.filter(registerCourse -> listRegisterCourseIdToDelete
							.contains(registerCourse.getRegisterCourseId()))
					.collect(Collectors.toList());
			filteredRegisterCoursesToDelete.forEach(registerCourse -> {
				registerCourse.setClasses(null);
			});
		}
		try {
			registerCourseRepository.saveAll(filteredRegisterCoursesToDelete);
		} catch (Exception e) {
			e.printStackTrace();
		}

		List<RegisterCourse> lsRegisterCourseAdded = registerCourseRepository.saveAll(filteredRegisterCoursesToAdd);

		String[] studentIds = lsRegisterCourseAdded.stream()
				.map(registerCourse -> String.valueOf(registerCourse.getStudent().getStudentId()))
				.toArray(String[]::new);

		for (int i = 0; i < studentIds.length; i++) {
			studentIds[i] = studentIds[i] + "@gmail.com";
		}
		// for students
		if (studentIds.length > 0) {

			mailer.sendWhenClassSeted(studentIds,
					foundClass.getClassName(),
					registerCourseFound.getCourse().getCourseName(),
					foundTeacher.getFullname(),
					foundTeacher.getTeacherId());

		}

		return lsRegisterCourseAdded
				.stream()
				.map(this::convertToResponseDTO)
				.collect(Collectors.toList());

	}

	@Override
	public Boolean getRegisterCourseHasClass(Integer classId) {
		List<RegisterCourse> listRegisterCourses = new ArrayList<>();
		listRegisterCourses = registerCourseRepository.getRegisterCourseHasClass(classId);
		return !listRegisterCourses.isEmpty();// false thì sẽ thì lớp đã tồn tại throw new
		// UnsupportedOperationException("Unimplemented method
		// 'getRegisterCourseHasClass'");
	}

	// @Override
	// public void grantPermissionsByEmails(String folderName, List<String> emails)
	// throws Exception {
	// googleDriveRepository.grantPermissionsByEmails(folderName, emails);
	// }
}
