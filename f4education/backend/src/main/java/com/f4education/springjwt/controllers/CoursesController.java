package com.f4education.springjwt.controllers;

import java.io.File;
import java.io.IOException;
import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RequestPart;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

import com.f4education.springjwt.interfaces.CoursesService;
import com.f4education.springjwt.payload.request.CourseDTO;
import com.f4education.springjwt.payload.request.CourseRequest;
import com.f4education.springjwt.payload.response.CourseResponse;
import com.f4education.springjwt.security.services.CourseServiceImpl;
import com.f4education.springjwt.security.services.FirebaseStorageService;
import com.f4education.springjwt.ultils.XFile;
import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;

import lombok.RequiredArgsConstructor;

@RestController
@CrossOrigin("*")
@RequestMapping("/api/courses")
public class CoursesController {
	@Autowired
	CoursesService courseService;

	@Autowired
	XFile xfileService;

	@Autowired
	FirebaseStorageService firebaseStorageService;

	@GetMapping("")
	// @PreAuthorize("hasRole('ADMIN')")
	public ResponseEntity<?> getAllCourse() {
		List<CourseDTO> list = courseService.findAllCourses();
		return ResponseEntity.ok(list);
	}

	@GetMapping("/get-all")
	public ResponseEntity<?> getAllCourse(@RequestParam(value = "studentId") Optional<String> studentId) {
		List<CourseResponse> list = courseService.findAllCourseDTO(studentId.get());
		// System.out.println(list);
		return ResponseEntity.ok(list);
	}

	@GetMapping("/newest-courses")
	public ResponseEntity<?> getTop10NewsetCourse(@RequestParam(value = "studentId") Optional<String> studentId) {
		List<CourseResponse> list = courseService.findNewestCourse(studentId.get());
		return ResponseEntity.ok(list);
	}

	@GetMapping("/detail/{courseId}")
	public ResponseEntity<?> getTopCourseDetailByCourseId(@PathVariable Integer courseId,
			@RequestParam(value = "studentId") Optional<String> studentId) {
		CourseResponse course = courseService.findCourseByCourseId(courseId, studentId.get());

		if (course == null) {
			return ResponseEntity.noContent().build();
		}

		return ResponseEntity.ok(course);
	}

	@GetMapping("/top-selling")
	public ResponseEntity<?> getTop10SoldCourse(@RequestParam(value = "studentId") Optional<String> studentId) {
		List<CourseResponse> list = courseService.findTop10SoldCourse(studentId.get());
		return ResponseEntity.ok(list);
	}

	@GetMapping("/revenue")
	public ResponseEntity<?> getRevenueSoldCourse() {
		List<CourseResponse> list = courseService.findRevenueSoldCourse();
		return ResponseEntity.ok(list);
	}

	@PostMapping(value = "", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
	@ResponseBody
	@PreAuthorize("hasRole('ADMIN')")
	public ResponseEntity<?> addCourse(@RequestPart("courseRequest") String courseRequestString,
			@RequestParam("file") Optional<MultipartFile> file) {
		ObjectMapper mapper = new ObjectMapper();
		// String newFile = "";
		CourseRequest courseRequest = new CourseRequest();
		try {
			courseRequest = mapper.readValue(courseRequestString, CourseRequest.class);
			if (!file.isEmpty()) {
				String imageURL = firebaseStorageService.uploadImage(file.get(),
						"courses/", courseRequest.getCourseName().trim());
				courseRequest.setImage(courseRequest.getCourseName().trim());
			}
		} catch (JsonProcessingException e) {
			e.printStackTrace();
		} catch (IOException e) {
			e.printStackTrace();
		}

		CourseDTO courseDTO = courseService.saveCourse(courseRequest);
		return ResponseEntity.ok(courseDTO);
	}

	@PutMapping(value = "", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
	@PreAuthorize("hasRole('ADMIN')")
	public ResponseEntity<?> updateCourse(@RequestPart("courseRequest") String courseRequestString,
			@RequestParam("file") Optional<MultipartFile> file) {
		ObjectMapper mapper = new ObjectMapper();
		// String newFile = "";
		CourseRequest courseRequest = new CourseRequest();
		try {
			courseRequest = mapper.readValue(courseRequestString, CourseRequest.class);
			if (!file.isEmpty()) {
				String imageURL = firebaseStorageService.uploadImage(file.get(), "courses/",
						courseRequest.getCourseName().trim());
				firebaseStorageService.isUpdatedNoCahe("courses/");
				courseRequest.setImage(courseRequest.getCourseName().trim());
			}
		} catch (JsonProcessingException e) {
			e.printStackTrace();
		} catch (IOException e) {
			e.printStackTrace();
		}
		CourseDTO courseDTO = courseService.saveCourse(courseRequest);
		return ResponseEntity.ok(courseDTO);
	}

	@GetMapping("/actor/{adminId}")
	@PreAuthorize("hasRole('ADMIN')")
	public ResponseEntity<?> findAllByAdminId(@PathVariable("adminId") String adminId) {
		List<CourseDTO> courseDTO = courseService.findAllByAdminId(adminId);
		return ResponseEntity.ok(courseDTO);
	}

	@GetMapping("/{subjectName}")
	public List<CourseDTO> getCourseBySubjectName(@PathVariable("subjectName") String subjectName) {
		return courseService.getCourseBySubjectName(subjectName);
	}

	@GetMapping("/topic/{checkedSubjects}")
	public ResponseEntity<?> findCoursesByCheckedSubjects(@PathVariable("checkedSubjects") List<String> checkedSubjects,
			@RequestParam(value = "studentId") Optional<String> studentId) {
		List<CourseResponse> courseDTO = courseService.findBySubjectNames(checkedSubjects, studentId.get());
		return ResponseEntity.ok(courseDTO);
	}

	@GetMapping("/rating/{star}")
	public ResponseEntity<?> findCoursesByRating(@PathVariable("star") Integer star,
			@RequestParam(value = "studentId") Optional<String> studentId) {
		List<CourseResponse> courseDTO = courseService.findByRating(star, studentId.get());
		return ResponseEntity.ok(courseDTO);
	}

	@GetMapping("/duration/{checkedDurations}")
	public ResponseEntity<?> findCoursesByCheckedDurations(
			@PathVariable("checkedDurations") List<String> checkedDurations) {
		List<CourseDTO> courseDTO = courseService.findByThoiLuongInRange(checkedDurations);
		return ResponseEntity.ok(courseDTO);
	}

	@GetMapping("/course-register/{studentId}")
	public List<CourseDTO> findCoursesByStudentId(@PathVariable("studentId") String studentId) {
		return courseService.findAllCourseDTOByStudentId(studentId);
	}

	@GetMapping("/course-detail/{courseId}")
	public ResponseEntity<?> findCourseById(@PathVariable("courseId") Integer courseId) {
		CourseDTO course = courseService.findById(courseId);
		return ResponseEntity.ok(course);
	}

	@GetMapping("/renameFolder")
	public String renameFolder(String courseName, String newCoursename) throws Exception {
		return courseService.renameFolder(courseName, newCoursename);
	}

	@GetMapping("/validate")
	public Boolean validateCourseName(@RequestParam String courseName) {
		return courseService.isCourseNameExist(courseName);
	}

	@GetMapping("/schedule/{classId}")
	public ResponseEntity<?> getAllCourseContentByClassId(@PathVariable("classId") Integer classId) {

		return ResponseEntity.ok(courseService.getAllCourseContentByClassId(classId));
	}

}
