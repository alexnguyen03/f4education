package com.f4education.springjwt.security.services;

import java.time.OffsetDateTime;
import java.time.ZoneOffset;
import java.util.ArrayList;
import java.util.Date;
import java.util.List;
import java.util.stream.Collectors;

import org.springframework.beans.BeanUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import com.f4education.springjwt.interfaces.TaskService;
import com.f4education.springjwt.models.Classes;
import com.f4education.springjwt.models.Task;
import com.f4education.springjwt.payload.request.TaskDTO;
import com.f4education.springjwt.payload.request.TaskFileStudentDTO;
import com.f4education.springjwt.repository.ClassRepository;
import com.f4education.springjwt.repository.GoogleDriveRepository;
import com.f4education.springjwt.repository.TaskRepository;
import com.f4education.springjwt.ultils.ConvertByteToMB;
import com.google.api.services.drive.model.File;

@Service
public class TaskServiceImpl implements TaskService {
	@Autowired
    private TaskRepository taskRepository;

    @Autowired
    GoogleDriveRepository googleDriveRepository;

    @Autowired
    ClassRepository classRepository;

    @Autowired
    ScheduleServiceImpl scheduleServiceImpl;

    @Autowired
    MailerServiceImpl mailer;

	@Override
	public List<TaskDTO> getAllTaskByClassId(Integer classId) {
		List<Task> tasks = taskRepository.findByClassId(classId);
		System.out.println(tasks);
		return tasks.stream().map(this::convertToDto).collect(Collectors.toList());
	}

	private TaskDTO convertToDto(Task task) {
		TaskDTO taskDTO = new TaskDTO();
		BeanUtils.copyProperties(task, taskDTO);
		taskDTO.setStartDate(Date.from(task.getStartDate().toInstant()));
		taskDTO.setEndDate(Date.from(task.getEndDate().toInstant()));
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

	@Override
	public List<TaskFileStudentDTO> getAllFilesInFolderTaskStudent(String className, String taskName,
			String studentName) throws Exception {
		GoogleDriveRepository googleDriveRepository = new GoogleDriveRepository();
		List<File> files = googleDriveRepository.getAllFilesInFolderTaskStudent(className, taskName, studentName);
		List<TaskFileStudentDTO> taskFileStudentDTOs = new ArrayList<>();

		if (files != null) {
			for (File f : files) {
				if (f.getSize() != null) {
					TaskFileStudentDTO taskFileStudentDTO = new TaskFileStudentDTO();
					taskFileStudentDTO.setId(f.getId());
					taskFileStudentDTO.setName(f.getName());
					taskFileStudentDTO.setSize(ConvertByteToMB.getSize(f.getSize()));
					taskFileStudentDTOs.add(taskFileStudentDTO);
				}
			}
		}
		return taskFileStudentDTOs;
	}

    @Override
    public List<Task> getAll(Integer id) {
        return taskRepository.getAll(id);
    }

    @Override
    public Task save(Task task) {
        Classes classes = classRepository.findById(task.getClassesId()).get();
        ZoneOffset timeOffset = scheduleServiceImpl.getTimeOffsetToServer();

        OffsetDateTime starDate = task.getStartDate().withOffsetSameInstant(timeOffset);
        OffsetDateTime endDate = task.getEndDate().withOffsetSameInstant(timeOffset);

        task.setStartDate(starDate);
        task.setEndDate(endDate);
        task.setClasses(classes);

        if (task.getTaskId() == null) {
            String idFolder = null;
            try {
                String linkFoler = "Tasks/" + task.getClasses().getClassName() + "/" + task.getTitle();
                idFolder = googleDriveRepository.getFolderId(linkFoler);
                List<String> mails = null;
                // mails.add(accountDTO.getEmail());

                // ! bỏ mail vào hàng chờ kèm với thời gian gửi mail

                String[] mail = mails.toArray(new String[0]);
                mailer.queue(mail, "", "", null);

            } catch (Exception e) {
                e.printStackTrace();
            }
        } else {
            Task taskNew = taskRepository.findById(task.getTaskId()).get();
            if (taskNew.getTitle().equals(task.getTitle())) {
                // ! Tiến hành đổi tên folder cũ
            }
        }
        // return null;
        return taskRepository.save(task);
    }
}