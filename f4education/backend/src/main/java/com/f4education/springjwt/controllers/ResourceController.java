package com.f4education.springjwt.controllers;

import java.io.File;
import java.io.FileOutputStream;
import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.io.FileSystemResource;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
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
import com.f4education.springjwt.repository.GoogleDriveRepository;
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

	@Autowired
	GoogleDriveRepository googleDriveRepository;

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

	@GetMapping("/files/{courseName}")
	public ResponseEntity<?> getAllFilesByCourseName(@PathVariable("courseName") String courseName) {
		String folderId = "";
		List<GoogleDriveFileDTO> list = new ArrayList<>();

		try {
			folderId = googleDriveRepository.getFolderId(courseName);

			list.addAll(resourceService.getAllFilesByFolderLesson(folderId));
			list.addAll(resourceService.getAllFilesByFolderResource(folderId));
		} catch (Exception e) {
			// TODO: handle exception
			e.printStackTrace();
		}
		return ResponseEntity.ok(list);
	}

	@GetMapping("/download-multiple")
	public ResponseEntity<?> downloadMultipleFiles(@RequestParam List<String> fileIds) {
		try {
			// Gọi phương thức từ driveService để tải nhiều file từ Google Drive
			byte[] zipFile = googleDriveRepository.downloadMultipleFiles(fileIds);

			// Trả về file zip cho client
			HttpHeaders headers = new HttpHeaders();
			headers.setContentType(MediaType.APPLICATION_OCTET_STREAM);
			headers.setContentDispositionFormData("attachment", "files.zip");

			return new ResponseEntity<>(zipFile, headers, HttpStatus.OK);
		} catch (Exception e) {
			return new ResponseEntity<>("Failed to download files", HttpStatus.INTERNAL_SERVER_ERROR);
		}
	}

	@GetMapping("/download-multiple-student/{className}/{taskName}")
	public ResponseEntity<?> downloadMultipleFilesStudent(@PathVariable String className, @PathVariable String taskName)
			throws Exception {
		ResponseEntity<FileSystemResource> response = googleDriveRepository.downloadTaskFolder(className, taskName);
		return ResponseEntity.ok(response.getBody());
	}

	@GetMapping("/delete-foldel-tmp")
	public void deleteFoldelTmp() throws Exception {
		googleDriveRepository.deleteFoldelTmp();
	}

	@PostMapping(value = "/upload", consumes = { MediaType.MULTIPART_FORM_DATA_VALUE }, produces = {
			MediaType.APPLICATION_JSON_VALUE })
	public void uploadResource(@RequestParam("file") MultipartFile[] file,
			@RequestParam("courseName") String courseName, @RequestParam("type") String type) {

		for (MultipartFile files : file) {
			resourceService.uploadFile(files, courseName, type);
		}
	}
}
