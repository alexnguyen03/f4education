package com.f4education.springjwt.security.services;

import java.util.List;

import org.springframework.beans.BeanUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.f4education.springjwt.interfaces.TeacherHistoryService;
import com.f4education.springjwt.models.TeacherHistory;
import com.f4education.springjwt.payload.request.TeacherHistoryDTO;
import com.f4education.springjwt.repository.TeacherHistoryRepository;
import com.f4education.springjwt.repository.UserRepository;

@Service
public class TeacherHistoryServiceImpl implements TeacherHistoryService {

    @Autowired
    private TeacherHistoryRepository teacherHistoryRepository;

    @Autowired
    private UserRepository userRepository;

    private void convertToEntity(TeacherHistoryDTO teacherHistoryDTO, TeacherHistory teacherHistory) {
        BeanUtils.copyProperties(teacherHistoryDTO, teacherHistory);
    }

    @Override
    public List<TeacherHistoryDTO> getAllTeacherHistorysDTO() {
        return teacherHistoryRepository.getAllTeacherHistorysDTO();
    }

    @Override
    public List<TeacherHistoryDTO> getTeacherHistoryDTOByID(String teacherHistoryId) {
        return teacherHistoryRepository.getTeacherHistoryDTOByID(teacherHistoryId);
    }

    @Override
    public TeacherHistoryDTO createTeacherHistory(TeacherHistoryDTO teacherHistoryDTO) {
        
        return null;
    }
}
