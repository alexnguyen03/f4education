package com.f4education.springjwt.controllers;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.f4education.springjwt.models.Schedule;
import com.f4education.springjwt.payload.request.ScheduleRequest;
import com.f4education.springjwt.payload.response.ScheduleResponse;
import com.f4education.springjwt.security.services.ScheduleServiceImpl;

import jakarta.websocket.server.PathParam;

@CrossOrigin(origins = "*", maxAge = 3600)
@RestController
@RequestMapping("/api/schedule")
public class ScheduleController {
    @Autowired
    ScheduleServiceImpl scheduleService;

    @PostMapping("")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<?> saveSchedule(@RequestBody ScheduleRequest scheduleRequest) {

        List<Schedule> list = scheduleService.saveSchedule(scheduleRequest);

        return ResponseEntity.ok(list);
    }

    @GetMapping("/{classId}")
    public ResponseEntity<?> getAllScheduleByClassId(@PathVariable("classId") Integer classId) {
        ScheduleResponse scheduleResponse = scheduleService.findAllScheduleByClassId(classId);
        return ResponseEntity.ok(scheduleResponse);
    }
}