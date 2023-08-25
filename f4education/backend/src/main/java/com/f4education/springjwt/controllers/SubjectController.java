package com.f4education.springjwt.controllers;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.f4education.springjwt.payload.request.SubjectDTO;
import com.f4education.springjwt.security.services.SubjectServiceImpl;

@CrossOrigin("*")
@RestController
@RequestMapping("/api/subjects")
public class SubjectController {
	@Autowired
	SubjectServiceImpl subjectService;

	@GetMapping
	public List<SubjectDTO> findAll() {
		return subjectService.getAllSubjects();
	}

	@GetMapping("/{id}")
	public SubjectDTO findById(@PathVariable("id") Integer subjectId) {
		return subjectService.getSubjectById(subjectId);
	}

	@PostMapping
	public SubjectDTO createSubject(@RequestBody SubjectDTO subjectDTO) {
		return subjectService.createSubject(subjectDTO);
	}

	@PutMapping("/{id}")
	public SubjectDTO updateSubject(@PathVariable("id") Integer subjectId, 
			@RequestBody SubjectDTO subjectDTO) {
		return subjectService.updateSubject(subjectId, subjectDTO);
	}

}
