package com.f4education.springjwt.controllers;

import java.text.ParseException;
import java.time.LocalDate;
import java.time.ZoneId;
import java.util.ArrayList;
import java.util.Date;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.f4education.springjwt.interfaces.CoursesService;
import com.f4education.springjwt.payload.request.GoogleDriveFileDTO;
import com.f4education.springjwt.payload.request.ReportCourseCountStudentCertificateDTO;
import com.f4education.springjwt.payload.request.ReportCourseCountStudentDTO;

@RestController
@CrossOrigin("*")
@RequestMapping("/api/report")
public class ReportCoursesController {
	@Autowired
	CoursesService courseService;

	@GetMapping("/course/student-count/{startDate}/{endDate}")
	public ResponseEntity<?> getCoursesWithStudentCount(
			@PathVariable Date startDate,
			@PathVariable Date endDate) throws ParseException {
		System.out.println(startDate);
		System.out.println(endDate);
		List<ReportCourseCountStudentDTO> list = courseService.getCoursesWithStudentCount(startDate, endDate);
		return ResponseEntity.ok(list);
	}

	@GetMapping("/course/student-count-certificate")
	public ResponseEntity<?> getCoursesWithStudentCountCertificate() {
		List<ReportCourseCountStudentCertificateDTO> list = courseService.getCoursesWithStudentCountCertificate();
		return ResponseEntity.ok(list);
	}
}
