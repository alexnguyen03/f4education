package com.f4education.springjwt.interfaces;

import java.util.List;

import org.springframework.web.multipart.MultipartFile;

import com.f4education.springjwt.payload.request.TaskDTO;

public interface TaskService {
	List<TaskDTO> getAllTaskByClassId(Integer classId);
	public void submitTaskFile(MultipartFile file, String className, String taskName, String studentName) throws Exception;
}
