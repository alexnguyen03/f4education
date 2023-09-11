package com.f4education.springjwt.security.services;

import java.util.List;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.f4education.springjwt.interfaces.SessionsHistoryService;
import com.f4education.springjwt.models.SessionsHistory;
import com.f4education.springjwt.payload.response.SessionsHistoryDTO;
import com.f4education.springjwt.repository.AdminRepository;
import com.f4education.springjwt.repository.SessionsHistoryRepository;
import com.f4education.springjwt.repository.SessionsRepository;

@Service
public class SessionsHistoryServiceImpl implements SessionsHistoryService {
	@Autowired
	SessionsRepository sessionsRepository;
	@Autowired
	SessionsHistoryRepository sessionsHistoryRepository;

	@Autowired
	AdminRepository adminRepository;

	private SessionsHistoryDTO convertEntityToDTO(SessionsHistory sessionsHistory) {
		return new SessionsHistoryDTO(
				sessionsHistory.getSessionHistoryId(),
				sessionsHistory.getSessionName(),
				sessionsHistory.getStartTime(),
				sessionsHistory.getEndTime(),
				sessionsHistory.getSessions().getAdmin().getFullname(),
				sessionsHistory.getSessions(),
				sessionsHistory.getModifyDate(),
				sessionsHistory.getAction());
		// return null;
	}

	@Override
	public List<SessionsHistoryDTO> findAll() {
		return sessionsHistoryRepository
				.findAll()
				.stream()
				.map(this::convertEntityToDTO)
				.collect(Collectors.toList());
	}

}
