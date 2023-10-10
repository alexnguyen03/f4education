package com.f4education.springjwt.interfaces;

import java.util.List;

import com.f4education.springjwt.payload.request.AccountDTO;
import com.f4education.springjwt.payload.request.TeacherDTO;

public interface AccountService {
    List<AccountDTO> getAllAccountsDTO();

    // TeacherDTO getTeacherDTOByID(String teacherId);

    // TeacherDTO createTeacher(TeacherDTO teacherDTO);

    // TeacherDTO updateTeacher(TeacherDTO teacherDTO);
}
