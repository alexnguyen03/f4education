package com.f4education.springjwt.security.services;

import java.util.Date;
import java.util.List;
import java.util.stream.Collectors;

import org.springframework.beans.BeanUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.f4education.springjwt.interfaces.AdminService;
import com.f4education.springjwt.interfaces.SubjectService;
import com.f4education.springjwt.models.Admin;
import com.f4education.springjwt.models.Subject;
import com.f4education.springjwt.payload.request.RequestSubjectDTO;
import com.f4education.springjwt.payload.request.SubjectDTO;
import com.f4education.springjwt.repository.SubjectRepository;

@Service
public class SubjectServiceImpl implements SubjectService {
	@Autowired
	private SubjectRepository subjectRepository;

	@Autowired
	private AdminService adminService;

	@Override
	public List<SubjectDTO> getAllSubjects() {
		List<Subject> subjects = subjectRepository.findAll();
		return subjects.stream().map(this::convertToDto).collect(Collectors.toList());
	}

	@Override
	public SubjectDTO getSubjectById(Integer subjectId) {
		Subject subject = subjectRepository.findById(subjectId).get();
		return convertToDto(subject);
	}

	@Override
	public RequestSubjectDTO createSubject(RequestSubjectDTO requestSubjectDTO) {
		Subject subject = new Subject();
		Admin admin = adminService.getAdminById(requestSubjectDTO.getAdminId());
		subject.setAdmin(admin);
		subject.setCreateDate(new Date());
//		System.out.println(admin);
		convertToEntityRequest(requestSubjectDTO, subject);
		Subject savedSubject = subjectRepository.save(subject);
		return convertToDtoRequest(savedSubject);
	}

	@Override
	public SubjectDTO updateSubject(Integer subjectId, SubjectDTO subjectDTO) {
		Subject exitingSubject = subjectRepository.findById(subjectId).get();
		convertToEntity(subjectDTO, exitingSubject);
		Subject updateSubject = subjectRepository.save(exitingSubject);
		return convertToDto(updateSubject);
	}

	private SubjectDTO convertToDto(Subject subject) {
		SubjectDTO subjectDTO = new SubjectDTO();
		String adminId = subject.getAdmin().getFullname();
		subjectDTO.setAdminName(adminId);
		BeanUtils.copyProperties(subject, subjectDTO);
		return subjectDTO;
	}

	private RequestSubjectDTO convertToDtoRequest(Subject subject) {
		RequestSubjectDTO requestSubjectDTO = new RequestSubjectDTO();
		String adminId = subject.getAdmin().getAdminId();
		requestSubjectDTO.setAdminId(adminId);
		BeanUtils.copyProperties(subject, requestSubjectDTO);
		return requestSubjectDTO;
	}

	public SubjectDTO mapSubjectToDTO(Subject subject) {
		String adminId = subject.getAdmin().getAdminId();
		return new SubjectDTO(subject.getSubjectId(), subject.getSubjectName(), adminId, subject.getCreateDate());
	}

	private void convertToEntity(SubjectDTO subjectDTO, Subject subject) {
		BeanUtils.copyProperties(subjectDTO, subject);
	}

	private void convertToEntityRequest(RequestSubjectDTO subjectDTO, Subject subject) {
		BeanUtils.copyProperties(subjectDTO, subject);
	}

}
