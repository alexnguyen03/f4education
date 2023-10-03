package com.f4education.springjwt.controllers;

import java.util.ArrayList;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import com.f4education.springjwt.payload.request.TeacherHistoryDTO;
import com.f4education.springjwt.security.services.TeacherHistoryServiceImpl;
import com.f4education.springjwt.ultils.XFile;

import lombok.RequiredArgsConstructor;

@CrossOrigin("*")
@RestController
@RequestMapping("/api/teachers-history")
@RequiredArgsConstructor
public class TeacherHistoryController {
    @Autowired
    TeacherHistoryServiceImpl teacherHistoryServiceImpl;

    @Autowired
    XFile xfileService;

    @GetMapping
    @PreAuthorize("hasRole('ADMIN')")
    public List<TeacherHistoryDTO> getAllTeacherHistorysDTO() {
        List<TeacherHistoryDTO> list = new ArrayList<>();
        list = teacherHistoryServiceImpl.getAllTeacherHistorysDTO();
        return list;
    }

    @GetMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public List<TeacherHistoryDTO> getTeacher(@PathVariable("id") String teacherID) {
        List<TeacherHistoryDTO> list = new ArrayList<>();
        list = teacherHistoryServiceImpl.getTeacherHistoryDTOByID(teacherID);
        return list;
    }
}
