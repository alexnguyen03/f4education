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

import com.f4education.springjwt.payload.request.SubjectHistoryDTO;
import com.f4education.springjwt.payload.request.SubjectHistoryRequest;
import com.f4education.springjwt.security.services.SubjectHistoryServiceImpl;

@CrossOrigin("*")
@RestController
@RequestMapping("/api/subjectHistory")
public class SubjectHistoryController {
	@Autowired
	SubjectHistoryServiceImpl subjectHistoryService;

	@GetMapping
//	@PreAuthorize("hasRole('ADMIN')")
	public List<SubjectHistoryDTO> findAll() {
		return subjectHistoryService.getAllSubjectsHistory();
	}

	@GetMapping("/{id}")
//	@PreAuthorize("hasRole('ADMIN')")
	public SubjectHistoryDTO findById(@PathVariable("id") Integer subjectHistoryId) {
		return subjectHistoryService.getSubjectHistoryById(subjectHistoryId);
	}

	@GetMapping("/subjectid/{id}")
	public List<SubjectHistoryDTO> findBySubjectId(@PathVariable("id") Integer subjectId) {
		return subjectHistoryService.findBySubjectId(subjectId);
	}

	@PostMapping
	public SubjectHistoryRequest createSubjectHistory(@RequestBody SubjectHistoryRequest SubjectHistoryDTO) {
		return subjectHistoryService.createSubjectHistory(SubjectHistoryDTO);
	}

	@PutMapping("/{id}")
//	@PreAuthorize("hasRole('ADMIN')")
	public SubjectHistoryDTO updateSubjectHistory(@PathVariable("id") Integer subjectHistoryId,
			@RequestBody SubjectHistoryDTO SubjectHistoryDTO) {
		return subjectHistoryService.updateSubjectHistory(subjectHistoryId, SubjectHistoryDTO);
	}
}
