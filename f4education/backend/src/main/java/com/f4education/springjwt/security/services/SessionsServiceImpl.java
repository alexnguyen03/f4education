package com.f4education.springjwt.security.services;

import com.f4education.springjwt.interfaces.SessionsService;
import com.f4education.springjwt.models.Admin;
import com.f4education.springjwt.models.Sessions;
import com.f4education.springjwt.models.SessionsHistory;
import com.f4education.springjwt.payload.request.SessionsRequest;
import com.f4education.springjwt.payload.response.SessionsDTO;
import com.f4education.springjwt.repository.AdminRepository;
import com.f4education.springjwt.repository.SessionsHistoryRepository;
import com.f4education.springjwt.repository.SessionsRepository;
import org.springframework.beans.BeanUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.Date;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class SessionsServiceImpl implements SessionsService {
	@Autowired
	SessionsRepository sessionsRepository;
	@Autowired
	SessionsHistoryRepository sessionsHistoryRepository;

	@Autowired
	AdminRepository adminRepository;

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

	@Override
	public SessionsDTO saveSessions(SessionsRequest sessionsRequest) {
		String action = "CREATE";
		Sessions sessions = this.convertRequestToEntity(sessionsRequest);
		Integer sessionId = sessionsRequest.getSessionId();
		if (sessionId != null) {
			action = "UPDATE";
		}
		Sessions savedSession = sessionsRepository.save(sessions);
		this.saveSessionsHistory(savedSession, action);
		return this.convertEntityToDTO(savedSession);
	}

	private Sessions convertRequestToEntity(SessionsRequest sessionsRequest) {
		Sessions sessions = new Sessions();
		System.out.println(sessionsRequest.getAdminId());
		BeanUtils.copyProperties(sessionsRequest, sessions);
		System.out.println(sessionsRequest);

		Admin admin = adminRepository.findById(sessionsRequest.getAdminId()).get();
		System.out.println(admin.getAdminId());
		sessions.setAdmin(admin);
		return sessions;
	}

	private void saveSessionsHistory(Sessions sessions, String action) {
		SessionsHistory sessionsHistory = new SessionsHistory();
		BeanUtils.copyProperties(sessions, sessionsHistory);

		sessionsHistory.setSessions(sessions);
		sessionsHistory.setModifyDate(new Date());
		sessionsHistory.setAdminId(sessions.getAdmin().getAdminId());
		sessionsHistory.setAction(action);
		sessionsHistoryRepository.save(sessionsHistory);
	}
}
