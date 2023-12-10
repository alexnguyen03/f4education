package com.f4education.springjwt.interfaces;

import java.util.List;

import com.f4education.springjwt.models.User;
import com.f4education.springjwt.payload.request.AccountDTO;

public interface AccountService {
    List<AccountDTO> getAllAccountsDTO();

    List<AccountDTO> getAllAccountsDTOByRole(Integer role);

    AccountDTO createAccount(AccountDTO accountDTO);

    AccountDTO updateAccount(AccountDTO accountDTO);

    Boolean existsByEmail(String email);

    User findByEmail(String email);

    User save(User user);
}
