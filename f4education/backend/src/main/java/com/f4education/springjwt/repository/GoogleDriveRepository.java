package com.f4education.springjwt.repository;

import java.io.ByteArrayInputStream;
import java.io.ByteArrayOutputStream;
import java.io.IOException;
import java.security.GeneralSecurityException;
import java.util.ArrayList;
import java.util.Collections;
import java.util.List;
import java.util.zip.ZipEntry;
import java.util.zip.ZipOutputStream;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;
import org.springframework.web.multipart.MultipartFile;

import com.f4education.springjwt.DriveQuickstart;
import com.f4education.springjwt.security.services.SessionService;
import com.google.api.client.http.FileContent;
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

	public List<File> getAllFilesInFolderLesson(String folderId) throws Exception {
		DriveQuickstart driveQuickstart = new DriveQuickstart();

		// Lấy danh sách file trong thư mục "BÀI HỌC"
		String subFolderLessonId = searchFolderId(folderId, "BÀI HỌC", driveQuickstart.getInstance());
		List<File> allFiles = new ArrayList<>();
		FileList result = driveQuickstart.getInstance().files().list().setQ("'" + subFolderLessonId + "' in parents")
				.setSpaces("drive").setFields("files(id, name, size)").execute();

		List<File> files = result.getFiles();
		if (files != null && !files.isEmpty()) {
			allFiles.addAll(files);
		}

		return allFiles;
	}

	public List<File> getAllFilesInFolderResource(String folderId) throws Exception {
		DriveQuickstart driveQuickstart = new DriveQuickstart();

		// Lấy danh sách file trong thư mục "BÀI HỌC"
		String subFolderResourceId = searchFolderId(folderId, "TÀI NGUYÊN", driveQuickstart.getInstance());

		List<File> allFiles = new ArrayList<>();
		FileList result = driveQuickstart.getInstance().files().list().setQ("'" + subFolderResourceId + "' in parents")
				.setSpaces("drive").setFields("files(id, name, size)").execute();

		List<File> files = result.getFiles();
		if (files != null && !files.isEmpty()) {
			allFiles.addAll(files);
		}

		return allFiles;
	}

	// Set permission drive file
	private Permission setPermission(String type, String role) {
		Permission permission = new Permission();
		permission.setType(type);
		permission.setRole(role);
		return permission;
	}

	private boolean fileExists(String filename, String folderId) throws IOException, GeneralSecurityException {
		FileList fileList = driveQuickstart.getInstance().files().list()
				.setQ("name = '" + filename + "' and '" + folderId + "' in parents").setSpaces("drive").execute();

		List<File> files = fileList.getFiles();
		return files != null && !files.isEmpty();
	}

	// Upload file
	public String uploadFile(MultipartFile file, String folderName, String type) {
		try {
			String folderId = getFolderId(folderName);
			sessionService.set("folderId", folderId);

			if (null != file) {
				// Tạo hai thư mục con
				String subFolderLessonId = findOrCreateFolder(folderId, "BÀI HỌC", driveQuickstart.getInstance());
				String subFolderResourceId = findOrCreateFolder(folderId, "TÀI NGUYÊN", driveQuickstart.getInstance());

				// Chọn một trong hai thư mục để tải lên
				String selectedFolderId = "";
				if (type.equals("BÀI HỌC")) {
					selectedFolderId = subFolderLessonId;
				} else if (type.equals("TÀI NGUYÊN")) {
					selectedFolderId = subFolderResourceId;
				}

				// Kiểm tra xem file đã tồn tại trên Google Drive chưa
				if (fileExists(file.getOriginalFilename(), selectedFolderId)) {
					System.out.println("File already exists on Google Drive.");
					return null;
				}

				// Tạo metadata cho tệp
				File fileMetadata = new File();
				fileMetadata.setParents(Collections.singletonList(selectedFolderId));
				fileMetadata.setName(file.getOriginalFilename());

				// Tạo tệp trên Google Drive
				File uploadFile = driveQuickstart.getInstance().files().create(fileMetadata,
						new InputStreamContent(file.getContentType(), new ByteArrayInputStream(file.getBytes())))
						.setFields("id").execute();

				// Đặt quyền truy cập cho tệp
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

	public void deleteFile(String fileId) throws Exception {
		DriveQuickstart driveQuickstart = new DriveQuickstart();
		driveQuickstart.getInstance().files().delete(fileId).execute();
	}

	public byte[] downloadMultipleFiles(List<String> fileIds) {
		DriveQuickstart driveService = new DriveQuickstart();
		ByteArrayOutputStream zipOutputStream = new ByteArrayOutputStream();
		ZipOutputStream zip = new ZipOutputStream(zipOutputStream);

		for (String fileId : fileIds) {
			File file;
			try {
				file = driveService.getInstance().files().get(fileId).execute();
				// Tạo một entry mới trong tệp ZIP với tên là tên của tệp từ Google Drive
				ZipEntry zipEntry = new ZipEntry(file.getName());
				zip.putNextEntry(zipEntry);

				// Tải dữ liệu từ tệp Google Drive và ghi vào tệp ZIP
				ByteArrayOutputStream fileOutputStream = new ByteArrayOutputStream();
				driveService.getInstance().files().get(fileId).executeMediaAndDownloadTo(fileOutputStream);
				zip.write(fileOutputStream.toByteArray());
				zip.closeEntry();
			} catch (GeneralSecurityException e) {
				// TODO Auto-generated catch block
				e.printStackTrace();
			} catch (IOException e) {
				// TODO Auto-generated catch block
				e.printStackTrace();
			}

		}

		try {
			zip.close();
		} catch (IOException e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		}
		return zipOutputStream.toByteArray();
	}
}
