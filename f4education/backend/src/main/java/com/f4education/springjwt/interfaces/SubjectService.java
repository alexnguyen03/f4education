package com.f4education.springjwt.interfaces;

import java.util.List;

import org.springframework.stereotype.Service;

import com.f4education.springjwt.payload.request.SubjectDTO;
import com.f4education.springjwt.payload.request.SubjectRequest;

@Service
public interface SubjectService {
	List<SubjectDTO> getAllSubjects();

	SubjectDTO getSubjectById(Integer subjectId);

	SubjectRequest createSubject(SubjectRequest subjectRequest);

	SubjectRequest updateSubject(Integer subjectId, SubjectRequest subjectRequest);
}
