package com.f4education.springjwt.security.services;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;

import com.f4education.springjwt.interfaces.DetailPointService;
import com.f4education.springjwt.models.DetailPoint;
import com.f4education.springjwt.repository.DetailPointRepository;

public class DetailPointServiceImpl implements DetailPointService {

    @Autowired
    DetailPointRepository detailPointRepository;

    @Override
    public DetailPoint findById(Integer detailPointId) {

        return detailPointRepository.findById(detailPointId).get();
    }

    @Override
    public List<DetailPoint> findAllByPointId(Integer pointId) {
        // TODO Auto-generated method stub
        throw new UnsupportedOperationException("Unimplemented method 'findAllByPointId'");
    }

    @Override
    public List<DetailPoint> findAll() {
        return detailPointRepository.findAll();
    }

    @Override
    public DetailPoint save(DetailPoint detailPoint) {
        return detailPointRepository.save(detailPoint);
    }

}
