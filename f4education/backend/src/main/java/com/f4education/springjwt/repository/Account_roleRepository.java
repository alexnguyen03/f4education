package com.f4education.springjwt.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.f4education.springjwt.models.Account_role;

@Repository
public interface Account_roleRepository extends JpaRepository<Account_role, Integer> {
}
