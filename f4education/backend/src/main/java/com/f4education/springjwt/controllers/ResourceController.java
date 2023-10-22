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
import com.f4education.springjwt.interfaces.ResourceService;
import com.f4education.springjwt.models.Course;
import com.f4education.springjwt.payload.request.CourseDTO;
import com.f4education.springjwt.payload.request.GoogleDriveFileDTO;
import com.f4education.springjwt.payload.request.ResourceRequest;
import com.f4education.springjwt.payload.request.ResourcesDTO;
import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;

@CrossOrigin(origins = "*", maxAge = 3600)
@RestController
@RequestMapping("/api/resource")
public class ResourceController {

	@Autowired
	ResourceService resourceService;

	@Autowired
	CoursesService coursesService;

	@GetMapping
	public ResponseEntity<?> getAll() {
		List<ResourcesDTO> list = resourceService.findAll();
		return ResponseEntity.ok(list);
	}

	@PostMapping(consumes = { MediaType.MULTIPART_FORM_DATA_VALUE }, produces = { MediaType.APPLICATION_JSON_VALUE })
	public ResponseEntity<?> createResource(@RequestParam("file") MultipartFile[] file,
			@RequestPart("resourceRequest") String resourceRequestClient, @RequestParam("type") String type) {

		ObjectMapper mapper = new ObjectMapper();
		ResourceRequest resourceRequest = new ResourceRequest();
		try {
			resourceRequest = mapper.readValue(resourceRequestClient, ResourceRequest.class);
		} catch (JsonProcessingException e) {
			e.printStackTrace();
		} catch (IOException e) {
			e.printStackTrace();
		}

		for (MultipartFile files : file) {
			CourseDTO course = coursesService.findById(resourceRequest.getCourseId());
			resourceService.uploadFile(files, course.getCourseName(), type);
		}
		
		ResourcesDTO resourcesDTO = resourceService.createResource(resourceRequest);
		return ResponseEntity.ok(resourcesDTO);
	}

	@GetMapping("/file/{folderId}")
	public ResponseEntity<?> getAllFilesByFolder(@PathVariable("folderId") String folderId) throws Exception {
		List<GoogleDriveFileDTO> lists = new ArrayList<>();
	    lists.addAll(resourceService.getAllFilesByFolderLesson(folderId));
	    lists.addAll(resourceService.getAllFilesByFolderResource(folderId));
		return ResponseEntity.ok(lists);
	}

	@GetMapping("/delete/file/{id}")
	public void deleteFile(@PathVariable String id) throws Exception {
		resourceService.deleteFile(id);
	}
}
