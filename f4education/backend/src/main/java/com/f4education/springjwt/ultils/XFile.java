package com.f4education.springjwt.ultils;

import java.io.File;
import java.nio.file.Path;
import java.nio.file.Paths;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;
import jakarta.servlet.ServletContext;
import jakarta.servlet.http.HttpServletRequest;

@Service
public class XFile {
	@Autowired
	HttpServletRequest request;
	@Autowired
	ServletContext app;

	public File save(MultipartFile file, String folder) {
		String projectPath = System.getProperty("user.dir"); // Lấy đường dẫn thư mục dự án hiện tại
		String imagePath = projectPath + "/src/main/resources/static/img/" + folder;
		File dir = new File(imagePath).getAbsoluteFile();
		if (dir.exists()) {
			dir.mkdirs();
		}

		String s = file.getOriginalFilename();
		String name = System.currentTimeMillis() + Integer.toHexString(s.hashCode()) + s.substring(s.lastIndexOf("."));
		System.out.println(name);

		File saveFile = null;
		try {
			saveFile = new File(dir, name);
			if (!saveFile.exists()) {
				file.transferTo(saveFile);
				System.out.println(saveFile);
				return saveFile;
			} else {
				System.out.println("File already exists: " + saveFile);
				return saveFile;
			}
		} catch (Exception e) {
			e.printStackTrace();
		}
		return saveFile;
	}
}
