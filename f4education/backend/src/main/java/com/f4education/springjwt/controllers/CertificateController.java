package com.f4education.springjwt.controllers;

import java.net.URI;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.servlet.support.ServletUriComponentsBuilder;

import com.f4education.springjwt.interfaces.CertificateService;
import com.f4education.springjwt.payload.request.CertificateDTO;
import com.f4education.springjwt.payload.response.CertificateResponse;

@CrossOrigin("*")
@RestController
@RequestMapping("/api/certificate")
public class CertificateController {
	@Autowired
	CertificateService certificateService;

	@GetMapping
	public ResponseEntity<?> findAll() {
		List<CertificateResponse> lst = certificateService.getAllCertificate();
		return ResponseEntity.ok(lst);
	}

	@GetMapping("/student/{studentId}")
	public ResponseEntity<?> findCertificateByStudentID(@PathVariable("studentId") String studentId) {
		List<CertificateResponse> lst = certificateService.findAllCertificateByStudentId(studentId);
		return ResponseEntity.ok(lst);
	}

	@GetMapping("/{certificateId}")
	public ResponseEntity<?> getCertificatetByCertificateId(@PathVariable("certificateId") Integer certificateId) {
		CertificateResponse lst = certificateService.getCertificatetByCertificateId(certificateId);
		return ResponseEntity.ok(lst);
	}

	@GetMapping("/pdf")
	public ResponseEntity<?> findCertificateByRegisterCourseIdAndStudentId(
			@RequestParam("registerCourseId") Integer registerCourseId, @RequestParam("studentId") String studentId) {
		CertificateResponse lst = certificateService.findCertificateByRegisterCourseAndStudentId(registerCourseId,
				studentId);

		System.out.println("List findBy registerCourseID: " + lst);

		if (lst == null) {
			return ResponseEntity.noContent().build();
		}

		return ResponseEntity.ok(lst);
	}

	@PostMapping
	public ResponseEntity<?> createCertificate(@RequestBody CertificateDTO certificateDTO) {
		if (certificateDTO == null) {
			return ResponseEntity.badRequest().body("Invalid request data");
		}

		CertificateResponse certificate = certificateService.createCertificatet(certificateDTO);

		if (certificate == null) {
			return ResponseEntity.badRequest().build();
		}

		// create URI
		URI uri = ServletUriComponentsBuilder.fromCurrentRequest().path("/{certificateId}")
				.buildAndExpand(certificate.getCertificateId()).toUri();

		return ResponseEntity.created(uri).body(certificate);
	}

	@DeleteMapping("/{certificateId}")
	public ResponseEntity<?> deleteCertificate(@PathVariable("certificateId") Integer certificateId) {

		if (certificateId == null) {
			return ResponseEntity.badRequest().build();
		} else {

			certificateService.deleteCertificatet(certificateId);

			return ResponseEntity.status(HttpStatus.NO_CONTENT).body("Certificate have been delete");
		}
	}

}
