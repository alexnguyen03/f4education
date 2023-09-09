package com.f4education.springjwt.controllers;

import com.f4education.springjwt.payload.request.SessionsRequest;
import com.f4education.springjwt.payload.response.SessionsDTO;
import com.f4education.springjwt.security.services.SessionsServiceImpl;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@CrossOrigin("*")
@RequestMapping("/api/sessions")
public class SessionsController {
	@Autowired
	SessionsServiceImpl sessionsService;


	@GetMapping("")
//	@PreAuthorize("hasRole('ADMIN')")
	public List<SessionsDTO> getAllSession() {
		return sessionsService.findAll();
	}

	@PostMapping("")
//	@PreAuthorize("hasRole('ADMIN')")
	public SessionsDTO createSessions(@RequestBody SessionsRequest sessionsRequest) {
		return sessionsService.saveSessions(sessionsRequest);
	}


	@PutMapping("")
//	@PreAuthorize("hasRole('ADMIN')")
	public SessionsDTO updateSessions(@RequestBody SessionsRequest sessionsRequest) {
		return sessionsService.saveSessions(sessionsRequest);
	}


}
