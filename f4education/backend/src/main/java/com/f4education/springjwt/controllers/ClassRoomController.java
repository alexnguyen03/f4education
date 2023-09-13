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

import com.f4education.springjwt.interfaces.ClassRoomService;
import com.f4education.springjwt.payload.request.ClassRoomDTO;

@CrossOrigin(origins = "*", maxAge = 3600)
@RestController
@RequestMapping("/api/classroom")
public class ClassRoomController {
	
	@Autowired
	ClassRoomService classRoomService;
	
	@GetMapping
	public List<ClassRoomDTO> getAll() {
		return classRoomService.findAll();
	}
	
	@GetMapping("/{id}")
	public ClassRoomDTO findById(@PathVariable("id") Integer classroomId) {
		return classRoomService.getClassById(classroomId);
	}

	@PostMapping
	public ClassRoomDTO createSubject(@RequestBody ClassRoomDTO classRoomDTO) {
		return classRoomService.createClass(classRoomDTO);
	}

	@PutMapping("/{id}")
	public ClassRoomDTO updateSubject(@PathVariable("id") Integer classroomId, 
			@RequestBody ClassRoomDTO classRoomDTO) {
		return classRoomService.updateClass(classroomId, classRoomDTO);
	}
}
