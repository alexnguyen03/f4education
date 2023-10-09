package com.f4education.springjwt.controllers;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.f4education.springjwt.interfaces.AccountService;
import com.f4education.springjwt.payload.request.AccountDTO;

import lombok.RequiredArgsConstructor;

@CrossOrigin("*")
@RestController
@RequestMapping("/api/accounts")
@RequiredArgsConstructor
public class AccountController {

    @Autowired
    private AccountService accountService;

    @GetMapping
    // @PreAuthorize("hasRole('ADMIN')")
    public List<AccountDTO> getAllAccountsDTO() {
        return accountService.getAllAccountsDTO();
    }
}
