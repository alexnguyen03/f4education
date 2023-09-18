package com.f4education.springjwt.repository;

import java.io.ByteArrayInputStream;
import java.util.Collections;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;
import org.springframework.web.multipart.MultipartFile;

import com.f4education.springjwt.DriveQuickstart;
import com.f4education.springjwt.security.services.SessionService;
import com.google.api.client.http.InputStreamContent;
import com.google.api.services.drive.Drive;
import com.google.api.services.drive.model.File;
import com.google.api.services.drive.model.FileList;
import com.google.api.services.drive.model.Permission;

@Component
public class GoogleDriveRepository {

	@Autowired
	DriveQuickstart driveQuickstart;
	@Autowired
	SessionService sessionService;

	// Set permission drive file
	private Permission setPermission(String type, String role) {
		Permission permission = new Permission();
		permission.setType(type);
		permission.setRole(role);
		return permission;
	}

	// Upload file
	public String uploadFile(MultipartFile file, String folderName) {
		try {
			String folderId = getFolderId(folderName);
			sessionService.set("folderId", folderId);
			if (null != file) {
				File fileMetadata = new File();
				fileMetadata.setParents(Collections.singletonList(folderId));
				fileMetadata.setName(file.getOriginalFilename());
				File uploadFile = driveQuickstart.getInstance().files().create(fileMetadata,
						new InputStreamContent(file.getContentType(), new ByteArrayInputStream(file.getBytes())))
						.setFields("id").execute();

				driveQuickstart.getInstance().permissions()
						.create(uploadFile.getId(), setPermission("anyone", "reader")).execute();

				return uploadFile.getId();
			}
		} catch (Exception e) {
			e.printStackTrace();
		}
		return null;
	}

	// get id folder google drive
	public String getFolderId(String folderName) throws Exception {
		String parentId = null;
		String[] folderNames = folderName.split("/");

		Drive driveInstance = driveQuickstart.getInstance();
		for (String name : folderNames) {
			parentId = findOrCreateFolder(parentId, name, driveInstance);
		}
		return parentId;
	}

	private String findOrCreateFolder(String parentId, String folderName, Drive driveInstance) throws Exception {
		String folderId = searchFolderId(parentId, folderName, driveInstance);
		// Folder already exists, so return id
		if (folderId != null) {
			return folderId;
		}
		// Folder dont exists, create it and return folderId
		File fileMetadata = new File();
		fileMetadata.setMimeType("application/vnd.google-apps.folder");
		fileMetadata.setName(folderName);

		if (parentId != null) {
			fileMetadata.setParents(Collections.singletonList(parentId));
		}
		folderId = driveInstance.files().create(fileMetadata).setFields("id").execute().getId();
		// Set folder permission to allow others to view
		Permission permission = setPermission("anyone", "reader");
		driveInstance.permissions().create(folderId, permission).execute();
		return folderId;
	}

	private String searchFolderId(String parentId, String folderName, Drive service) throws Exception {
		String folderId = null;
		String pageToken = null;
		FileList result = null;

		File fileMetadata = new File();
		fileMetadata.setMimeType("application/vnd.google-apps.folder");
		fileMetadata.setName(folderName);

		do {
			String query = " mimeType = 'application/vnd.google-apps.folder' ";
			if (parentId == null) {
				query = query + " and 'root' in parents";
			} else {
				query = query + " and '" + parentId + "' in parents";
			}
			result = service.files().list().setQ(query).setSpaces("drive").setFields("nextPageToken, files(id, name)")
					.setPageToken(pageToken).execute();

			for (File file : result.getFiles()) {
				if (file.getName().equalsIgnoreCase(folderName)) {
					folderId = file.getId();
				}
			}
			pageToken = result.getNextPageToken();
		} while (pageToken != null && folderId == null);

		return folderId;
	}
}
