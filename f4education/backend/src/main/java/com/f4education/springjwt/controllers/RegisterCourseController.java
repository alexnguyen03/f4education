package com.f4education.springjwt.controllers;

import com.f4education.springjwt.payload.request.CourseRequest;
import com.f4education.springjwt.payload.request.RegisterCourseRequestDTO;
import com.f4education.springjwt.payload.request.TeacherDTO;
import com.f4education.springjwt.payload.response.RegisterCourseResponseDTO;
import com.f4education.springjwt.payload.HandleResponseDTO;
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

    @GetMapping("/distinc")
    public ResponseEntity<?> findAllDistincByCourse_CourseName() {
        List<RegisterCourseResponseDTO> list = registerCourseService.getAllRegisterCoursesByCourse_CourseName();
        return ResponseEntity.ok(list);
    }

    @GetMapping("/{studentId}")
    public HandleResponseDTO<List<RegisterCourseResponseDTO>> findAllByStudentId(@PathVariable Integer studentId) {
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
