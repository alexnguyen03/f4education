package com.f4education.springjwt.controllers;

import java.net.URI;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.servlet.support.ServletUriComponentsBuilder;

import com.f4education.springjwt.payload.request.SubjectDTO;
import com.f4education.springjwt.security.services.SubjectServiceImpl;

@CrossOrigin("*")
@RestController
@RequestMapping("/api/subjects")
public class SubjectController {
	@Autowired
	SubjectServiceImpl subjectService;

	@GetMapping
//	@PreAuthorize("hasRole('ADMIN')")
	public ResponseEntity<?> findAll() {
		List<SubjectDTO> lst = subjectService.getAllSubjects();
		return ResponseEntity.ok(lst);
	}

	@GetMapping("/{id}")
//	@PreAuthorize("hasRole('ADMIN')")
	public ResponseEntity<?> findById(@PathVariable("id") Integer subjectId) {
		if (subjectId == null) {
			return ResponseEntity.badRequest().build();
		} else {
			SubjectDTO subject = subjectService.getSubjectById(subjectId);

			if (subject == null) {
				return ResponseEntity.noContent().build();
			}

			return ResponseEntity.ok(subject);
		}
	}

	@PostMapping
	public ResponseEntity<?> createSubject(@RequestBody SubjectDTO subjectRequest) {
		if (subjectRequest == null) {
			return ResponseEntity.badRequest().body("Invalid request data");
		}

		SubjectDTO subject = subjectService.createSubject(subjectRequest);

		if (subject == null) {
			return ResponseEntity.badRequest().build();
		}

		// create URI
		URI uri = ServletUriComponentsBuilder.fromCurrentRequest().path("/{subjectId}")
				.buildAndExpand(subject.getSubjectId()).toUri();

		return ResponseEntity.created(uri).body(subject);
	}

	@PutMapping("/{id}")
//	@PreAuthorize("hasRole('ADMIN')")
	public ResponseEntity<?> updateSubject(@PathVariable("id") Integer subjectId,
			@RequestBody SubjectDTO subjectRequest) {
		if (subjectId == null) {
			return ResponseEntity.badRequest().body("message: where my id? u kd m?");
		} else {
			SubjectDTO subject = subjectService.updateSubject(subjectId, subjectRequest);

			if (subject == null) {
				Map<String, String> response = new HashMap<>();
				response.put("status", "" + HttpStatus.NO_CONTENT);
				response.put("message", "it NULL Subject bro, tf u giving me bro?");
				return new ResponseEntity<>(response, HttpStatus.NO_CONTENT);
			}

			return ResponseEntity.ok(subject);
		}
	}

}
