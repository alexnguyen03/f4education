package com.f4education.springjwt.security.services;

import java.util.ArrayList;
import java.util.Calendar;
import java.util.Date;
import java.util.List;
import java.util.stream.Collectors;

import org.springframework.beans.BeanUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import com.f4education.springjwt.interfaces.TaskService;
import com.f4education.springjwt.models.Classes;
import com.f4education.springjwt.models.RegisterCourse;
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
        task.setClasses(classes);

        if (task.getTaskId() == null) {
            String idFolder = null;
            try {
                String linkFoler = "Tasks/" + task.getClasses().getClassName() + "/" + task.getTitle();
                idFolder = googleDriveRepository.getFolderId(linkFoler);

                // ! Tiến hành gửi mails--start
                List<String> mails = new ArrayList<String>();
                List<RegisterCourse> listReg = new ArrayList<RegisterCourse>();
                try {
                    listReg = task.getClasses().getRegisterCourses();
                } catch (Exception e) {
                }

                if (!listReg.isEmpty()) { // ! Lớp học đã có học viên thì mới gửi mails
                    for (RegisterCourse r : listReg) {
                        mails.add(r.getStudent().getUser().getEmail());
                    }

                    Date now = new Date();
                    Date endDate = task.getEndDate();
                    long secondsDiff = (endDate.getTime() - now.getTime()) / 1000;
                    Date date = null;

                    if (secondsDiff >= 7200) {
                        Calendar cal = Calendar.getInstance();
                        cal.setTime(endDate);
                        cal.add(Calendar.HOUR_OF_DAY, -2);
                        date = cal.getTime();
                    }

                    // ! bỏ mail vào hàng chờ kèm với thời gian gửi mail

                    String[] mail = mails.toArray(new String[0]);
                    mailer.mailNewTask(mail, "", "", date, task);
                    System.out.println();
                }
                // ! Tiến hành gửi mails--end

            } catch (Exception e) {
                e.printStackTrace();
            }
        } else {
            Task taskOld = taskRepository.findById(task.getTaskId()).get();
            if (!taskOld.getTitle().equals(task.getTitle())) {
                // ! Tiến hành đổi tên folder cũ
                // String linkFoler = taskOld.getTitle();
                String linkFoler = "Tasks/" + taskOld.getClasses().getClassName() + "/" + taskOld.getTitle();
                String nameFolerNew = task.getTitle();
                try {
                    String idFolder = googleDriveRepository.getFolderId(linkFoler);
                    googleDriveRepository.renameFolderById(idFolder, nameFolerNew);
                } catch (Exception e) {
                }
            }

            // ! Tiến hành gửi mails--start
            List<String> mails = new ArrayList<String>();
            List<RegisterCourse> listReg = new ArrayList<RegisterCourse>();
            try {
                listReg = task.getClasses().getRegisterCourses();
            } catch (Exception e) {
            }

            if (!listReg.isEmpty()) { // ! Lớp học đã có học viên thì mới gửi mails
                for (RegisterCourse r : listReg) {
                    mails.add(r.getStudent().getUser().getEmail());
                }

                Date now = new Date();
                Date endDate = task.getEndDate();
                long secondsDiff = (endDate.getTime() - now.getTime()) / 1000;
                Date date = null;

                if (secondsDiff >= 7200) {
                    Calendar cal = Calendar.getInstance();
                    cal.setTime(endDate);
                    cal.add(Calendar.HOUR_OF_DAY, -2);
                    date = cal.getTime();
                }

                // ! bỏ mail vào hàng chờ kèm với thời gian gửi mail

                String[] mail = mails.toArray(new String[0]);
                mailer.mailUpdateTask(mail, null, null, date, taskOld, task);
            }
            // ! Tiến hành gửi mails--end
        }
        return taskRepository.save(task);
    }

    @Override
    public Task exitTaskByTaskTitleAndClassId(Integer classId, String taskTile) {
        return taskRepository.exitTaskByTaskTitleAndClassId(classId, taskTile);
    }
}