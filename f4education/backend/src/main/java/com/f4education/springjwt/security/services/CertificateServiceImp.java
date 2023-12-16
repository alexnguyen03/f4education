package com.f4education.springjwt.security.services;

import java.util.Date;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

import org.springframework.beans.BeanUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.f4education.springjwt.interfaces.CertificateService;
import com.f4education.springjwt.models.Certificate;
import com.f4education.springjwt.models.RegisterCourse;
import com.f4education.springjwt.payload.request.CertificateDTO;
import com.f4education.springjwt.payload.response.CertificateResponse;
import com.f4education.springjwt.repository.CertificateRepository;
import com.f4education.springjwt.repository.RegisterCourseRepository;

@Service
public class CertificateServiceImp implements CertificateService {
	@Autowired
	private CertificateRepository certificateRepository;

	@Autowired
	private RegisterCourseRepository registerCourseRepository;

	@Autowired
	MailerServiceImpl mailer;

	@Override
	public List<CertificateResponse> getAllCertificate() {
		return certificateRepository.findAll().stream().map(this::convertToReponseDTO).collect(Collectors.toList());
	}

	@Override
	public List<CertificateResponse> findAllCertificateByStudentId(String studentId) {
		return certificateRepository.findAllByStudenId(studentId).stream().map(this::convertToReponseDTO)
				.collect(Collectors.toList());
	}

	@Override
	public CertificateResponse findCertificateByRegisterCourseAndStudentId(Integer registerCourseId, String studentId) {
		Certificate certificate = certificateRepository.findAllByRegisterCourseIdAndStudenId(registerCourseId,
				studentId);

		if (certificate != null) {
			return this.convertToReponseDTO(certificate);
		}
		return null;
	}

	@Override
	public CertificateResponse getCertificatetByCertificateId(Integer certificateId) {
		Optional<Certificate> certificate = certificateRepository.findById(certificateId);

		if (certificate.isPresent()) {
			return this.convertToReponseDTO(certificate.get());
		}

		return null;
	}

	@Override
	public CertificateResponse createCertificatet(CertificateDTO certificateDTO) {
		Certificate certificate = this.convertRequestToEntity(certificateDTO);
		certificate.setCreateDate(new Date());
		certificate.setStartDate(new Date());
		certificate.setEndDate(new Date());

		Certificate newCertificate = certificateRepository.save(certificate);

//		For production
//		String[] listMail = { student.get().getUser().getEmail() };

//		For testing
//		String[] listMail = { "hienttpc03323@fpt.edu.vn" };

//		mailer.queueCertificate(listMail, "", "", null, newCertificate.getRegisterCourse().getCourse().getCourseName(),
//				"http://localhost:3000/pdf/certificate/download?certificateId=" + newCertificate.getCertificateId());

		return this.convertToReponseDTO(newCertificate);
	}

	@Override
	public CertificateResponse deleteCertificatet(Integer certificateId) {
		Optional<Certificate> certificate = certificateRepository.findById(certificateId);

		if (certificate.isPresent()) {
			certificateRepository.delete(certificate.get());
		}

		return null;
	}

	private CertificateResponse convertToReponseDTO(Certificate certificate) {
		CertificateResponse certificateResponse = new CertificateResponse();

		BeanUtils.copyProperties(certificate, certificateResponse);

		certificateResponse.setStudentId(certificate.getRegisterCourse().getStudent().getStudentId());
		certificateResponse.setStudentName(certificate.getRegisterCourse().getStudent().getFullname());

		return certificateResponse;
	}

	private Certificate convertRequestToEntity(CertificateDTO certificateDTO) {
		Certificate certificate = new Certificate();

		RegisterCourse registerCourse = registerCourseRepository.findById(certificateDTO.getRegisterCourseId()).get();

		BeanUtils.copyProperties(certificateDTO, certificate);

		certificate.setRegisterCourse(registerCourse);
		certificate.setCertificateName(certificateDTO.getCertificateName());

		return certificate;
	}

}