package com.f4education.springjwt.controllers;

import java.time.Instant;
import java.time.LocalDate;
import java.time.ZoneId;
import java.time.format.DateTimeFormatter;
import java.util.ArrayList;
import java.util.Date;
import java.util.List;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.repository.query.Param;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestPart;
import org.springframework.web.bind.annotation.RestController;

import com.f4education.springjwt.interfaces.ClassRoomService;
import com.f4education.springjwt.payload.request.ClassRoomDTO;
import com.f4education.springjwt.payload.request.DateDTO;
import com.f4education.springjwt.payload.request.SessionClassroomDTO;

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

	/*
	 * tim danh sach phong hoc trong theo ca hoc
	 */
	@PostMapping("/session")
	public ResponseEntity<?> findBySessionId(@RequestBody DateDTO dateDTO) {
		String startDate = dateDTO.getStartDate();
		DateTimeFormatter formatter = DateTimeFormatter.ofPattern("yyyy/MM/dd");
		List<Object[]> list = new ArrayList<>();
		List<SessionClassroomDTO> ls = new ArrayList<>();
		try {

			// Chuyển đổi thành đối tượng LocalDate
			LocalDate localDate = LocalDate.parse(startDate, formatter);

			// Chuyển đổi từ LocalDate thành Instant
			Instant instant = localDate.atStartOfDay(ZoneId.systemDefault()).toInstant();

			// Chuyển đổi từ Instant thành Date
			Date date = Date.from(instant);
			System.out.println(date + " =====================================");

			System.out.println(date);
			list = classRoomService.getClassByNotInScheduleBySessionId(date);
			for (Object[] objects : list) {
				SessionClassroomDTO sessionClassroomDTO = new SessionClassroomDTO();
				sessionClassroomDTO.setClassroomId(Integer.parseInt(objects[0].toString()));
				sessionClassroomDTO.setClassroomName(objects[1].toString());
				sessionClassroomDTO.setSessionId(Integer.parseInt(objects[2].toString()));
				sessionClassroomDTO.setSessionName(objects[3].toString());
				ls.add(sessionClassroomDTO);
			}

		} catch (Exception e) {
			e.printStackTrace();
		}
		return ResponseEntity.ok(ls);
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
