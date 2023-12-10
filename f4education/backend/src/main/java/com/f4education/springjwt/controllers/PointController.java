package com.f4education.springjwt.controllers;

import java.util.ArrayList;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.f4education.springjwt.models.Classes;
import com.f4education.springjwt.models.Point;
import com.f4education.springjwt.models.Student;
import com.f4education.springjwt.payload.request.PointRequest;
import com.f4education.springjwt.payload.request.StudentInPointDTO;
import com.f4education.springjwt.payload.response.PointDTO;
import com.f4education.springjwt.security.services.ClassServiceImpl;
import com.f4education.springjwt.security.services.PointServiceImpl;
import com.f4education.springjwt.security.services.StudentServiceImpl;

@RestController
@CrossOrigin("*")
@RequestMapping("/api/points")
public class PointController {

	@Autowired(required = true)
	ClassServiceImpl classService;
	@Autowired(required = true)
	PointServiceImpl pointService;

	@Autowired
	StudentServiceImpl studentService;

	// @PreAuthorize("hasRole('TEACHER')")
	// @GetMapping(value = "")
	// public ResponseEntity<?> getAll() {
	// return ResponseEntity.ok(pointService.findAll());
	// }

	@GetMapping("/result")
	public ResponseEntity<?> findPointByStudentAndClass(@RequestParam("studentId") String studentId,
			@RequestParam("classId") Integer classId) {
		List<PointDTO> lst = pointService.getAllPointByStudentIdAndClassId(studentId, classId);
		return ResponseEntity.ok(lst);
	}

	// @PreAuthorize("hasRole('TEACHER')")
	@GetMapping(value = "/classes/{classId}")
	public ResponseEntity<?> getAllByClassId(@PathVariable("classId") Integer classId) {
		return ResponseEntity.ok(pointService.findAllByClassId(classId));
	}

	// @PreAuthorize("hasRole('TEACHER')")
	@GetMapping(value = "/student/{studentId}")
	public ResponseEntity<?> getAllByStudent(@PathVariable("studentId") String studentId) {
		return ResponseEntity.ok(pointService.findAllByStudentId(studentId));
	}

	// @PreAuthorize("hasRole('TEACHER')")
	@PostMapping(value = "")
	public ResponseEntity<?> save(@RequestBody PointRequest pointRequest) {

		Classes classes = classService.findById(pointRequest.getClassId());
		List<StudentInPointDTO> listPointsOfStudent = pointRequest.getListPointOfStudent();
		List<Point> listPoint = new ArrayList<>();
		listPointsOfStudent.forEach(pointOfStudent -> {
			Point point = new Point();
			if (pointOfStudent.getPointId() != null) {
				point.setPointId(pointOfStudent.getPointId());
			}
			Student student = studentService.findById(pointOfStudent.getStudentId());
			point.setAttendancePoint(pointOfStudent.getAttendancePoint());
			point.setAveragePoint(pointOfStudent.getAveragePoint());
			point.setClasses(classes);
			point.setExercisePoint(pointOfStudent.getExercisePoint());
			point.setQuizzPoint(pointOfStudent.getQuizzPoint());
			point.setStudent(student);
			listPoint.add(point);
		});
		return ResponseEntity.ok(pointService.save(listPoint));
	}

}
