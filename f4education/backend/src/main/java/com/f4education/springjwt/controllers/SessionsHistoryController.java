package com.f4education.springjwt.controllers;

import java.util.List;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.f4education.springjwt.payload.response.SessionsDTO;
import com.f4education.springjwt.payload.response.SessionsHistoryDTO;
import com.f4education.springjwt.repository.SessionsHistoryRepository;
import com.f4education.springjwt.security.services.SessionsHistoryServiceImpl;
import com.f4education.springjwt.security.services.SessionsServiceImpl;

@RestController
@CrossOrigin("*")
@RequestMapping("/api/sessions-history")
public class SessionsHistoryController {
    @Autowired
    SessionsHistoryServiceImpl sessionsHistoryServiceImpl;

    @GetMapping("")
    // @PreAuthorize("hasRole('ADMIN')")
    public List<SessionsHistoryDTO> getAllSessionHistory() {
        return sessionsHistoryServiceImpl.findAll();
    }

}
