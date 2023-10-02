package com.f4education.springjwt.security.services;

import java.util.ArrayList;
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
import com.f4education.springjwt.payload.request.AdminDTO;
import com.f4education.springjwt.payload.request.CourseRequest;
import com.f4education.springjwt.payload.request.GoogleDriveFileDTO;
import com.f4education.springjwt.payload.request.ResourceRequest;
import com.f4education.springjwt.payload.request.ResourcesDTO;
import com.f4education.springjwt.repository.AdminRepository;
import com.f4education.springjwt.repository.CourseRepository;
import com.f4education.springjwt.repository.GoogleDriveRepository;
import com.f4education.springjwt.repository.ResourceRepository;
import com.f4education.springjwt.ultils.ConvertByteToMB;
import com.google.api.services.drive.model.File;

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
		List<Resources> listResources = resourceRepository.findAll();
		Resources saveResource = null;
		boolean found = false;
		for (Resources r : listResources) {
			if (r.getCourse().getCourseId() == resources.getCourse().getCourseId()) {
				found = true;
				break;
			}
		}

		if (!found) {
			saveResource = resourceRepository.save(resources);
			return convertToDto(saveResource);
		}
		return null;
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
		resources.setCreateDate(new Date());
		resources.setLink("https://drive.google.com/drive/folders/" + sessionService.get("folderId"));
		return resources;
	}

	@Override
	public void uploadFile(MultipartFile file, String folderName, String type) {
		googleDriveRepository.uploadFile(file, folderName, type);
	}

	@Override
	public List<GoogleDriveFileDTO> getAllFilesByFolderLesson(String folderId) throws Exception {
		GoogleDriveRepository googleDriveRepository = new GoogleDriveRepository();
		List<File> files = googleDriveRepository.getAllFilesInFolderLesson(folderId);
		List<GoogleDriveFileDTO> googleDriveFileDTOs = new ArrayList<>();

		if (files != null) {
			for (File f : files) {
				if (f.getSize() != null) {
					GoogleDriveFileDTO googleDriveFileDTO = new GoogleDriveFileDTO();
					googleDriveFileDTO.setId(f.getId());
					googleDriveFileDTO.setName(f.getName());
					googleDriveFileDTO.setSize(ConvertByteToMB.getSize(f.getSize()));
					googleDriveFileDTO.setLink("https://drive.google.com/file/d/" + f.getId() + "/view?usp=sharing");
					googleDriveFileDTO.setType("lesson");
					googleDriveFileDTOs.add(googleDriveFileDTO);
				}
			}
		}
		return googleDriveFileDTOs;
	}
	
	@Override
	public List<GoogleDriveFileDTO> getAllFilesByFolderResource(String folderId) throws Exception {
		GoogleDriveRepository googleDriveRepository = new GoogleDriveRepository();
		List<File> files = googleDriveRepository.getAllFilesInFolderResource(folderId);
		List<GoogleDriveFileDTO> googleDriveFileDTOs = new ArrayList<>();

		if (files != null) {
			for (File f : files) {
				if (f.getSize() != null) {
					GoogleDriveFileDTO googleDriveFileDTO = new GoogleDriveFileDTO();
					googleDriveFileDTO.setId(f.getId());
					googleDriveFileDTO.setName(f.getName());
					googleDriveFileDTO.setSize(ConvertByteToMB.getSize(f.getSize()));
					googleDriveFileDTO.setLink("https://drive.google.com/file/d/" + f.getId() + "/view?usp=sharing");
					googleDriveFileDTO.setType("resource");
					googleDriveFileDTOs.add(googleDriveFileDTO);
				}
			}
		}
		return googleDriveFileDTOs;
	}

	@Override
	public void deleteFile(String fileId) throws Exception {
		googleDriveRepository.deleteFile(fileId);
	}
}
