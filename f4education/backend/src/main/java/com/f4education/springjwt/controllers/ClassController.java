package com.f4education.springjwt.controllers;

import java.util.List;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.f4education.springjwt.interfaces.ClassService;
import com.f4education.springjwt.models.Classes;
import com.f4education.springjwt.payload.request.ClassDTO;

@CrossOrigin(origins = "*", maxAge = 3600)
@RestController
@RequestMapping("/api/classs")
public class ClassController {
	
	@Autowired
	ClassService classService;
	
	@GetMapping("")
	public List<ClassDTO> getAll() {
		return classService.findAll();
	}
}
