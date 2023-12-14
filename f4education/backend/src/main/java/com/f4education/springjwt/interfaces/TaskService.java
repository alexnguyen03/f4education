package com.f4education.springjwt.interfaces;

import java.util.List;

import org.springframework.data.jpa.repository.Query;
import org.springframework.web.multipart.MultipartFile;

import com.f4education.springjwt.models.Task;
import com.f4education.springjwt.payload.request.TaskDTO;
import com.f4education.springjwt.payload.request.TaskFileStudentDTO;

public interface TaskService {
	List<TaskDTO> getAllTaskByClassId(Integer classId);

	public void submitTaskFile(MultipartFile file, String className, String taskName, String studentName)
			throws Exception;

	List<TaskFileStudentDTO> getAllFilesInFolderTaskStudent(String className, String taskName, String studentName)
			throws Exception;

	@Query("SELECT o.tasks FROM Classes o WHERE o.classId = :id")
	List<Task> getAll(Integer id);

	Task save(Task task);
}
