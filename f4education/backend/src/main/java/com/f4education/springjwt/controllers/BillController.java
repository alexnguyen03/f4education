package com.f4education.springjwt.controllers;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.f4education.springjwt.payload.response.BillResponseDTO;
import com.f4education.springjwt.security.services.BillServiceImp;

@CrossOrigin("*")
@RestController
@RequestMapping("/api/bills")
public class BillController {
	@Autowired
	BillServiceImp billService;

	@GetMapping
	public List<BillResponseDTO> findAll() {
		return billService.getAllBill();
	}
}
