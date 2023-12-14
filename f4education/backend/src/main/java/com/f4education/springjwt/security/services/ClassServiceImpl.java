package com.f4education.springjwt.security.services;

import java.util.ArrayList;
import java.util.Date;
import java.util.List;
import java.util.stream.Collectors;

import org.springframework.beans.BeanUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.f4education.springjwt.interfaces.ClassService;
import com.f4education.springjwt.models.Admin;
import com.f4education.springjwt.models.ClassHistory;
import com.f4education.springjwt.models.Classes;
import com.f4education.springjwt.models.RegisterCourse;
import com.f4education.springjwt.models.Student;
import com.f4education.springjwt.payload.request.AdminDTO;
import com.f4education.springjwt.payload.request.ClassDTO;
import com.f4education.springjwt.payload.response.ClassesByTeacherResponse;
import com.f4education.springjwt.payload.response.LearningResultResponse;
import com.f4education.springjwt.repository.AdminRepository;
import com.f4education.springjwt.repository.ClassHistoryRepository;
import com.f4education.springjwt.repository.ClassRepository;
import com.f4education.springjwt.repository.RegisterCourseRepository;

@Service
public class ClassServiceImpl implements ClassService {

	@Autowired
	ClassRepository classRepository;

	@Autowired
	ClassHistoryRepository classHistoryRepository;
	@Autowired
	RegisterCourseRepository registerCourseRepository;
	@Autowired
	private AdminRepository adminRepository;

	@Override
	public List<ClassDTO> findAll() {
		List<Classes> classes = classRepository.findAll();
		return classes.stream().map(this::convertToDto).collect(Collectors.toList());
	}

	@Override
	public ClassDTO getClassById(Integer classId) {
		Classes classes = classRepository.findById(classId).get();
		return convertToDto(classes);
	}

	@Override
	public List<ClassesByTeacherResponse> getAllClassesByTeacherId(String teacherId) {
		List<Classes> list = classRepository.findClassesByTeacherId(teacherId);
		return list.stream().map(this::convertToResponse).collect(Collectors.toList());
	}

	@Override
	public ClassDTO createClass(ClassDTO classDTO, String adminId) {
		String action = "CREATE";
		Classes classes = new Classes();
		Admin admin = adminRepository.findById(adminId).get();
		convertToEntity(classDTO, classes);
		classes.setAdmin(admin);
		classes.setStartDate(null);
		classes.setEndDate(null);
		classes.setStatus("Đang chờ");
		Classes saveClasses = classRepository.save(classes);
		this.saveClassHistory(saveClasses, action);
		return convertToDto(saveClasses);
	}

	@Override
	public ClassDTO updateClass(Integer classId, ClassDTO classDTO) {
		String action = "UPDATE";
		Classes classes = classRepository.findById(classId).get();
		convertToEntity(classDTO, classes);
		Classes updateClasses = classRepository.save(classes);
		this.saveClassHistory(updateClasses, action);
		return convertToDto(updateClasses);
	}

	private ClassDTO convertToDto(Classes classes) {
		ClassDTO classDTO = new ClassDTO();
		BeanUtils.copyProperties(classes, classDTO);
		Admin admin = adminRepository.findById(classes.getAdmin().getAdminId()).get();
		AdminDTO adminDTO = new AdminDTO();
		BeanUtils.copyProperties(admin, adminDTO);
		classDTO.setAdmin(adminDTO);
		classDTO.setRegisterCourses(classes.getRegisterCourses());
		classDTO.setTeacher(classes.getTeacher());
		classDTO.setHasSchedule(false);
		if (classes.getSchedules() != null) {
			System.out.println(classes.getSchedules().size());
			// Kiểm tra xem danh sách schedules có phần tử không
			if (!classes.getSchedules().isEmpty()) {
				classDTO.setHasSchedule(true);
			}
		}
		if (classes.getRegisterCourses() != null) {
			if (classes.getRegisterCourses().size() > 0) {
				List<Student> lStudents = classes.getRegisterCourses().stream().map(RegisterCourse::getStudent)
						.collect(Collectors.toList());
				classDTO.setStudents(lStudents);
				classDTO.setCourseName(classes.getRegisterCourses().get(0).getCourse().getCourseName());
				classDTO.setCourseId(classes.getRegisterCourses().get(0).getCourse().getCourseId());
			}
		}
		return classDTO;
	}

	public void convertToEntity(ClassDTO classDTO, Classes classes) {
		BeanUtils.copyProperties(classDTO, classes);
	}

	private void saveClassHistory(Classes classes, String action) {
		ClassHistory classHistory = new ClassHistory();
		BeanUtils.copyProperties(classes, classHistory);
		classHistory.setClasses(classes);
		classHistory.setModifyDate(new Date());
		classHistory.setAction(action);
		classHistory.setAdminId(classes.getAdmin().getAdminId());
		classHistoryRepository.save(classHistory);
	}

	private ClassesByTeacherResponse convertToResponse(Classes classes) {
		ClassesByTeacherResponse classResponse = new ClassesByTeacherResponse();

		BeanUtils.copyProperties(classes, classResponse);

		// Get list Student
		List<RegisterCourse> lstRegisterCourse = classes.getRegisterCourses();
		List<Student> listStudent = new ArrayList<>();

		for (RegisterCourse ct : lstRegisterCourse) {
			if (ct.getStudent() != null) {
				listStudent.add(ct.getStudent());
			}
		}

		// Get list course
		List<String> courseName = new ArrayList<>();
		for (RegisterCourse ct : lstRegisterCourse) {
			if (ct != null) {
				if (ct.getStatus().equalsIgnoreCase("Đã đăng ký")) {
					courseName.add(ct.getCourse().getCourseName());
				}
			}
		}

		classResponse.setClasses(classes);
		classResponse.setCourseName(courseName);
		classResponse.setStudents(listStudent);

		return classResponse;
	}

	@Override
	public List<ClassDTO> findAllActiveClasses() {
		List<Classes> list = classRepository.findAll();
		List<Classes> filteredList = list.stream().filter(obj -> {
			if (obj instanceof Classes) {
				Classes item = obj;
				return item.getTeacher() != null;
			}

			return false;
		}).collect(Collectors.toList());
		return filteredList.stream().map(this::convertToDto).collect(Collectors.toList());
	}

	@Override
	public List<Classes> getClassByStudentId(String studentId) {
		List<RegisterCourse> registerCourses = registerCourseRepository
				.findRegisterCoursesByStudent_StudentId(studentId);

		List<Classes> classesList = registerCourses.stream().map(RegisterCourse::getClasses)
				.collect(Collectors.toList());
		return classesList;
	}

	@Override
	public Classes findById(Integer classId) {
		return classRepository.findById(classId).get();
	}

	@Override
	public Classes saveOneClass(Classes classes) {
		return classRepository.save(classes);
	}

	@Override
	public List<LearningResultResponse> getAllClassLearningResult(String studentId) {
		List<Classes> classes = classRepository.findClassByStudentId(studentId);
		return classes.stream().map(this::convertToResponseResultOutCome).collect(Collectors.toList());
	}

	private LearningResultResponse convertToResponseResultOutCome(Classes classes) {
		LearningResultResponse classResponse = new LearningResultResponse();

		BeanUtils.copyProperties(classes, classResponse);

		// Get list Student
		List<RegisterCourse> registerCourses = classes.getRegisterCourses();

		classResponse.setClassName(classes.getClassName());
		classResponse.setMaximumQuantity(classes.getMaximumQuantity());
		classResponse.setStatus(classes.getStatus());
		classResponse.setStartDate(classes.getStartDate());
		classResponse.setEndDate(classes.getEndDate());
		classResponse.setTeacherName(classes.getTeacher().getFullname());
		classResponse.setTeacherImage(classes.getTeacher().getImage());

		for (RegisterCourse rg : registerCourses) {
			if (rg.getClasses().getClassId().equals(classes.getClassId())) {
				classResponse.setCourseDuration(rg.getCourseDuration());
				classResponse.setCourseName(rg.getCourse().getCourseName());
			}
		}

		return classResponse;
	}
}
