package com.f4education.springjwt.security.services;

import java.util.List;

import org.modelmapper.ModelMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.f4education.springjwt.interfaces.AccountService;
import com.f4education.springjwt.models.Account_role;
import com.f4education.springjwt.models.Admin;
import com.f4education.springjwt.models.Role;
import com.f4education.springjwt.models.Student;
import com.f4education.springjwt.models.Teacher;
import com.f4education.springjwt.models.User;
import com.f4education.springjwt.payload.request.AccountDTO;
import com.f4education.springjwt.repository.Account_roleRepository;
import com.f4education.springjwt.repository.AdminRepository;
import com.f4education.springjwt.repository.RoleRepository;
import com.f4education.springjwt.repository.StudentRepository;
import com.f4education.springjwt.repository.TeacherRepository;
import com.f4education.springjwt.repository.UserRepository;

@Service
public class AccountServiceImpl implements AccountService {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private TeacherRepository teacherRepository;

    @Autowired
    private AdminRepository adminRepository;

    @Autowired
    private StudentRepository studentRepository;

    @Autowired
    private RoleRepository roleRepository;

    @Autowired
    private Account_roleRepository account_roleRepository;

    private User convertToEntity(AccountDTO accountDTO, User user, boolean create) {
        ModelMapper modelMapper = new ModelMapper();
        modelMapper.map(accountDTO, user);
        User userSaved = userRepository.save(user);
        // if (userSaved == null) {
        // userSaved = userRepository.findByID(accountDTO.getId());
        // }
        // ! Role == 3 có vai trò là admin
        if (accountDTO.getRoles() == 3) {
            if (create) {
                Role role = roleRepository.findById(3).get();
                Account_role account_role = new Account_role(role, userSaved);
                account_roleRepository.save(account_role);
                Admin admin = accountDTO.getAdmin();
                admin.setUser(userSaved);
                adminRepository.save(admin);
            } else {
                Admin info = userSaved.getAdmins().get(0);
                Admin admin = accountDTO.getAdmin();
                modelMapper.map(admin, info);
                info.setUser(userSaved);
                adminRepository.save(info);
            }

        } else {
            // ! Role == 2 có vai trò là giảng viên
            if (accountDTO.getRoles() == 2) {
                if (create) {
                    Role role = roleRepository.findById(2).get();
                    Account_role account_role = new Account_role(role, userSaved);
                    account_roleRepository.save(account_role);
                    Teacher teacher = accountDTO.getTeacher();
                    teacher.setUser(userSaved);
                    teacherRepository.save(teacher);
                } else {
                    Teacher info = userSaved.getTeachers().get(0);
                    Teacher teacher = accountDTO.getTeacher();
                    modelMapper.map(teacher, info);
                    info.setUser(userSaved);
                    teacherRepository.save(info);
                }

            } else { // ! Role còn lại mặc định là student
                if (create) {
                    Role role = roleRepository.findById(1).get();
                    Account_role account_role = new Account_role(role, userSaved);
                    account_roleRepository.save(account_role);
                    Student student = accountDTO.getStudent();
                    student.setUser(userSaved);
                    studentRepository.save(student);
                } else {
                    Student info = userSaved.getStudents().get(0);
                    Student teacher = accountDTO.getStudent();
                    modelMapper.map(teacher, info);
                    info.setUser(userSaved);
                    studentRepository.save(info);
                }
            }
        }
        return user;
    }

    @Override
    public List<AccountDTO> getAllAccountsDTO() {
        return userRepository.getAllAcountsDTO();
    }

    @Override
    public List<AccountDTO> getAllAccountsDTOByRole(Integer role) {
        List<AccountDTO> list = userRepository.getAllAccountsDTOByRole(role);
        return list;
    }

    @Override
    public AccountDTO updateAccount(AccountDTO accountDTO) {
        User userdb = userRepository.findByID(accountDTO.getId());
        User user = convertToEntity(accountDTO, userdb, false);
        return new AccountDTO(user);
    }

    @Override
    public AccountDTO createAccount(AccountDTO accountDTO) {
        User userdb = new User();
        User user = convertToEntity(accountDTO, userdb, true);
        return new AccountDTO(user);
    }

    @Override
    public Boolean existsByEmail(String email) {
        return userRepository.existsByEmail(email);
    }
}
