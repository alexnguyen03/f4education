package com.f4education.springjwt.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import com.f4education.springjwt.models.Task;

public interface TaskRepository extends JpaRepository<Task, Integer> {

    @Query("SELECT o FROM Task o where o.classes.classId = :classId")
    List<Task> getAll(@Param("classId") Integer id);
}
