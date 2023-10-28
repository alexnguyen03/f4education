package com.f4education.springjwt.interfaces;

import java.util.List;

import org.springframework.stereotype.Service;

import com.f4education.springjwt.models.Schedule;
import com.f4education.springjwt.payload.request.ScheduleDTO;
import com.f4education.springjwt.payload.request.ScheduleRequest;
import com.f4education.springjwt.payload.response.ScheduleResponse;

@Service
public interface ScheduleService {
    List<Schedule> saveSchedule(ScheduleRequest scheduleRequest);

    ScheduleResponse findAllScheduleByClassId(Integer classId);
}
