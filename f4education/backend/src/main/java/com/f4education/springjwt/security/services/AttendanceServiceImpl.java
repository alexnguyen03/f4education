package com.f4education.springjwt.security.services;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.f4education.springjwt.repository.AttendenceRepository;

@Service
public class AttendanceServiceImpl implements AttendanceService {

    @Autowired(required = true)
    AttendenceRepository attendenceRepository;

    @Override
    public List<Object[]> getAllByClassId(Integer classId) {
        return attendenceRepository.getAllByClassId(classId);
    }

}
