package com.f4education.springjwt.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.f4education.springjwt.models.Examination;

public interface ExaminationRepository extends JpaRepository<Examination, Integer> {

}