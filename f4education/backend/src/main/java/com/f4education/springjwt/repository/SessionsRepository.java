package com.f4education.springjwt.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.f4education.springjwt.models.Sessions;

public interface SessionsRepository extends JpaRepository<Sessions, Integer> {

}
