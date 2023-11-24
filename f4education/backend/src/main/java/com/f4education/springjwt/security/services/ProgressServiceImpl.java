package com.f4education.springjwt.security.services;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.f4education.springjwt.interfaces.ProgressService;
import com.f4education.springjwt.payload.request.ProgressDTO;
import com.f4education.springjwt.repository.RegisterCourseRepository;

@Service
public class ProgressServiceImpl implements ProgressService{

    @Autowired
    RegisterCourseRepository registerCourseRepository;

    @Override
    public List<ProgressDTO> getAllProgress(Integer classId) {
        return registerCourseRepository.getAllProgress(classId);
    }
    
}
