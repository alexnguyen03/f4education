package com.f4education.springjwt.interfaces;

import java.util.List;

import com.f4education.springjwt.models.Classes;
import com.f4education.springjwt.payload.request.ClassDTO;
import com.f4education.springjwt.payload.request.ClassHistoryDTO;

public interface ClassHistoryService {
    List<ClassHistoryDTO> findAll();
}
