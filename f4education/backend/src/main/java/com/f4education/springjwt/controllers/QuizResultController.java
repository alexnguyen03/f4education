package com.f4education.springjwt.controllers;

import java.io.File;
import java.io.IOException;
import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

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
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

import com.f4education.springjwt.interfaces.CoursesService;
import com.f4education.springjwt.interfaces.QuizResultService;
import com.f4education.springjwt.interfaces.ResourceService;
import com.f4education.springjwt.models.Course;
import com.f4education.springjwt.payload.request.CourseDTO;
import com.f4education.springjwt.payload.request.GoogleDriveFileDTO;
import com.f4education.springjwt.payload.request.QuizResultDTO;
import com.f4education.springjwt.payload.request.QuizResultRequest;
import com.f4education.springjwt.payload.request.ResourceRequest;
import com.f4education.springjwt.payload.request.ResourcesDTO;
import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;

@CrossOrigin(origins = "*", maxAge = 3600)
@RestController
@RequestMapping("/api/quizz-result")
public class QuizResultController {

	@Autowired
	QuizResultService quizResultService;

	@PostMapping()
	public ResponseEntity<?> createQuizzResult(@RequestBody QuizResultRequest quizzResultRequest) {
		System.out.println(quizzResultRequest);
		QuizResultDTO quizResultDTO = quizResultService.createQuizzResult(quizzResultRequest);
		return ResponseEntity.ok(quizResultDTO);
	}
}
