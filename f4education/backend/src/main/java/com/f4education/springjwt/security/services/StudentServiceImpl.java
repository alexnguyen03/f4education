package com.f4education.springjwt.security.services;

import org.springframework.stereotype.Service;

import com.f4education.springjwt.interfaces.StudentService;
import com.f4education.springjwt.models.Student;

@Service
public class StudentServiceImpl implements StudentService {

    @Override
    public Student findByUserId(String userId) {
        // TODO Auto-generated method stub
        throw new UnsupportedOperationException("Unimplemented method 'findByUserId'");
    }

}
