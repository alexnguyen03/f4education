package com.f4education.springjwt.controllers;

import java.io.File;
import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.crypto.password.PasswordEncoder;
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
import com.f4education.springjwt.models.Admin;
import com.f4education.springjwt.models.Student;
import com.f4education.springjwt.models.Teacher;

import com.f4education.springjwt.payload.request.AccountDTO;
import com.f4education.springjwt.payload.response.MessageResponse;
import com.f4education.springjwt.security.services.MailerServiceImpl;
import com.f4education.springjwt.ultils.XFile;
import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;

import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;

@CrossOrigin("*")
@RestController
@RequestMapping("/api/accounts")
@RequiredArgsConstructor
public class AccountController {

    @Autowired
    private AccountService accountService;

    @Autowired
    XFile xfileService;

    @Autowired
    PasswordEncoder encoder;

    @Autowired
    MailerServiceImpl mailer;

    @GetMapping
    @PreAuthorize("hasRole('ADMIN')")
    public List<AccountDTO> getAllAccountsDTO() {
        return accountService.getAllAccountsDTO();
    }

    @GetMapping("/{role}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<?> getByRole(@PathVariable("role") Integer role) {
        List<AccountDTO> list = accountService.getAllAccountsDTOByRole(role);
        return ResponseEntity.ok(list);
    }

    @PutMapping(value = "", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<?> updateSubject(@RequestPart("request") String teacherRequestString,
            @RequestParam("file") Optional<MultipartFile> file) {
        AccountDTO accountDTO = changeImg(teacherRequestString, file, false);
        return ResponseEntity.ok(accountService.updateAccount(accountDTO));
    }

    @PostMapping(value = "", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    // @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<?> createAccount(@RequestPart("request") String teacherRequestString,
            @RequestParam("file") Optional<MultipartFile> file) {
        AccountDTO accountDTO = changeImg(teacherRequestString, file, true);
        Boolean checkEmailExit = accountService.existsByEmail(accountDTO.getEmail().trim());

        if (checkEmailExit) {
            return ResponseEntity
                    .badRequest()
                    .body(new MessageResponse("1"));
        }
        // return ResponseEntity.ok(null);
        return ResponseEntity.ok(accountService.createAccount(accountDTO));
    }

    @PostMapping(value = "/checkEmail")
    public ResponseEntity<?> checkMail(@RequestBody AccountDTO accountDTO) {
        Boolean checkEmailExit = accountService.existsByEmail(accountDTO.getEmail().trim());
        if (checkEmailExit) {
            return ResponseEntity
                    .badRequest()
                    .body(new MessageResponse("1"));
        }
        List<String> mails = null;
        mails.add(accountDTO.getEmail());

        String[] mail = mails.toArray(new String[0]);
        mailer.queue(mail, "", "", null);
        return ResponseEntity.ok().body(new MessageResponse("2"));
    }

    // ! Chuyển đổi json sang DTO và set img vào DTO nếu có file có tồn tại
    private AccountDTO changeImg(String teacherRequestString, Optional<MultipartFile> file, boolean create) {
        ObjectMapper mapper = new ObjectMapper();
        AccountDTO accountDTO = new AccountDTO();
        try {
            accountDTO = mapper.readValue(teacherRequestString,
                    AccountDTO.class);
            File savedFile = null;
            String id = null;
            try {
                id = accountDTO.getEmail().substring(0, accountDTO.getEmail().indexOf("@"));
            } catch (Exception e) {

            }
            accountDTO.setUsername(id);
            if (create) {
                accountDTO.setPassword(encoder.encode(accountDTO.getPassword()));
            }

            if (file.isPresent()) {
                if (!file.isEmpty()) {
                    savedFile = xfileService.save(file.orElse(null), "/courses");
                }
            }
            switch (accountDTO.getRoles()) {
                // ! Role = 3 có vai trò là Admin
                case 3:
                    Admin admin = accountDTO.getAdmin();
                    if (savedFile != null) {
                        admin.setImage(savedFile.getName());
                    }
                    if (create) {
                        admin.setAdminId(id);
                    }
                    accountDTO.setAdmin(admin);
                    break;

                // ! Role = 2 có vai trò là giảng viên
                case 2:
                    Teacher teacher = accountDTO.getTeacher();
                    if (savedFile != null) {
                        teacher.setImage(savedFile.getName());
                    }
                    if (create) {
                        teacher.setTeacherId(id);
                    }
                    accountDTO.setTeacher(teacher);
                    break;

                // ! Default có vai trò là học viên viên
                default:
                    Student student = accountDTO.getStudent();
                    if (savedFile != null) {
                        student.setImage(savedFile.getName());
                    }
                    if (create) {
                        student.setStudentId(id);
                    }
                    accountDTO.setStudent(student);
                    break;
            }

        } catch (JsonProcessingException e) {
            e.printStackTrace();
        }
        return accountDTO;
    }
}
