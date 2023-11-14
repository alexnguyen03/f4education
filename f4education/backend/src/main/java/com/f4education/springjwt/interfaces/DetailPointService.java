package com.f4education.springjwt.interfaces;

import java.util.List;

import org.springframework.stereotype.Service;

import com.f4education.springjwt.models.DetailPoint;

@Service
public interface DetailPointService {
    public DetailPoint findById(Integer detailPointId);

    public DetailPoint save(DetailPoint detailPoint);

    public List<DetailPoint> findAllByPointId(Integer pointId);

    public List<DetailPoint> findAll();

}
