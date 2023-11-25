package com.f4education.springjwt.controllers;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.f4education.springjwt.security.services.ProgressServiceImpl;

@CrossOrigin("*")
@RestController
@RequestMapping("/api/progress")
public class ProgressController {
    
    @Autowired
    ProgressServiceImpl progressServiceImpl;

    @GetMapping("/{classId}")
    public ResponseEntity<?> getAllProgress(@PathVariable("classId") Integer classId) {
        return ResponseEntity.ok(progressServiceImpl.getAllProgress(classId));
    }
    



}
