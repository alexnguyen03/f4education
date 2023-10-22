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

import com.f4education.springjwt.interfaces.ClassRoomHistoryService;
import com.f4education.springjwt.payload.request.ClassRoomHistoryDTO;

@CrossOrigin(origins = "*", maxAge = 3600)
@RestController
@RequestMapping("/api/classroomhistory")
public class ClassRoomHistoryController {
	
	@Autowired
	ClassRoomHistoryService classRoomHistoryService;
	
	@GetMapping
	public List<ClassRoomHistoryDTO> getAll() {
		return classRoomHistoryService.findAll();
	}
	
	@GetMapping("/{id}")
	public List<ClassRoomHistoryDTO> findByClassId(@PathVariable("id") Integer classroomId) {
		return classRoomHistoryService.getClassRoomHistoryByClassRoomId(classroomId);
	}
}
