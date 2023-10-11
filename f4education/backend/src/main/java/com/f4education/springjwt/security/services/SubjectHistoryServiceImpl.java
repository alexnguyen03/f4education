package com.f4education.springjwt.security.services;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

import org.springframework.beans.BeanUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.f4education.springjwt.interfaces.SubjectHistoryService;
import com.f4education.springjwt.models.SubjectHistory;
import com.f4education.springjwt.payload.request.SubjectHistoryDTO;
import com.f4education.springjwt.repository.SubjectHistoryRepository;

@Service
public class SubjectHistoryServiceImpl implements SubjectHistoryService {
	@Autowired
	private SubjectHistoryRepository subjectHistoryRepository;

	@Override
	public List<SubjectHistoryDTO> getAllSubjectsHistory() {
		List<SubjectHistory> subjectHistory = subjectHistoryRepository.findAll();
		return subjectHistory.stream().map(this::convertToReponseDTO).collect(Collectors.toList());
	}

	@Override
	public SubjectHistoryDTO getSubjectHistoryById(Integer subjectHistoryId) {
		Optional<SubjectHistory> subjectOptional = subjectHistoryRepository.findById(subjectHistoryId);
		if (subjectOptional.isPresent()) {
			SubjectHistory subjectHistory = subjectOptional.get();
			return this.convertToReponseDTO(subjectHistory);
		}
		return null;
	}

	private SubjectHistoryDTO convertToReponseDTO(SubjectHistory subjectHistory) {
		SubjectHistoryDTO subjectHistoryDTO = new SubjectHistoryDTO();
		String adminId = subjectHistory.getAdmin().getAdminId();
		Integer subjectId = subjectHistory.getSubject().getSubjectId();

		BeanUtils.copyProperties(subjectHistory, subjectHistoryDTO);

		subjectHistoryDTO.setModifyDate(subjectHistory.getModifyDate());
		subjectHistoryDTO.setAdminId(adminId);
		subjectHistoryDTO.setSubjectId(subjectId);

		return subjectHistoryDTO;
	}
}
