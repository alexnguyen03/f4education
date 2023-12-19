package com.f4education.springjwt.controllers;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RequestPart;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

import com.f4education.springjwt.interfaces.CertificateService;
import com.f4education.springjwt.interfaces.MailerService;
import com.f4education.springjwt.models.Certificate;
import com.f4education.springjwt.payload.request.CertificateDTO;
import com.f4education.springjwt.payload.response.CertificateResponse;
import com.f4education.springjwt.repository.CertificateRepository;

@CrossOrigin("*")
@RestController
@RequestMapping("/api/certificate")
public class CertificateController {
    @Autowired
    CertificateService certificateService;

    @Autowired
    CertificateRepository certificateRepository;

    @Autowired
    MailerService mailService;

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
    public ResponseEntity<?> createCertificate(@RequestBody List<CertificateDTO> certificateDTO) {
        if (certificateDTO == null) {
            return ResponseEntity.badRequest().body("Invalid request data");
        }

        List<CertificateResponse> certificate = new ArrayList<>();

        certificateDTO.forEach(item -> {
            System.out.println(item);
            certificate.add(certificateService.createCertificatet(item));
        });

        return ResponseEntity.ok(certificate);
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

    @PostMapping(value = "/teacher/download", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<String> handleFileUpload(@RequestParam("files") List<MultipartFile> files,
            @RequestParam List<Integer> certificateIds) {
        try {

            for (int i = 0; i < files.size(); i++) {
                MultipartFile file = files.get(i);
                Integer certificateId = certificateIds.get(i);
                System.out.println(file);
                System.out.println(certificateId);

                Optional<Certificate> existCt = certificateRepository.findById(certificateId);

                if (existCt.isPresent()) {
                    // for production
                    String[] listMail = {
                            existCt.get().getRegisterCourse().getStudent().getUser().getEmail() };

                    // for testing
                    // namnhpc03517@fpt.edu.vn
                    // String[] listMail = { "hienttpc03323@fpt.edu.vn", "" };

                    byte[] fileBytes = file.getBytes();
                    mailService.queueCertificate(listMail, "", "", null,
                            existCt.get().getRegisterCourse().getCourse().getCourseName(),
                            "http://localhost:3000/pdf/certificate/download?certificateId="
                                    + existCt.get().getCertificateId(),
                            fileBytes);
                }
            }

            return ResponseEntity.ok("File uploaded successfully!");
        } catch (

        Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(500).body("Error uploading file: " + e.getMessage());
        }
    }

}
