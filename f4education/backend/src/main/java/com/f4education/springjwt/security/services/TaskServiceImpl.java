package com.f4education.springjwt.security.services;

import java.util.Collections;
import java.util.Date;
import java.util.List;
import java.util.stream.Collectors;

import org.springframework.beans.BeanUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import com.f4education.springjwt.interfaces.QuestionDetailService;
import com.f4education.springjwt.interfaces.TaskService;
import com.f4education.springjwt.models.Task;
import com.f4education.springjwt.payload.request.TaskDTO;
import com.f4education.springjwt.repository.GoogleDriveRepository;
import com.f4education.springjwt.repository.TaskRepository;

@Service
public class TaskServiceImpl implements TaskService {
	@Autowired
	TaskRepository taskRepository;
	@Autowired
	GoogleDriveRepository googleDriveRepository;

	@Override
	public List<TaskDTO> getAllTaskByClassId(Integer classId) {
		List<Task> tasks = taskRepository.findByClassId(classId);
		System.out.println(tasks);
		return tasks.stream().map(this::convertToDto).collect(Collectors.toList());
	}

	private TaskDTO convertToDto(Task task) {
		TaskDTO taskDTO = new TaskDTO();
		BeanUtils.copyProperties(task, taskDTO);
		taskDTO.setClassName(task.getClasses().getClassName());
		taskDTO.setTeacherName(task.getClasses().getTeacher().getFullname());
		return taskDTO;
	}

	@Override
	public void submitTaskFile(MultipartFile file, String className, String taskName, String studentName) {
		try {
			googleDriveRepository.uploadFileStudent(file, className, taskName, studentName);
		} catch (Exception e) {
			e.printStackTrace();
		}
	}
}