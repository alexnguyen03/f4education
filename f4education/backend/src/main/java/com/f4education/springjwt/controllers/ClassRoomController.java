package com.f4education.springjwt.controllers;

import java.util.List;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
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
	public ResponseEntity<?> getAll() {
		List<ClassRoomDTO> list = classRoomService.findAll();
		return ResponseEntity.ok(list);
	}
	
	@GetMapping("/{id}")
	public ResponseEntity<?> findById(@PathVariable("id") Integer classroomId) {
		ClassRoomDTO findByIdClassRoom = classRoomService.getClassById(classroomId);
		return ResponseEntity.ok(findByIdClassRoom);
	}

	@PostMapping
	public ResponseEntity<?> createSubject(@RequestBody ClassRoomDTO classRoomDTO) {
		ClassRoomDTO createdClassRoom = classRoomService.createClass(classRoomDTO);
		return ResponseEntity.ok(createdClassRoom);
	}

	@PutMapping("/{id}")
	public ResponseEntity<?> updateSubject(@PathVariable("id") Integer classroomId, 
			@RequestBody ClassRoomDTO classRoomDTO) {
		ClassRoomDTO updateClassRoom = classRoomService.updateClass(classroomId, classRoomDTO);
		return ResponseEntity.ok(updateClassRoom);
	}
}
