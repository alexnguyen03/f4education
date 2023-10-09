package com.f4education.springjwt.security.services;

import java.util.List;

import org.springframework.beans.BeanUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.f4education.springjwt.interfaces.AccountService;
import com.f4education.springjwt.models.User;
import com.f4education.springjwt.payload.request.AccountDTO;
import com.f4education.springjwt.payload.request.UserDTO;
import com.f4education.springjwt.repository.UserRepository;

@Service
public class AccountServiceImpl implements AccountService {

    @Autowired
    private UserRepository userRepository;

    private void convertToEntity(UserDTO userDTO, User user) {
        BeanUtils.copyProperties(userDTO, user);
    }

    @Override
    public List<AccountDTO> getAllAccountsDTO() {
        return userRepository.getAllAcountsDTO();
    }
}
