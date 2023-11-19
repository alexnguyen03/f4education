package com.f4education.springjwt.interfaces;

import java.util.List;

import org.springframework.stereotype.Service;

import com.f4education.springjwt.models.Task;

@Service
public interface TaskService {
    List<Task> getAll(Integer id);

    Task save(Task task);
}
