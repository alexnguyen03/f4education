package com.f4education.springjwt.interfaces;

import java.util.List;

import org.springframework.stereotype.Service;

import com.f4education.springjwt.payload.request.SubjectHistoryDTO;

@Service
public interface SubjectHistoryService {
	List<SubjectHistoryDTO> getAllSubjectsHistory();

	SubjectHistoryDTO getSubjectHistoryById(Integer subjectHistoryId);

	SubjectHistoryDTO createSubjectHistory(SubjectHistoryDTO SubjectHistoryDTO);

	SubjectHistoryDTO updateSubjectHistory(Integer subjectHistoryId, SubjectHistoryDTO SubjectHistoryDTO);
}