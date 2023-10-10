package com.f4education.springjwt.controllers;

import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.MediaType;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RequestPart;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

import com.f4education.springjwt.interfaces.AccountService;
import com.f4education.springjwt.payload.request.AccountDTO;
import com.f4education.springjwt.ultils.XFile;
import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;

import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.PutMapping;

@CrossOrigin("*")
@RestController
@RequestMapping("/api/accounts")
@RequiredArgsConstructor
public class AccountController {

    @Autowired
    private AccountService accountService;

    @Autowired
    XFile xfileService;

    @GetMapping
    @PreAuthorize("hasRole('ADMIN')")
    public List<AccountDTO> getAllAccountsDTO() {
        return accountService.getAllAccountsDTO();
    }

    @GetMapping("/{role}")
    @PreAuthorize("hasRole('ADMIN')")
    public List<AccountDTO> getByRole(@PathVariable("role") Integer role) {
        return accountService.getAllAccountsDTOByRole(role);
    }

    @PutMapping(value = "", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    @PreAuthorize("hasRole('ADMIN')")
    public AccountDTO updateSubject(@RequestPart("teacherRequest") String teacherRequestString,
            @RequestParam("file") Optional<MultipartFile> file) {
        ObjectMapper mapper = new ObjectMapper();
        AccountDTO accountDTO = new AccountDTO();
        try {
            accountDTO = mapper.readValue(teacherRequestString,
                    AccountDTO.class);
            // if (file.isPresent()) {
            // if (!file.isEmpty()) {
            // File savedFile = xfileService.save(file.get(), "/courses");
            // switch (accountDTO.getRoles()) {
            // case 3:
            // Admin admin = accountDTO.getAdmins();
            // admin.setImage(savedFile.getName());
            // accountDTO.setAdmins(admin);
            // break;

            // case 2:
            // Teacher teacher = accountDTO.getTeachers();
            // teacher.setImage(savedFile.getName());
            // accountDTO.setTeachers(teacher);
            // break;

            // default:
            // Student student = accountDTO.getStudents();
            // student.setImage(savedFile.getName());
            // accountDTO.setStudents(student);
            // break;
            // }

            // }
            // }
        } catch (JsonProcessingException e) {
            e.printStackTrace();
        }
        return accountService.updateAccount(accountDTO);
    }

    @PostMapping(value = "", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    // @PreAuthorize("hasRole('ADMIN')")
    public AccountDTO createAccount(@RequestPart("teacherRequest") String teacherRequestString,
            @RequestParam("file") Optional<MultipartFile> file) {
        ObjectMapper mapper = new ObjectMapper();
        AccountDTO accountDTO = new AccountDTO();
        try {
            accountDTO = mapper.readValue(teacherRequestString,
                    AccountDTO.class);
            // if (file.isPresent()) {
            // if (!file.isEmpty()) {
            // File savedFile = xfileService.save(file.get(), "/courses");
            // switch (accountDTO.getRoles()) {
            // // ! 3 có vai trò admin
            // case 3:
            // Admin admin = accountDTO.getAdmins();
            // admin.setImage(savedFile.getName());
            // accountDTO.setAdmins(admin);
            // break;
            // // ! 2 có vai trò là student
            // case 2:
            // Teacher teacher = accountDTO.getTeachers();
            // teacher.setImage(savedFile.getName());
            // accountDTO.setTeachers(teacher);
            // break;
            // // ! default là học viên
            // default:
            // Student student = accountDTO.getStudents();
            // student.setImage(savedFile.getName());
            // accountDTO.setStudents(student);
            // break;
            // }

            // }
            // }
        } catch (JsonProcessingException e) {
            e.printStackTrace();
        }
        return accountService.updateAccount(accountDTO);
    }

}
