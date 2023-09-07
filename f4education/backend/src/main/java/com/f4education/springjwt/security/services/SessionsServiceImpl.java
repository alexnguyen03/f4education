package com.f4education.springjwt.security.services;

import java.util.List;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.f4education.springjwt.interfaces.SessionService;
import com.f4education.springjwt.models.Course;
import com.f4education.springjwt.models.Sessions;
import com.f4education.springjwt.payload.request.CourseDTO;
import com.f4education.springjwt.payload.response.SessionsDTO;
import com.f4education.springjwt.repository.SessionsRepository;

@Service
public class SessionsServiceImpl implements SessionService {
    @Autowired
    SessionsRepository sessionsRepository;

    @Override
    public List<SessionsDTO> findAll() {
        return sessionsRepository.findAll()
                .stream()
                .map(this::convertEntityToDTO)
                .collect(Collectors.toList());
    }

    private SessionsDTO convertEntityToDTO(Sessions sessions) {
        return new SessionsDTO(sessions.getSessionId(), sessions.getSessionName(), sessions.getStartTime(),
                sessions.getEndTime(), sessions.getAdmin());
    }

}
