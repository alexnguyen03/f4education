package com.f4education.springjwt.security.services;

import java.util.List;

import org.springframework.stereotype.Service;

@Service
public interface AttendanceService {
    List<Object[]> getAllByClassId(Integer classId);
}
