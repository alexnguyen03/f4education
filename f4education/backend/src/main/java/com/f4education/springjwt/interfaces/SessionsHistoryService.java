package com.f4education.springjwt.interfaces;

import java.util.List;

import com.f4education.springjwt.payload.response.SessionsHistoryDTO;

public interface SessionsHistoryService {
    public List<SessionsHistoryDTO> findAll();

    public List<SessionsHistoryDTO> findAllBySessionsId(Integer sessionId);
}
