package com.f4education.springjwt.repository;

import com.f4education.springjwt.models.Student;
import org.springframework.data.jpa.repository.JpaRepository;

public interface StudentRepository extends JpaRepository<Student, Integer> {
}