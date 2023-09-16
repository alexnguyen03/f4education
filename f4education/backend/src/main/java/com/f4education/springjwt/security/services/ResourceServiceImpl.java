package com.f4education.springjwt.security.services;

import java.io.File;
import java.util.Date;
import java.util.List;
import java.util.stream.Collectors;

import org.springframework.beans.BeanUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import com.f4education.springjwt.interfaces.ResourceService;
import com.f4education.springjwt.models.Admin;
import com.f4education.springjwt.models.Course;
import com.f4education.springjwt.models.Resources;
import com.f4education.springjwt.models.Subject;
import com.f4education.springjwt.payload.request.AdminDTO;
import com.f4education.springjwt.payload.request.CourseRequest;
import com.f4education.springjwt.payload.request.ResourceRequest;
import com.f4education.springjwt.payload.request.ResourcesDTO;
import com.f4education.springjwt.repository.AdminRepository;
import com.f4education.springjwt.repository.CourseRepository;
import com.f4education.springjwt.repository.GoogleDriveRepository;
import com.f4education.springjwt.repository.ResourceRepository;

@Service
public class ResourceServiceImpl implements ResourceService {

	@Autowired
	ResourceRepository resourceRepository;

	@Autowired
	private AdminRepository adminRepository;
	
	@Autowired
	CourseRepository courseRepository;

	@Autowired
	GoogleDriveRepository googleDriveRepository;
	
	@Autowired
	SessionService sessionService;

	@Override
	public List<ResourcesDTO> findAll() {
		List<Resources> resources = resourceRepository.findAll();
		return resources.stream().map(this::convertToDto).collect(Collectors.toList());
	}

	@Override
	public ResourcesDTO createResource(ResourceRequest resourceRequest) {
		String action = "CREATE";
		Resources resources = new Resources();
		convertToEntity(resourceRequest, resources);
		Resources saveResource = resourceRepository.save(resources);
		return convertToDto(saveResource);
	}

	private ResourcesDTO convertToDto(Resources resources) {
		ResourcesDTO resourcesDTO = new ResourcesDTO();
		BeanUtils.copyProperties(resources, resourcesDTO);
		Admin admin = adminRepository.findById(resources.getAdmin().getAdminId()).get();
		resourcesDTO.setAdminName(admin.getFullname());
		return resourcesDTO;
	}
	
	private Resources convertToEntity(ResourceRequest resourceRequest, Resources resources) {
		BeanUtils.copyProperties(resourceRequest, resources);
		Course course = courseRepository.findById(resourceRequest.getCourseId()).get();
		Admin admin = adminRepository.findById(resourceRequest.getAdminId()).get();
		resources.setCourse(course);
		resources.setAdmin(course.getAdmin());
		resources.setLink("https://drive.google.com/drive/folders/" + sessionService.get("folderId"));
		return resources;
	}

	@Override
	public void uploadFile(MultipartFile file, String folderName) {
		googleDriveRepository.uploadFile(file, folderName);
	}
}
