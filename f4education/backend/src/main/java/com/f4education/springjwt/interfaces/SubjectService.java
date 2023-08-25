package com.f4education.springjwt.interfaces;

import java.util.List;
import java.util.Optional;

import org.springframework.stereotype.Service;

import com.f4education.springjwt.models.Subject;
import com.f4education.springjwt.payload.request.SubjectDTO;

@Service
public interface SubjectService {
	List<SubjectDTO> getAllSubjects();

	SubjectDTO getSubjectById(Integer subjectId);

	SubjectDTO createSubject(SubjectDTO subjectDTO);

	SubjectDTO updateSubject(Integer subjectId, SubjectDTO subjectDTO);
}
