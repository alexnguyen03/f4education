package com.f4education.springjwt.controllers;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.f4education.springjwt.interfaces.TaskService;
import com.f4education.springjwt.models.Task;

import lombok.RequiredArgsConstructor;

@CrossOrigin("*")
@RestController
@RequestMapping("/api/task")
@RequiredArgsConstructor
public class TaskController {

    @Autowired(required = true)
    private TaskService taskService;

    @GetMapping("/{id}")
    // @PreAuthorize("hasRole('TEACHER')")
    public ResponseEntity<?> getAll(@PathVariable("id") Integer id) {
        List<Task> tasks = taskService.getAll(id);
        return ResponseEntity.ok(tasks);
    }

    @PostMapping
    // @PreAuthorize("hasRole('TEACHER')")
    public ResponseEntity<?> save(@RequestBody Task task) {
        
        Task taskSave = taskService.save(task);
        return ResponseEntity.ok(null);
    }
}
