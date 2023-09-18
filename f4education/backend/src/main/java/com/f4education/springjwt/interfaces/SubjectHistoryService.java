package com.f4education.springjwt.interfaces;

import java.util.List;

import org.springframework.stereotype.Service;

import com.f4education.springjwt.payload.request.SubjectHistoryDTO;
import com.f4education.springjwt.payload.request.SubjectHistoryRequest;

@Service
public interface SubjectHistoryService {
	List<SubjectHistoryDTO> getAllSubjectsHistory();

	SubjectHistoryDTO getSubjectHistoryById(Integer subjectHistoryId);

	SubjectHistoryRequest createSubjectHistory(SubjectHistoryRequest SubjectHistoryDTO);

	SubjectHistoryRequest updateSubjectHistory(Integer subjectHistoryId, SubjectHistoryRequest SubjectHistoryDTO);

	List<SubjectHistoryDTO> findBySubjectId(Integer subjectId);
}
