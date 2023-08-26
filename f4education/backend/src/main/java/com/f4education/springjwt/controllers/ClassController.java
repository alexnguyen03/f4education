package com.f4education.springjwt.controllers;

import java.util.List;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.f4education.springjwt.interfaces.ClassService;
import com.f4education.springjwt.models.Classes;
import com.f4education.springjwt.payload.request.ClassDTO;
import com.f4education.springjwt.payload.request.SubjectDTO;

@CrossOrigin(origins = "*", maxAge = 3600)
@RestController
@RequestMapping("/api/classs")
public class ClassController {
	
	@Autowired
	ClassService classService;
	
	@GetMapping
	@PreAuthorize("hasRole('ADMIN')")
	public List<ClassDTO> getAll() {
		return classService.findAll();
	}
	
	@GetMapping("/{id}")
	@PreAuthorize("hasRole('ADMIN')")
	public ClassDTO findById(@PathVariable("id") Integer classId) {
		return classService.getClassById(classId);
	}

	@PostMapping
	@PreAuthorize("hasRole('ADMIN')")
	public ClassDTO createSubject(@RequestBody ClassDTO classDTO) {
		return classService.createClass(classDTO);
	}

	@PutMapping("/{id}")
	@PreAuthorize("hasRole('ADMIN')")
	public ClassDTO updateSubject(@PathVariable("id") Integer classId, 
			@RequestBody ClassDTO classDTO) {
		return classService.updateClass(classId, classDTO);
	}
}
