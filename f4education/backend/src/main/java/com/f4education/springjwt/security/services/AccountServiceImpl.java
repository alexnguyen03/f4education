package com.f4education.springjwt.security.services;

import java.io.Serializable;
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
        Serializable info = null;
        if (accountDTO.getRoles() == 3) {
            List<Admin> admins = new ArrayList<Admin>();
            info = user.getAdmins().get(0);
            admins.add(accountDTO.getAdmin());
            accountDTO.setAdmins(admins);
        } else {
            if (accountDTO.getRoles() == 2) {
                List<Teacher> teachers = new ArrayList<Teacher>();
                info = user.getTeachers().get(0);
                teachers.add(accountDTO.getTeacher());
                accountDTO.setTeachers(teachers);
            } else {
                List<Student> students = new ArrayList<Student>();
                info = user.getStudents().get(0);
                students.add(accountDTO.getStudent());
                accountDTO.setStudents(students);
            }
        }
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
