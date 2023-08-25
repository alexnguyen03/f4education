package com.f4education.springjwt.security.services;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.f4education.springjwt.interfaces.AdminService;
import com.f4education.springjwt.models.Admin;
import com.f4education.springjwt.repository.AdminRepository;

@Service
public class AdminServiceImpl implements AdminService {
	@Autowired
	AdminRepository adminRepository;

	@Override
	public Admin getAdminById(String adminId) {
		return adminRepository.findById(adminId).get();
	}

}
