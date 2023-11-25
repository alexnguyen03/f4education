package com.f4education.springjwt.interfaces;

import java.util.List;

import com.f4education.springjwt.payload.request.ProgressDTO;

public interface ProgressService {

    public List<ProgressDTO> getAllProgress(Integer classId);
    
}