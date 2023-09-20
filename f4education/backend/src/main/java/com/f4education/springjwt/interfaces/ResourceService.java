package com.f4education.springjwt.interfaces;

import java.io.IOException;
import java.security.GeneralSecurityException;
import java.util.List;

import org.springframework.web.multipart.MultipartFile;

import com.f4education.springjwt.payload.request.GoogleDriveFileDTO;
import com.f4education.springjwt.payload.request.ResourceRequest;
import com.f4education.springjwt.payload.request.ResourcesDTO;

public interface ResourceService {
	List<ResourcesDTO> findAll();

	ResourcesDTO createResource(ResourceRequest resourceRequest);

	public void uploadFile(MultipartFile file, String folderName);

	List<GoogleDriveFileDTO> getAllFilesByFolder(String folderId) throws IOException, GeneralSecurityException;

	public void deleteFile(String fileId) throws Exception;
}
