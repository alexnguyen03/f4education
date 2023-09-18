package com.f4education.springjwt.security.services;

import java.util.Date;
import java.util.List;
import java.util.stream.Collectors;

import org.springframework.beans.BeanUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.f4education.springjwt.interfaces.SubjectHistoryService;
import com.f4education.springjwt.models.Admin;
import com.f4education.springjwt.models.Subject;
import com.f4education.springjwt.models.SubjectHistory;
import com.f4education.springjwt.payload.request.SubjectHistoryDTO;
import com.f4education.springjwt.payload.request.SubjectHistoryRequest;
import com.f4education.springjwt.repository.AdminRepository;
import com.f4education.springjwt.repository.SubjectHistoryRepository;
import com.f4education.springjwt.repository.SubjectRepository;

@Service
public class SubjectHistoryServiceImpl implements SubjectHistoryService {
	@Autowired
	private SubjectHistoryRepository subjectHistoryRepository;

	@Autowired
	private AdminRepository adminRepository;

	@Autowired
	private SubjectRepository subjectRepository;

	@Override
	public List<SubjectHistoryDTO> getAllSubjectsHistory() {
		List<SubjectHistory> subjectHistory = subjectHistoryRepository.findAll();
		return subjectHistory.stream().map(this::convertToDto).collect(Collectors.toList());
	}

	@Override
	public SubjectHistoryDTO getSubjectHistoryById(Integer subjectHistoryId) {
		SubjectHistory subject = subjectHistoryRepository.findById(subjectHistoryId).get();
		return convertToDto(subject);
	}

	@Override
	public List<SubjectHistoryDTO> findBySubjectId(Integer subjectId) {
		List<SubjectHistory> subjectHistory = subjectHistoryRepository.findBySubjectId(subjectId);
		return subjectHistory.stream().map(this::convertToDto).collect(Collectors.toList());
	}

	@Override
	public SubjectHistoryRequest createSubjectHistory(SubjectHistoryRequest SubjectHistoryDTO) {
		SubjectHistory subjectHistory = new SubjectHistory();
		Admin admin = adminRepository.findById(SubjectHistoryDTO.getAdminId()).get();
		Subject subject = new Subject();

		if (SubjectHistoryDTO.getSubjectId() == null) {
			Integer subjectId = subjectRepository.getMaxSubjectId();
			System.out.println(subjectId);
			subject = subjectRepository.findById(subjectId).get();
		} else {
			subject = subjectRepository.findById(SubjectHistoryDTO.getSubjectId()).get();
		}

		subjectHistory.setAdmin(admin);
		subjectHistory.setSubject(subject);
		subjectHistory.setModifyDate(new Date());

		convertRequestToEntity(SubjectHistoryDTO, subjectHistory);

		SubjectHistory savedSubject = subjectHistoryRepository.save(subjectHistory);
		return convertToRequest(savedSubject);
	}

	@Override
	public SubjectHistoryRequest updateSubjectHistory(Integer subjectHistoryId,
			SubjectHistoryRequest SubjectHistoryDTO) {
		SubjectHistory exitingSubjectHistory = subjectHistoryRepository.findById(subjectHistoryId).get();

		convertRequestToEntity(SubjectHistoryDTO, exitingSubjectHistory);

		SubjectHistory updateSubject = subjectHistoryRepository.save(exitingSubjectHistory);
		return convertToRequest(updateSubject);
	}

	private SubjectHistoryDTO convertToDto(SubjectHistory subjectHistory) {
		SubjectHistoryDTO subjectHistoryDTO = new SubjectHistoryDTO();
		String adminName = subjectHistory.getAdmin().getFullname();
		Integer subjectId = subjectHistory.getSubject().getSubjectId();

		BeanUtils.copyProperties(subjectHistory, subjectHistoryDTO);

		subjectHistoryDTO.setAdminName(adminName);
		subjectHistoryDTO.setSubjectId(subjectId);

		return subjectHistoryDTO;
	}

	private SubjectHistoryRequest convertToRequest(SubjectHistory subjectHistory) {
		SubjectHistoryRequest subjectHistoryDTO = new SubjectHistoryRequest();
		String adminId = subjectHistory.getAdmin().getAdminId();
		Integer subjectId = subjectHistory.getSubject().getSubjectId();

		BeanUtils.copyProperties(subjectHistory, subjectHistoryDTO);

		subjectHistoryDTO.setAdminId(adminId);
		subjectHistoryDTO.setSubjectId(subjectId);

		return subjectHistoryDTO;
	}

	private void convertRequestToEntity(SubjectHistoryRequest subjectHistoryDTO, SubjectHistory subjectHistory) {
		Admin admin = adminRepository.findById(subjectHistoryDTO.getAdminId()).get();

		BeanUtils.copyProperties(subjectHistoryDTO, subjectHistory);

		subjectHistory.setAdmin(admin);
	}

}
