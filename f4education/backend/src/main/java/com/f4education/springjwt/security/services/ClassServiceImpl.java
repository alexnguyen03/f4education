package com.f4education.springjwt.security.services;

import java.util.Date;
import java.util.List;
import java.util.stream.Collectors;

import org.springframework.beans.BeanUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import com.f4education.springjwt.interfaces.ClassService;
import com.f4education.springjwt.models.Admin;
import com.f4education.springjwt.models.ClassHistory;
import com.f4education.springjwt.models.Classes;
import com.f4education.springjwt.models.RegisterCourse;
import com.f4education.springjwt.models.Student;
import com.f4education.springjwt.payload.request.AdminDTO;
import com.f4education.springjwt.payload.request.ClassDTO;
import com.f4education.springjwt.payload.request.RegisterCourseRequestDTO;
import com.f4education.springjwt.repository.AdminRepository;
import com.f4education.springjwt.repository.ClassHistoryRepository;
import com.f4education.springjwt.repository.ClassRepository;

@Service
public class ClassServiceImpl implements ClassService {

	@Autowired
	ClassRepository classRepository;

	@Autowired
	ClassHistoryRepository classHistoryRepository;

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
	public ClassDTO createClass(ClassDTO classDTO) {
		String action = "CREATE";
		Classes classes = new Classes();
		Admin admin = adminRepository.findById("namnguyen").get();
		convertToEntity(classDTO, classes);
		classes.setAdmin(admin);
		classes.setStartDate(new Date());
		classes.setEndDate(null);
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
		if (classes.getRegisterCourses().size() > 0) {
			classDTO.setCourseId(classes.getRegisterCourses().get(0).getCourse().getCourseId());
		}
		return classDTO;
	}

	private void convertToEntity(ClassDTO classDTO, Classes classes) {
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
}
