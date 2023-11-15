package com.f4education.springjwt.controllers;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.f4education.springjwt.interfaces.PointService;
import com.f4education.springjwt.payload.request.PointDTO;

@CrossOrigin("*")
@RestController
@RequestMapping("/api/point")
public class PointController {
	@Autowired
	PointService pointService;

	@GetMapping("/result")
	public ResponseEntity<?> findPointByStudentAndClass(@RequestParam("studentId") String studentId,
			@RequestParam("classId") Integer classId) {
		List<PointDTO> lst = pointService.getAllPointByStudentIdAndClassId(studentId, classId);
		System.out.println(lst);
		return ResponseEntity.ok(lst);
	}

}
