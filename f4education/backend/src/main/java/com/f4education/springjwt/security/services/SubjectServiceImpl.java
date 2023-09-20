package com.f4education.springjwt.security.services;

import java.util.Date;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

import org.springframework.beans.BeanUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.f4education.springjwt.interfaces.SubjectService;
import com.f4education.springjwt.models.Admin;
import com.f4education.springjwt.models.Course;
import com.f4education.springjwt.models.Subject;
import com.f4education.springjwt.payload.request.SubjectDTO;
import com.f4education.springjwt.payload.request.SubjectRequest;
import com.f4education.springjwt.repository.AdminRepository;
import com.f4education.springjwt.repository.CourseRepository;
import com.f4education.springjwt.repository.SubjectRepository;

@Service
public class SubjectServiceImpl implements SubjectService {
	@Autowired
	private SubjectRepository subjectRepository;

	@Autowired
	private AdminRepository adminRepository;

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
	public SubjectRequest createSubject(SubjectRequest subjectRequest) {
		Subject subject = this.convertRequestToEntity(subjectRequest);
		
		subject.setCreateDate(new Date());
		
		Subject savedSubject = subjectRepository.save(subject);
		return convertToRequest(savedSubject);
	}

	@Override
	public SubjectRequest updateSubject(Integer subjectId, SubjectRequest subjectRequest) {
		Optional<Subject> exitingSubject = subjectRepository.findById(subjectId);

		if (!exitingSubject.isPresent()) {
			return null;
		}

		Subject subject = this.convertRequestToEntity(subjectRequest);

		Subject updateSubject = subjectRepository.save(subject);
		return convertToRequest(updateSubject);
	}

	private SubjectDTO convertToDto(Subject subject) {
		SubjectDTO subjectDTO = new SubjectDTO();
		
		String adminName = subject.getAdmin().getFullname();
		subjectDTO.setAdminName(adminName);

		BeanUtils.copyProperties(subject, subjectDTO);

		return subjectDTO;
	}

	private SubjectRequest convertToRequest(Subject subject) {
		SubjectRequest SubjectRequest = new SubjectRequest();

		String adminId = subject.getAdmin().getAdminId();
		SubjectRequest.setAdminId(adminId);

		BeanUtils.copyProperties(subject, SubjectRequest);
		return SubjectRequest;
	}

	private Subject convertRequestToEntity(SubjectRequest subjectRequest) {
		Subject subject = new Subject();

		Admin admin = adminRepository.findById(subjectRequest.getAdminId()).get();

		BeanUtils.copyProperties(subjectRequest, subject);

		subject.setAdmin(admin);

		return subject;
	}
}
