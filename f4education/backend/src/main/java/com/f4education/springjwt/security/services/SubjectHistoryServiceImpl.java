package com.f4education.springjwt.security.services;

import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.List;
import java.util.stream.Collectors;

import org.springframework.beans.BeanUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.f4education.springjwt.interfaces.AdminService;
import com.f4education.springjwt.interfaces.SubjectHistoryService;
import com.f4education.springjwt.models.Admin;
import com.f4education.springjwt.models.Subject;
import com.f4education.springjwt.models.SubjectHistory;
import com.f4education.springjwt.payload.request.SubjectHistoryDTO;
import com.f4education.springjwt.repository.SubjectHistoryRepository;
import com.f4education.springjwt.repository.SubjectRepository;

@Service
public class SubjectHistoryServiceImpl implements SubjectHistoryService {
	@Autowired
	private SubjectHistoryRepository subjectHistoryRepository;

	@Autowired
	private AdminService adminService;

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
	public SubjectHistoryDTO createSubjectHistory(SubjectHistoryDTO SubjectHistoryDTO) {
		SubjectHistory subjectHistory = new SubjectHistory();
		Admin admin = adminService.getAdminById(SubjectHistoryDTO.getAdminId());
		Subject subject = subjectRepository.findById(SubjectHistoryDTO.getSubjectId()).get();
		subjectHistory.setAdmin(admin);
		subjectHistory.setSubject(subject);

		String dateTimeString = SubjectHistoryDTO.getModifyDate();
		DateTimeFormatter formatter = DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm:ss");
		LocalDateTime localDateTime = LocalDateTime.parse(dateTimeString, formatter);

		subjectHistory.setModifyDate(localDateTime);

		convertToEntity(SubjectHistoryDTO, subjectHistory);
		SubjectHistory savedSubject = subjectHistoryRepository.save(subjectHistory);
		return convertToDto(savedSubject);
	}

	@Override
	public SubjectHistoryDTO updateSubjectHistory(Integer subjectHistoryId, SubjectHistoryDTO SubjectHistoryDTO) {
		SubjectHistory exitingSubjectHistory = subjectHistoryRepository.findById(subjectHistoryId).get();
		convertToEntity(SubjectHistoryDTO, exitingSubjectHistory);
		SubjectHistory updateSubject = subjectHistoryRepository.save(exitingSubjectHistory);
		return convertToDto(updateSubject);
	}

	private SubjectHistoryDTO convertToDto(SubjectHistory subjectHistory) {
		SubjectHistoryDTO subjectHistoryDTO = new SubjectHistoryDTO();
		String adminId = subjectHistory.getAdmin().getAdminId();
		Integer subjectId = subjectHistory.getSubject().getSubjectId();

		LocalDateTime localDateTime = subjectHistory.getModifyDate();
		DateTimeFormatter formatter = DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm:ss");
		String modifyDate = localDateTime.format(formatter);
		
		subjectHistoryDTO.setAdminId(adminId);
		subjectHistoryDTO.setSubjectId(subjectId);
		subjectHistoryDTO.setModifyDate(modifyDate);
		
		BeanUtils.copyProperties(subjectHistory, subjectHistoryDTO);
		return subjectHistoryDTO;
	}

//	public SubjectHistoryDTO mapSubjectToDTO(SubjectHistory subjectHistory) {
//		String adminId = subjectHistory.getAdmin().getAdminId();
//		return new SubjectHistoryDTO(subjectHistory.getSubjectHistoryId(), subjectHistory.getAction(),
//				subjectHistory.getModifyDate(), adminId, subjectHistory.getSubject());
//	}

	private void convertToEntity(SubjectHistoryDTO SubjectHistoryDTO, SubjectHistory subjectHistory) {
		BeanUtils.copyProperties(SubjectHistoryDTO, subjectHistory);
	}
}
