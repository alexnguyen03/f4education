package com.f4education.springjwt.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.f4education.springjwt.models.Admin;
import com.f4education.springjwt.models.Subject;

@Repository
public interface AdminRepository extends JpaRepository<Admin, String> {
	
}
