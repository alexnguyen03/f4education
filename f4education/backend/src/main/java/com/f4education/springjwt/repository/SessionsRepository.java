package com.f4education.springjwt.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.f4education.springjwt.models.Sessions;

@Repository
public interface SessionsRepository extends JpaRepository<Sessions, Integer> {

}
