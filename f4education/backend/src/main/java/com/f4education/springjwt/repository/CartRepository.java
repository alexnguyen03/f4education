package com.f4education.springjwt.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import com.f4education.springjwt.models.Cart;

public interface CartRepository extends JpaRepository<Cart, Integer> {
	List<Cart> findAllByStatus(boolean status);

	@Query("SELECT c FROM Cart c WHERE c.student.studentId = :studentId AND c.status = :status")
	List<Cart> findByStudentIdAndStatus(@Param("studentId") String studentId, @Param("status") boolean status);
}