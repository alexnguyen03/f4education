package com.f4education.springjwt.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import com.f4education.springjwt.models.Cart;

public interface CartRepository extends JpaRepository<Cart, Integer> {
	List<Cart> findAllByStatus(boolean status);
}