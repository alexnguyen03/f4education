package com.f4education.springjwt.interfaces;

import java.util.List;

import org.springframework.stereotype.Service;

import com.f4education.springjwt.payload.request.RequestSubjectDTO;
import com.f4education.springjwt.payload.request.SubjectDTO;

@Service
public interface SubjectService {
	List<SubjectDTO> getAllSubjects();

	SubjectDTO getSubjectById(Integer subjectId);

	RequestSubjectDTO createSubject(RequestSubjectDTO subjectDTO);

	SubjectDTO updateSubject(Integer subjectId, SubjectDTO subjectDTO);
}
