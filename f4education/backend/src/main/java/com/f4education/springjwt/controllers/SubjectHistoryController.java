package com.f4education.springjwt.controllers;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.f4education.springjwt.payload.request.SubjectHistoryDTO;
import com.f4education.springjwt.security.services.SubjectHistoryServiceImpl;

@CrossOrigin("*")
@RestController
@RequestMapping("/api/subject-history")
public class SubjectHistoryController {
	@Autowired
	SubjectHistoryServiceImpl subjectHistoryService;

	@GetMapping
//	@PreAuthorize("hasRole('ADMIN')")
	public ResponseEntity<?> findAll() {
		List<SubjectHistoryDTO> lst = subjectHistoryService.getAllSubjectsHistory();
		return ResponseEntity.ok(lst);
	}

	@GetMapping("/{id}")
//	@PreAuthorize("hasRole('ADMIN')")
	public ResponseEntity<?> findById(@PathVariable("id") Integer subjectHistoryId) {
		if (subjectHistoryId == null) {
			return ResponseEntity.badRequest().build();
		} else {
			SubjectHistoryDTO subjectHistory = subjectHistoryService.getSubjectHistoryById(subjectHistoryId);

			if (subjectHistory == null) {
				return ResponseEntity.noContent().build();
			}

			return ResponseEntity.ok(subjectHistory);
		}
	}
}
