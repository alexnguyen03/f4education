package com.f4education.springjwt.interfaces;

import java.util.List;

import org.springframework.stereotype.Service;

import com.f4education.springjwt.payload.request.CertificateDTO;
import com.f4education.springjwt.payload.response.CertificateResponse;

@Service
public interface CertificateService {
	List<CertificateResponse> getAllCertificate();

	List<CertificateResponse> findAllCertificateByStudentId(String studentId);

	CertificateResponse findCertificateByRegisterCourseAndStudentId(Integer registerCourse, String studentId);

	CertificateResponse getCertificatetByCertificateId(Integer certificateId);

	CertificateResponse createCertificatet(CertificateDTO certificateDTO);

	CertificateResponse deleteCertificatet(Integer certificateId);
}
