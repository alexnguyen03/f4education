package com.f4education.springjwt.interfaces;

import java.util.List;

import com.f4education.springjwt.models.Sessions;
import com.f4education.springjwt.payload.request.SessionsRequest;
import com.f4education.springjwt.payload.response.SessionsDTO;

public interface SessionsService {
    public List<SessionsDTO> findAll();

    public SessionsDTO saveSessions(SessionsRequest SessionsRequest);
}
