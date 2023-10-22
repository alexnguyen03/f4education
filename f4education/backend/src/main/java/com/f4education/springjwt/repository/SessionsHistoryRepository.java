package com.f4education.springjwt.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import com.f4education.springjwt.models.SessionsHistory;

public interface SessionsHistoryRepository extends JpaRepository<SessionsHistory, Integer> {
    public List<SessionsHistory> findAllBySessionsSessionId(Integer sessionId);
}
