package com.f4education.springjwt.interfaces;

import java.util.List;

import com.f4education.springjwt.models.Sessions;
import com.f4education.springjwt.payload.response.SessionsDTO;

public interface SessionService {
    public List<SessionsDTO> findAll();
}
