package com.f4education.springjwt.repository;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

import com.f4education.springjwt.models.Course;

public interface CourseRepository extends JpaRepository<Course, Integer> {

}
