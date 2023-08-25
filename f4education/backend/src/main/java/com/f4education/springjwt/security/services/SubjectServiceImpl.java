package com.f4education.springjwt.security.services;

import java.util.List;
import java.util.stream.Collectors;

import org.springframework.beans.BeanUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.f4education.springjwt.interfaces.SubjectService;
import com.f4education.springjwt.models.Subject;
import com.f4education.springjwt.models.User;
import com.f4education.springjwt.payload.request.SubjectDTO;
import com.f4education.springjwt.repository.SubjectRepository;

@Service
public class SubjectServiceImpl implements SubjectService {
	@Autowired
	private SubjectRepository subjectRepository;

	@Override
	public List<SubjectDTO> getAllSubjects() {
		User u = new User();
		u.setId((long) 1);
		u.setUsername("johnnguyen");
		u.setPassword("123456789");

		List<Subject> subjects = subjectRepository.findAll();
		return subjects.stream().map(this::convertToDto).collect(Collectors.toList());
	}

	@SuppressWarnings("deprecation")
	@Override
	public SubjectDTO getSubjectById(Integer subjectId) {
		Subject subject = subjectRepository.getById(subjectId);
		return convertToDto(subject);
	}

	@Override
	public SubjectDTO createSubject(SubjectDTO subjectDTO) {
		Subject subject = new Subject();
		convertToEntity(subjectDTO, subject);
		Subject savedSubject = subjectRepository.save(subject);
		return convertToDto(savedSubject);
	}

	@Override
	public SubjectDTO updateSubject(Integer subjectId, SubjectDTO subjectDTO) {
		Subject exitingSubject = subjectRepository.getById(subjectId);
		convertToEntity(subjectDTO, exitingSubject);
		Subject updateSubject = subjectRepository.save(exitingSubject);
		return convertToDto(updateSubject);
	}

	private SubjectDTO convertToDto(Subject subject) {
		SubjectDTO subjectDTO = new SubjectDTO();
		BeanUtils.copyProperties(subject, subjectDTO);
		return subjectDTO;
	}

	private void convertToEntity(SubjectDTO subjectDTO, Subject subject) {
		BeanUtils.copyProperties(subjectDTO, subject);
	}

	// private SubjectDTO convertToDto(Subject subject) {
	// SubjectDTO subjectDTO = new SubjectDTO();
	// subjectDTO.setSubjectId(subject.getSubjectId());
	// subjectDTO.setSubjectName(subject.getSubjectName());
	// subjectDTO.setAdminId(subject.getAdminId());
	// // Set other properties if any
	// return subjectDTO;
	// }

}
