package com.f4education.springjwt.controllers;

import java.io.File;
import java.io.IOException;
import java.util.List;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.MediaType;
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

import com.f4education.springjwt.interfaces.ResourceService;
import com.f4education.springjwt.payload.request.ResourcesDTO;
import com.f4education.springjwt.security.services.SessionService;
import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;


@CrossOrigin(origins = "*", maxAge = 3600)
@RestController
@RequestMapping("/api/resource")
public class ResourcesController {
	
	@Autowired
	ResourceService resourceService;
	
	@Autowired
	SessionService sessionService;

	@GetMapping
	public List<ResourcesDTO> getAll() {
		return resourceService.findAll();
	}
	
	@PostMapping(consumes = {MediaType.MULTIPART_FORM_DATA_VALUE},
            produces = {MediaType.APPLICATION_JSON_VALUE})
	public ResourcesDTO createResource(@RequestParam("file") MultipartFile file,
			@RequestPart("resource") String resource) {
		ObjectMapper mapper = new ObjectMapper();
		ResourcesDTO resourcesDTO = new ResourcesDTO();
		try {
			resourcesDTO = mapper.readValue(resource,
					ResourcesDTO.class);
		} catch (JsonProcessingException e) {
			e.printStackTrace();
		} catch (IOException e) {
			e.printStackTrace();
		}

		resourceService.uploadFile(file, resourcesDTO.getCourse().getCourseName());
		resourcesDTO.setLink("https://drive.google.com/drive/folders/" + sessionService.get("folderId"));
		System.out.println(resourcesDTO);
//		return resourceService.createResource(resourcesDTO);
		return resourcesDTO;
	}
}
