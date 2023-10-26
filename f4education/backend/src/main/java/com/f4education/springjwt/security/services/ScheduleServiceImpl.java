package com.f4education.springjwt.security.services;

import java.util.ArrayList;
import java.util.Date;
import java.util.List;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.f4education.springjwt.interfaces.ScheduleService;
import com.f4education.springjwt.models.Admin;
import com.f4education.springjwt.models.ClassRoom;
import com.f4education.springjwt.models.Classes;
import com.f4education.springjwt.models.Schedule;
import com.f4education.springjwt.models.Sessions;
import com.f4education.springjwt.payload.request.ScheduleDTO;
import com.f4education.springjwt.payload.request.ScheduleRequest;
import com.f4education.springjwt.payload.request.TeacherDTO;
import com.f4education.springjwt.payload.response.ScheduleResponse;
import com.f4education.springjwt.repository.AdminRepository;
import com.f4education.springjwt.repository.ClassRepository;
import com.f4education.springjwt.repository.ClassRoomRepository;
import com.f4education.springjwt.repository.ScheduleRepository;
import com.f4education.springjwt.repository.SessionsRepository;

@Service
public class ScheduleServiceImpl implements ScheduleService {
    @Autowired
    ScheduleRepository scheduleRepository;
    @Autowired
    AdminRepository adminRepository;
    @Autowired
    ClassRoomRepository classRoomRepository;
    @Autowired
    ClassRepository classesRepository;

    @Autowired
    SessionsRepository sessionsRepository;

    @Override
    public List<Schedule> saveSchedule(ScheduleRequest scheduleRequest) {
        List<Schedule> listSchedules = new ArrayList<>();

        Classes classes = classesRepository.findById(scheduleRequest.getClassId()).get();
        if (classes.getStatus().equalsIgnoreCase("Đang chờ")) {
            classes.setStatus("Đang diễn ra");
        }
        List<Schedule> listSchedulesAdded = this.convertRequestToListEntity(scheduleRequest);
        try {
            listSchedules = scheduleRepository.saveAll(listSchedulesAdded);
            Date endDate = listSchedules.get(listSchedules.size() - 1).getStudyDate();
            classes.setEndDate(endDate);
            classesRepository.save(classes);
        } catch (Exception e) {
            e.printStackTrace();
        }
        return listSchedules;
    }

    private List<Schedule> convertRequestToListEntity(ScheduleRequest scheduleRequest) {
        List<Schedule> lsSchedule = new ArrayList<Schedule>();

        Admin admin = adminRepository.findById(scheduleRequest.getAdminId()).get();
        ClassRoom classroom = classRoomRepository.findById(scheduleRequest.getClassroomId()).get();
        Classes classes = classesRepository.findById(scheduleRequest.getClassId()).get();
        Sessions session = sessionsRepository.findById(scheduleRequest.getSessionId()).get();
        List<ScheduleDTO> listScheduleDTOs = scheduleRequest.getListSchedule();

        for (ScheduleDTO scheduleDTO : listScheduleDTOs) {
            Schedule schedule = new Schedule();
            schedule.setScheduleId(scheduleDTO.getScheduleId());
            schedule.setClassRoom(classroom);
            schedule.setClasses(classes);
            schedule.setScheduleId(scheduleDTO.getScheduleId());
            schedule.setAdmin(admin);
            schedule.setSessions(session);
            schedule.setContents(scheduleDTO.getContent());
            schedule.setStudyDate(scheduleDTO.getStudyDate());
            schedule.setIsPractice(scheduleDTO.getIsPractice());
            lsSchedule.add(schedule);
        }
        return lsSchedule;
    }

    private ScheduleDTO convertEntityToDTO(Schedule schedule) {

        ScheduleDTO scheduleDTO = new ScheduleDTO();
        scheduleDTO.setScheduleId(schedule.getScheduleId());
        scheduleDTO.setStudyDate(schedule.getStudyDate());
        scheduleDTO.setContent(schedule.getContents());
        scheduleDTO.setIsPractice(schedule.getIsPractice());

        return scheduleDTO;
    }

    private ScheduleResponse convertListEntityToResponses(List<Schedule> schedules) {

        ScheduleResponse schedulesResponse = new ScheduleResponse();
        if (schedules.isEmpty()) {
            return null;
        }
        Schedule firstScheduleInClass = schedules.get(0);
        TeacherDTO teacherDTO = new TeacherDTO(firstScheduleInClass.getClasses().getTeacher());
        List<ScheduleDTO> listSchedule = schedules.stream().map(this::convertEntityToDTO).collect(Collectors.toList());
        Sessions session = sessionsRepository.findById(firstScheduleInClass.getSessions().getSessionId()).get();
        ClassRoom classroom = classRoomRepository.findById(firstScheduleInClass.getClassRoom().getClassroomId()).get();
        schedulesResponse.setClassroomName(classroom.getClassroomName());
        schedulesResponse.setClassroomId(classroom.getClassroomId());
        schedulesResponse.setClassroomName(firstScheduleInClass.getClassRoom().getClassroomName());
        schedulesResponse.setSessionName(session.getSessionName());
        schedulesResponse.setSessionId(session.getSessionId());
        schedulesResponse.setClassId(firstScheduleInClass.getClasses().getClassId());
        schedulesResponse.setClassName(firstScheduleInClass.getClasses().getClassName());
        schedulesResponse.setTeacher(teacherDTO);
        schedulesResponse.setListSchedules(listSchedule);
        return schedulesResponse;
    }

    @Override
    public ScheduleResponse findAllScheduleByClassId(Integer classId) {

        List<Schedule> schedules = scheduleRepository.findAllScheduleByClassId(classId);
        ScheduleResponse scheduleResponse = this.convertListEntityToResponses(schedules);
        return scheduleResponse;
    }
}
