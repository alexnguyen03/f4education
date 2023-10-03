package com.f4education.springjwt.interfaces;

import com.f4education.springjwt.models.Student;

public interface StudentService {
    public Student findByUserId(String userId);
}
