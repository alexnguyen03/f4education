package com.f4education.springjwt.controllers;

import com.f4education.springjwt.payload.request.SubjectDTO;
import com.f4education.springjwt.security.services.SubjectServiceImpl;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@CrossOrigin("*")
@RestController
@RequestMapping("/api/subjects")
public class SubjectController {
	@Autowired
	SubjectServiceImpl subjectService;

	@GetMapping
	@PreAuthorize("hasRole('ADMIN')")
	public List<SubjectDTO> findAll() {
		return subjectService.getAllSubjects();
	}

	@GetMapping("/{id}")

	@PreAuthorize("hasRole('ADMIN')")
	public SubjectDTO findById(@PathVariable("id") Integer subjectId) {
		return subjectService.getSubjectById(subjectId);
	}

	@PostMapping
	public SubjectDTO createSubject(@RequestBody SubjectDTO subjectDTO) {
		return subjectService.createSubject(subjectDTO);
	}

	@PutMapping("/{id}")

	@PreAuthorize("hasRole('ADMIN')")
	public SubjectDTO updateSubject(@PathVariable("id") Integer subjectId,
									@RequestBody SubjectDTO subjectDTO) {
		return subjectService.updateSubject(subjectId, subjectDTO);
	}

}
