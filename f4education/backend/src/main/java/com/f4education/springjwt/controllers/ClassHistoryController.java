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

import com.f4education.springjwt.interfaces.ClassHistoryService;
import com.f4education.springjwt.interfaces.ClassService;
import com.f4education.springjwt.models.Classes;
import com.f4education.springjwt.payload.request.ClassDTO;
import com.f4education.springjwt.payload.request.ClassHistoryDTO;
import com.f4education.springjwt.payload.request.SubjectDTO;

@CrossOrigin(origins = "*", maxAge = 3600)
@RestController
@RequestMapping("/api/classhistory")
public class ClassHistoryController {
	
	@Autowired
	ClassHistoryService classHistoryService;
	
	@GetMapping
	public List<ClassHistoryDTO> getAll() {
		return classHistoryService.findAll();
	}
	
	@GetMapping("/{id}")
	public List<ClassHistoryDTO> findByClassId(@PathVariable("id") Integer classId) {
		return classHistoryService.getClassHistoryByClassId(classId);
	}
}
