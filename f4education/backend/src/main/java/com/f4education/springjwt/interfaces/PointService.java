package com.f4education.springjwt.interfaces;

import java.util.List;

import org.springframework.stereotype.Service;

import com.f4education.springjwt.payload.request.PointDTO;

@Service
public interface PointService {
    List<PointDTO> getAllPointByStudentIdAndClassId(String studentId, Integer classId);
}
