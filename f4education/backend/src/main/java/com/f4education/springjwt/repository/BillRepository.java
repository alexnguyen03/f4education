package com.f4education.springjwt.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.f4education.springjwt.models.Bill;

public interface BillRepository extends JpaRepository<Bill, Integer> {
}