package com.f4education.springjwt.controllers;

import java.util.Date;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.bind.annotation.RestController;

import com.f4education.springjwt.models.RegisterCourse;
import com.f4education.springjwt.payload.HandleResponseDTO;
import com.f4education.springjwt.payload.request.CourseRequest;
import com.f4education.springjwt.payload.request.CourseProgressRequestDTO;
import com.f4education.springjwt.payload.request.RegisterCourseRequestDTO;
import com.f4education.springjwt.payload.request.TeacherDTO;
import com.f4education.springjwt.payload.response.CourseProgressResponseDTO;
import com.f4education.springjwt.payload.response.RegisterCourseResponseDTO;
import com.f4education.springjwt.security.services.RegisterCourseServiceImp;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.google.api.client.googleapis.auth.clientlogin.ClientLogin.Response;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.stream.Collectors;

@CrossOrigin("*")
@RestController
@RequestMapping("/api/register-course")
public class RegisterCourseController {
    @Autowired
    RegisterCourseServiceImp registerCourseService;

    @GetMapping
    public HandleResponseDTO<List<RegisterCourseResponseDTO>> findAll() {
        return registerCourseService.getAllRegisterCourse();
    }

    // @GetMapping("/teacher")
    // public ResponseEntity<?> findAllClassByTeacherId() {
    // List<ClassesByTeacher> lst = registerCourseService
    // .getRegisterCourseWithTeacherAndClasses();
    // return ResponseEntity.ok(lst);
    // }

    @GetMapping("/distinc")
    public ResponseEntity<?> findAllDistincByCourse_CourseName() {
        List<RegisterCourseResponseDTO> list = registerCourseService.getAllRegisterCoursesByCourse_CourseName();
        return ResponseEntity.ok(list);
    }

    @GetMapping("/student/{studentId}")
	public ResponseEntity<?> findAllCourseProgressByStudentId(@PathVariable String studentId) {
		List<CourseProgressResponseDTO> lst = registerCourseService.getCourseProgressByStudentID(studentId);
		return ResponseEntity.ok(lst);
	}

	@PostMapping("/student/progress/{classId}")
	public ResponseEntity<?> findCourseProgressByclassId(@PathVariable Integer classId,
	        @RequestBody CourseProgressRequestDTO courseProgressRequest) {
	    Integer totalCountRegister = registerCourseService.getTotalClassIdProgressByclassID(classId,
	            courseProgressRequest);
	    return ResponseEntity.ok(totalCountRegister);
    }

    @GetMapping("/{studentId}")
    public HandleResponseDTO<List<RegisterCourseResponseDTO>> findAllByStudentId(@PathVariable String studentId) {
        return registerCourseService.findAllRegisterCourseByStudentId(studentId);
    }

    @PostMapping
    public HandleResponseDTO<RegisterCourseResponseDTO> createRegisterCourse(
            @RequestBody RegisterCourseRequestDTO registerCourseRequestDTO) {
        return registerCourseService.createRegisterCourse(registerCourseRequestDTO);
    }

    @PutMapping("/{id}")
    public HandleResponseDTO<RegisterCourseResponseDTO> updateRegisterCourse(@PathVariable("id") Integer id,
            @RequestBody RegisterCourseRequestDTO registerCourseRequestDTO) {
        return registerCourseService.updateRegisterCourse(id, registerCourseRequestDTO);
    }

    @PutMapping
    public ResponseEntity<?> updateRegisterCourseInClass(
            @RequestBody RegisterCourseRequestDTO registerCourseRequestDTO) {

        List<RegisterCourseResponseDTO> ls = registerCourseService
                .updateRegisterCourseInClass(registerCourseRequestDTO);
        return ResponseEntity.ok(ls);
    }
}
