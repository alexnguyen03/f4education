package com.f4education.springjwt.controllers;

import java.net.URI;
import java.util.ArrayList;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.servlet.support.ServletUriComponentsBuilder;

import com.f4education.springjwt.payload.request.BillDetailRequestDTO;
import com.f4education.springjwt.payload.response.BillDetailResponseDTO;
import com.f4education.springjwt.security.services.BillDetailServiceImp;

@CrossOrigin("*")
@RestController
@RequestMapping("/api/bill-detail")
public class BillDetailController {
	@Autowired
	BillDetailServiceImp billDetailServiceImp;

	@GetMapping
	public ResponseEntity<?> findAll() {
		List<BillDetailResponseDTO> lst = billDetailServiceImp.getAllBillDetail();
		return ResponseEntity.ok(lst);
	}

	@GetMapping("/{id}")
	public ResponseEntity<?> findByBillDetailId(@PathVariable("id") Integer id) {
		if (id == null) {
			return ResponseEntity.badRequest().build();
		} else {
			BillDetailResponseDTO bill = billDetailServiceImp.getBillDetailById(id);

			if (bill == null) {
				return ResponseEntity.noContent().build();
			}

			return ResponseEntity.ok(bill);
		}
	}

	@PostMapping
	public ResponseEntity<?> createBillDetail(@RequestBody List<BillDetailRequestDTO> billRequest) {

		if (billRequest == null) {
			return ResponseEntity.badRequest().body("Invalid request data");
		}

		List<BillDetailResponseDTO> billDetailResp = new ArrayList<>();
		List<URI> uriList = new ArrayList<>();
		for (BillDetailRequestDTO billRequestDTO : billRequest) {
			BillDetailResponseDTO billDetail = billDetailServiceImp.createBillDetail(billRequestDTO);
			billDetailResp.add(billDetail);
			URI uri = ServletUriComponentsBuilder.fromCurrentRequest().path("/{billDetailId}")
					.buildAndExpand(billDetail.getBillDetailId()).toUri();
			uriList.add(uri);
		}

		if (uriList.isEmpty()) {
			return ResponseEntity.badRequest().build();
		}

		HttpHeaders headers = new HttpHeaders();
		headers.setLocation(uriList.get((uriList.size() - 1)));

		return new ResponseEntity<>(billDetailResp, headers, HttpStatus.CREATED);
	}
}
