package com.f4education.springjwt.controllers;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.f4education.springjwt.payload.response.SessionsDTO;
import com.f4education.springjwt.security.services.SessionsServiceImpl;

@RestController
@CrossOrigin("*")
@RequestMapping("/api/sessions")
public class SessionsController {
    @Autowired
    SessionsServiceImpl sessionsService;

    @GetMapping("")
    public List<SessionsDTO> getAllSession() {
        return sessionsService.findAll();
    }
}
