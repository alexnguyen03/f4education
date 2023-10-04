package com.f4education.springjwt.interfaces;

import org.springframework.stereotype.Service;

import com.f4education.springjwt.models.Admin;

@Service
public interface AdminService {
	Admin getAdminById(String adminId);

	Admin getAdminByUserId(String userId);
}
