package com.f4education.springjwt.security.services;

import java.time.OffsetDateTime;
import java.time.ZoneOffset;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.f4education.springjwt.interfaces.TaskService;
import com.f4education.springjwt.models.Classes;
import com.f4education.springjwt.models.Task;
import com.f4education.springjwt.repository.ClassRepository;
import com.f4education.springjwt.repository.GoogleDriveRepository;
import com.f4education.springjwt.repository.TaskRepository;

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
