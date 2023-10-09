package com.f4education.springjwt.repository;

import com.f4education.springjwt.models.BillDetail;
import org.springframework.data.jpa.repository.JpaRepository;

public interface BillDetailRepository extends JpaRepository<BillDetail, Integer> {
}