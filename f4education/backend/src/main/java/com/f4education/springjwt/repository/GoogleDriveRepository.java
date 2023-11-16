package com.f4education.springjwt.repository;

import java.io.ByteArrayInputStream;
import java.io.ByteArrayOutputStream;
import java.io.FileInputStream;
import java.io.FileOutputStream;
import java.io.IOException;
import java.io.OutputStream;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardCopyOption;
import java.security.GeneralSecurityException;
import java.util.ArrayList;
import java.util.Collections;
import java.util.Comparator;
import java.util.List;
import java.util.zip.ZipEntry;
import java.util.zip.ZipOutputStream;

import org.apache.commons.io.FileUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.io.FileSystemResource;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
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
		DriveQuickstart driveQuickstart = new DriveQuickstart();
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
		Permission permission = setPermission("user", "reader").setEmailAddress("f4education.sp@gmail.com");
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

	// Upload file student
	public String uploadFileStudent(MultipartFile file, String className, String taskName, String studentName)
			throws Exception {
		String folder = getFolderId("Tasks");
		try {
			if (null != file) {
				// Tìm thư mục className
				String classNameFolderId = findOrCreateFolder(folder, className, driveQuickstart.getInstance());

				// Tìm thư mục taskName
				String taskNameFolderId = findOrCreateFolder(classNameFolderId, taskName,
						driveQuickstart.getInstance());

				// Tạo thư mục cho sinh viên
				String studentNamebFolderId = findOrCreateFolder(taskNameFolderId, studentName,
						driveQuickstart.getInstance());

				// Kiểm tra xem file đã tồn tại trên Google Drive chưa
				if (fileExists(file.getOriginalFilename(), studentNamebFolderId)) {
					System.out.println("File already exists on Google Drive.");
					return null;
				}

				// Tạo metadata cho tệp
				File fileMetadata = new File();
				fileMetadata.setParents(Collections.singletonList(studentNamebFolderId));
				fileMetadata.setName(file.getOriginalFilename());

				// Tạo tệp trên Google Drive
				File uploadFile = driveQuickstart.getInstance().files().create(fileMetadata,
						new InputStreamContent(file.getContentType(), new ByteArrayInputStream(file.getBytes())))
						.setFields("id").execute();

				System.out.println(uploadFile.getId());
				// Đặt quyền truy cập cho tệp
				driveQuickstart.getInstance().permissions().create(uploadFile.getId(),
						setPermission("user", "reader").setEmailAddress("f4education.sp@gmail.com")).execute();

				return uploadFile.getId();
			}
		} catch (Exception e) {
			e.printStackTrace();
		}
		return null;
	}

	public List<File> getAllFilesInFolderTaskStudent(String className, String taskName, String studentName)
			throws Exception {
		DriveQuickstart driveQuickstart = new DriveQuickstart();

		// Lấy id thư mục "Tasks"
		String taskId = getFolderId("Tasks");

		// Lấy id thư mục "className"
		String subFolderClassNameId = searchFolderId(taskId, className, driveQuickstart.getInstance());

		// Lấy id thư mục "taskName"
		String subFolderTaskNameId = searchFolderId(subFolderClassNameId, taskName, driveQuickstart.getInstance());

		// Lấy id thư mục "studentName"
		String subFolderStudentNameId = searchFolderId(subFolderTaskNameId, studentName, driveQuickstart.getInstance());

		List<File> allFiles = new ArrayList<>();
		FileList result = driveQuickstart.getInstance().files().list()
				.setQ("'" + subFolderStudentNameId + "' in parents").setSpaces("drive")
				.setFields("files(id, name, size)").execute();

		List<File> files = result.getFiles();
		if (files != null && !files.isEmpty()) {
			allFiles.addAll(files);
		}

		return allFiles;
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

	public ResponseEntity<FileSystemResource> downloadTaskFolder(String className, String taskName) throws Exception {
		String tasksId = getFolderId("Tasks");
		String classNameFolderId = findOrCreateFolder(tasksId, className, driveQuickstart.getInstance());
		String taskNameFolderId = findOrCreateFolder(classNameFolderId, taskName, driveQuickstart.getInstance());

		String targetFolderPath = "\\tmp\\" + taskName;

		// Download toàn bộ nội dung trong Task_MayTinh và lưu vào thư mục đích trên máy
		// tính
		downloadFolder(taskNameFolderId, targetFolderPath);

//		// Nén thư mục đích thành một tệp tin ZIP
		String zipFilePath = "/tmp/" + taskName + ".zip";
		zipFolder(targetFolderPath, zipFilePath);

		// Trả về tệp tin ZIP như là một phản hồi
		java.io.File zipFile = new java.io.File(zipFilePath);
		FileSystemResource resource = new FileSystemResource(zipFile);

		HttpHeaders headers = new HttpHeaders();
		headers.add(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=\"" + zipFile.getName() + "\"");
		headers.setContentType(MediaType.APPLICATION_OCTET_STREAM);
		headers.setContentLength(zipFile.length());

		return ResponseEntity.ok().headers(headers).body(resource);
	}

	public void deleteFoldelTmp() throws InterruptedException {
		String directoryPath = "/tmp"; // Đường dẫn của thư mục cần xóa

		try {
			Thread.sleep(5000);

			Path path = Paths.get(directoryPath);
			if (Files.exists(path)) {
				Files.walk(path).sorted((a, b) -> b.toString().length() - a.toString().length()).forEach(p -> {
					try {
						Files.delete(p);
					} catch (IOException e) {
						System.err.println("Failed to delete file: " + p);
					}
				});
			}
		} catch (IOException e) {
			e.printStackTrace();
		}
	}

	private void zipFolder(String sourceFolderPath, String zipFilePath) throws IOException {
		try (ZipOutputStream zipOutputStream = new ZipOutputStream(new FileOutputStream(zipFilePath))) {
			java.io.File sourceFolder = new java.io.File(sourceFolderPath);
			zipFile(sourceFolder, sourceFolder.getName(), zipOutputStream);
		}
	}

	private void zipFile(java.io.File fileToZip, String fileName, ZipOutputStream zipOutputStream) throws IOException {
		if (fileToZip.isDirectory()) {
			java.io.File[] files = fileToZip.listFiles();
			if (files != null) {
				for (java.io.File file : files) {
					zipFile(file, fileName + "/" + file.getName(), zipOutputStream);
				}
			}
		} else {
			byte[] buffer = new byte[1024];
			try (FileInputStream fileInputStream = new FileInputStream(fileToZip)) {
				zipOutputStream.putNextEntry(new ZipEntry(fileName));
				int length;
				while ((length = fileInputStream.read(buffer)) > 0) {
					zipOutputStream.write(buffer, 0, length);
				}
			}
		}
	}

	private void downloadFolder(String folderId, String targetFolderPath) throws IOException, GeneralSecurityException {
		// Lấy danh sách tệp tin và thư mục con trong thư mục hiện tại
		List<File> filesAndFolders = getFilesAndFoldersInFolder(folderId);

		// Download từng tệp tin và thư mục con
		for (File item : filesAndFolders) {
			if (item.getMimeType().equals("application/vnd.google-apps.folder")) {
				// Nếu là thư mục, tạo đường dẫn tới thư mục con tương ứng trong thư mục đích
				// trên máy tính
				String subFolderPath = targetFolderPath + "/" + item.getName();

				// Đảm bảo thư mục đích tồn tại trên máy tính
				java.io.File subFolder = new java.io.File(subFolderPath);
				if (!subFolder.exists()) {
					subFolder.mkdirs();
				}

				// Đệ quy download thư mục con
				downloadFolder(item.getId(), subFolderPath);
			} else {
				// Nếu là tệp tin, download tệp tin và lưu vào thư mục đích trên máy tính
				downloadFile(item.getId(), item.getName(), targetFolderPath);
			}
		}
	}

	private List<File> getFilesAndFoldersInFolder(String folderId) throws IOException, GeneralSecurityException {
		DriveQuickstart driveService = new DriveQuickstart();
		String query = "'" + folderId + "' in parents";
		FileList fileList = driveService.getInstance().files().list().setQ(query).execute();
		return fileList.getFiles();
	}

	private void downloadFile(String fileId, String fileName, String targetFolderPath)
			throws IOException, GeneralSecurityException {
		DriveQuickstart driveService = new DriveQuickstart();
		// Xác định đường dẫn tới tệp tin trên máy tính
		String filePath = targetFolderPath + "/" + fileName;

		// Tạo luồng ghi tệp tin đích
		OutputStream outputStream = new FileOutputStream(filePath);

		// Download tệp tin
		driveService.getInstance().files().get(fileId).executeMediaAndDownloadTo(outputStream);

		outputStream.close();
	}
}
