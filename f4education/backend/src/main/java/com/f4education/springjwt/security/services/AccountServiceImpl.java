package com.f4education.springjwt.security.services;

import java.util.ArrayList;
import java.util.List;

import org.modelmapper.ModelMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.f4education.springjwt.interfaces.AccountService;
import com.f4education.springjwt.models.Admin;
import com.f4education.springjwt.models.Student;
import com.f4education.springjwt.models.Teacher;
import com.f4education.springjwt.models.User;
import com.f4education.springjwt.payload.request.AccountDTO;
import com.f4education.springjwt.repository.UserRepository;

@Service
public class AccountServiceImpl implements AccountService {

    @Autowired
    private UserRepository userRepository;

    private User convertToEntity(AccountDTO accountDTO, User user) {
        ModelMapper modelMapper = new ModelMapper();
        modelMapper.map(accountDTO, user);
        return user;
    }

    @Override
    public List<AccountDTO> getAllAccountsDTO() {
        return userRepository.getAllAcountsDTO();
    }

    @Override
    public List<AccountDTO> getAllAccountsDTOByRole(Integer role) {
        return userRepository.getAllAccountsDTOByRole(role);
    }

    @Override
    public AccountDTO updateAccount(AccountDTO accountDTO) {
        User userdb = userRepository.findById(accountDTO.getId()).get();

        if (accountDTO.getRoles() == 3) {
            List<Admin> admins = new ArrayList<Admin>();
            admins.add(accountDTO.getAdmin());
            accountDTO.setAdmins(admins);
        } else {
            if (accountDTO.getRoles() == 2) {
                List<Teacher> teachers = new ArrayList<Teacher>();
                teachers.add(accountDTO.getTeacher());
                accountDTO.setTeachers(teachers);
            } else {
                List<Student> students = new ArrayList<Student>();
                students.add(accountDTO.getStudent());
                accountDTO.setStudents(students);
            }
        }
        User user = convertToEntity(accountDTO, userdb);
        userRepository.save(user);
        return new AccountDTO(user);

    }

    @Override
    public AccountDTO createAccount(AccountDTO accountDTO) {
        // TODO Auto-generated method stub
        throw new UnsupportedOperationException("Unimplemented method 'updateAccount'");
    }
}
