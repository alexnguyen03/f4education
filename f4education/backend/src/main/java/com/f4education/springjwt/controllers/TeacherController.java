package com.f4education.springjwt.controllers;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import com.f4education.springjwt.payload.request.TeacherDTO;
import com.f4education.springjwt.security.services.TeacherServiceImpl;

@CrossOrigin("*")
@RestController
@RequestMapping("/api/teachers")
public class TeacherController {
    @Autowired
    TeacherServiceImpl teacherService;

    @GetMapping
    // @PreAuthorize("hasRole('ADMIN')")
    public List<TeacherDTO> getAllTeachers() {
        return teacherService.getAllTeachersDTO();
    }

    @GetMapping("/{id}")
    // @PreAuthorize("hasRole('ADMIN')")
    public TeacherDTO getTeacher(@PathVariable("id") String teacherID) {
        return teacherService.getTeacherDTOByID(teacherID);
    }

    @PostMapping
    // @PreAuthorize("hasRole('ADMIN')")
    public TeacherDTO createSubject(@RequestBody TeacherDTO teacherDTO) {
        return teacherService.createTeacher(teacherDTO);
    }

    @PutMapping()
    // @PreAuthorize("hasRole('ADMIN')")
    public TeacherDTO updateSubject(@RequestBody TeacherDTO teacherDTO) {
        return teacherService.updateTeacher(teacherDTO);
    }
}
