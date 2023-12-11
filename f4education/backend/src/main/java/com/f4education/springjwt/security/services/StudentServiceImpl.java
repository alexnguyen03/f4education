package com.f4education.springjwt.security.services;

import org.springframework.beans.BeanUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.f4education.springjwt.interfaces.StudentService;
import com.f4education.springjwt.models.Student;
import com.f4education.springjwt.payload.request.StudentDTO;
import com.f4education.springjwt.repository.StudentRepository;

@Service
public class StudentServiceImpl implements StudentService {

	@Autowired
	StudentRepository studentRepository;

	@Override
	public Student findByUserId(String userId) {
		// TODO Auto-generated method stub
		throw new UnsupportedOperationException("Unimplemented method 'findByUserId'");
	}

	@Override
	public StudentDTO getStudentDTOByID(String studentId) {
		return convertEntityToDTO(studentRepository.getStudentDTOByID(studentId));
	}

	@Override
	@Transactional
	public StudentDTO updateStudent(StudentDTO studentDTO) {
		Student student = studentRepository.findById(studentDTO.getStudentId()).get();
		convertToEntity(studentDTO, student);
		studentRepository.save(student);
		return convertEntityToDTO(student);
	}

	private void convertToEntity(StudentDTO studentDTO, Student student) {
		BeanUtils.copyProperties(studentDTO, student);
	}

	private StudentDTO convertEntityToDTO(Student student) {
		return new StudentDTO(student.getStudentId(), student.getFullname(), student.getGender(), student.getAddress(),
				student.getPhone(), student.getImage());
	}

	@Override
	public Student findById(String studentId) {
		return studentRepository.findById(studentId).get();
	}
}
