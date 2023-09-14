package com.f4education.springjwt.interfaces;

import java.util.List;

import org.springframework.web.multipart.MultipartFile;

import com.f4education.springjwt.payload.request.ResourcesDTO;

public interface ResourceService {
    List<ResourcesDTO> findAll();
    
    ResourcesDTO createResource(ResourcesDTO resourcesDTO);
    
    public void uploadFile(MultipartFile file, String folderName);
}
