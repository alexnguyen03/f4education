package com.f4education.springjwt.controllers;

import java.io.IOException;
//Import statements 
import java.util.ArrayList;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
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

import com.f4education.springjwt.interfaces.TaskService;
import com.f4education.springjwt.payload.request.CourseDTO;
import com.f4education.springjwt.payload.request.GoogleDriveFileDTO;
import com.f4education.springjwt.payload.request.ResourceRequest;
import com.f4education.springjwt.payload.request.ResourcesDTO;
import com.f4education.springjwt.payload.request.TaskDTO;
import com.f4education.springjwt.payload.request.TaskFileStudentDTO;
import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;

@CrossOrigin("*")
@RestController
@RequestMapping("/api/task")
public class TaskController {
	@Autowired
	TaskService taskService;

	@GetMapping("/{classId}")
//	@PreAuthorize("hasRole('ADMIN')")
	public ResponseEntity<?> getAllTaskByClassId(@PathVariable("classId") Integer classId) {
		List<TaskDTO> taskDTOs = taskService.getAllTaskByClassId(classId);
		return ResponseEntity.ok(taskDTOs);
	}

	@PostMapping(value = "/submit", consumes = { MediaType.MULTIPART_FORM_DATA_VALUE }, produces = {
			MediaType.APPLICATION_JSON_VALUE })
	public void submitTaskFile(@RequestParam("file") MultipartFile[] file, @RequestParam("className") String className,
			@RequestParam("taskName") String taskName, @RequestParam("studentName") String studentName) {

		for (MultipartFile files : file) {
			System.out.println(files);
			try {
				taskService.submitTaskFile(files, className, taskName, studentName);
			} catch (Exception e) {
				e.printStackTrace();
			}
		}
	}

	@GetMapping("/file/{className}/{taskName}/{studentName}")
	public ResponseEntity<?> getAllFilesInFolderTaskStudent(@PathVariable("className") String className,
			@PathVariable("taskName") String taskName, @PathVariable("studentName") String studentName)
			throws Exception {
		List<TaskFileStudentDTO> lists = taskService.getAllFilesInFolderTaskStudent(className, taskName, studentName);
		return ResponseEntity.ok(lists);
	}
}
