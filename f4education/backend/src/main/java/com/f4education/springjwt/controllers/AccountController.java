package com.f4education.springjwt.controllers;

import java.io.File;
import java.io.IOException;
import java.util.ArrayList;
import java.util.Date;
import java.util.List;
import java.util.Optional;
import java.util.Random;

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
import com.f4education.springjwt.payload.request.OTP;
import com.f4education.springjwt.payload.response.MessageResponse;
import com.f4education.springjwt.security.services.FirebaseStorageService;
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
    FirebaseStorageService firebaseStorageService;

    @Autowired
    PasswordEncoder encoder;

    @Autowired
    MailerServiceImpl mailer;

    private List<OTP> list = new ArrayList<OTP>();

    private int randomOTP() {
        Random random = new Random();
        return random.nextInt(9000) + 1000;
    }

    private OTP udpateOTP(OTP otp, boolean udpateOTP) {
        for (int i = 0; i < list.size(); i++) {
            OTP otp2 = list.get(i);
            Date now = new Date();

            Long timeDifference = null;
            try {
                timeDifference = Math.abs((now.getTime() - otp2.getDate().getTime()) / 1000);
            } catch (Exception e) {
            }
            if (timeDifference != null && timeDifference > 60) {
                list.remove(i);
            } else {
                if (otp2.getEmail().equals(otp.getEmail())) {
                    if (udpateOTP) {
                        list.set(i, otp);
                        otp2 = otp;
                    }
                    return otp2;
                }
            }
        }
        return null;
    }

    @PostMapping(value = "/checkEmailForPassWord") // ! Kiểm tra mail đúng chưa và gửi OTP
    public ResponseEntity<?> checkMailForPassWord(@RequestBody OTP otp) {

        // ! kiểm tra xem email đó có tồn tại hay không?
        Boolean checkEmailExit = accountService.existsByEmail(otp.getEmail().trim());
        if (!checkEmailExit) {// ! email chưa đăng ký tài khoản nào
            return ResponseEntity
                    .badRequest()
                    .body("1");
        }

        // ! kiểm tra OTP
        int code = randomOTP();
        OTP otpNew = new OTP(otp.getEmail().trim(), code, new Date());// tạo OTP mới để cập nhật
        OTP otpUpdate = udpateOTP(otpNew, true);

        if (otpUpdate == null) {
            list.add(otpNew);
            otpUpdate = otpNew;
        }

        // ! Gửi mail cho người dùng
        String mail = otpUpdate.getEmail().toString();
        mailer.queue(mail, "", "", null, otpUpdate.getCodeOTP()); // ! Gửi mail có OTP
        return ResponseEntity.ok().body(otpUpdate);
    }

    @PostMapping(value = "/checkOTPForPassWord") // ! Kiểm tra mail đúng chưa và gửi OTP
    public ResponseEntity<?> checkOTPForPassWord(@RequestBody OTP otp) {
        OTP otpUpdate = udpateOTP(otp, false);
        Date now = new Date();
        if (((now.getTime() - otpUpdate.getDate().getTime()) / 1000) > 60) {// ! đã qua 60s, OTP đã hết hạn sử dụng
            return ResponseEntity
                    .badRequest()
                    .body(1);// ! dead OTP
        } else {
            if (otpUpdate.getCodeOTP() != otp.getCodeOTP()) {
                return ResponseEntity
                        .badRequest()
                        .body(2);// ! wrong OTP
            }
        }
        return ResponseEntity.ok().body(null);
    }

    @GetMapping
    @PreAuthorize("hasRole('ADMIN')")
    public List<AccountDTO> getAllAccountsDTO() {
        return accountService.getAllAccountsDTO();
    }

    // ! Lấy tất cả tài khoản dựa vào role
    @GetMapping("/{role}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<?> getByRole(@PathVariable("role") Integer role) {
        List<AccountDTO> list = accountService.getAllAccountsDTOByRole(role);
        return ResponseEntity.ok(list);
    }

    // ! Cập nhật tài khoản
    @PutMapping(value = "", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<?> updateAccount(@RequestPart("request") String teacherRequestString,
            @RequestParam("file") Optional<MultipartFile> file) {
        AccountDTO accountDTO = changeImg(teacherRequestString, file, false);
        return ResponseEntity.ok(accountService.updateAccount(accountDTO));
    }

    // ! Tạo tài khoản
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

    // ! Kiểm tra mail có tồn tại hay chưa
    @PostMapping(value = "/checkEmail")
    public ResponseEntity<?> checkMail(@RequestBody AccountDTO accountDTO) {
        Boolean checkEmailExit = accountService.existsByEmail(accountDTO.getEmail().trim());
        if (checkEmailExit) {
            return ResponseEntity
                    .badRequest()
                    .body(new MessageResponse("1"));
        }
        String mail = accountDTO.getEmail().toString();
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

            String savedFile = null;
            String id = null;
            try {
                id = accountDTO.getEmail().substring(0, accountDTO.getEmail().indexOf("@"));
            } catch (Exception e) {
                e.printStackTrace();
            }
            accountDTO.setUsername(id);
            if (create) {
                accountDTO.setPassword(encoder.encode(accountDTO.getPassword()));
            }

            if (file.isPresent()) {
                if (!file.isEmpty()) {
                    try {
                        savedFile = firebaseStorageService.uploadImage(file.orElse(null),
                                "accounts/", accountDTO.getUsername().trim());

                    } catch (IOException e) {
                        // TODO Auto-generated catch block
                        e.printStackTrace();
                    }

                }

            }
            switch (accountDTO.getRoles()) {
                // ! Role = 3 có vai trò là Admin
                case 3:
                    Admin admin = accountDTO.getAdmin();
                    if (savedFile != null) {
                        admin.setImage(accountDTO.getUsername());
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
                        teacher.setImage(accountDTO.getUsername());
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
                        student.setImage(accountDTO.getUsername());
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
