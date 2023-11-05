package com.f4education.springjwt.security.services;

import java.util.Date;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.f4education.springjwt.interfaces.EvaluateService;
import com.f4education.springjwt.models.Evaluate;
import com.f4education.springjwt.models.RegisterCourse;
import com.f4education.springjwt.models.Student;
import com.f4education.springjwt.payload.request.EvaluateRequestDTO;
import com.f4education.springjwt.payload.response.EvaluateResponse;
import com.f4education.springjwt.repository.EvaluateRepository;
import com.f4education.springjwt.repository.RegisterCourseRepository;
import com.f4education.springjwt.repository.StudentRepository;

@Service
public class EvaluateServiceImpl implements EvaluateService {
	@Autowired
	EvaluateRepository evaluateRepository;

	@Autowired
	StudentRepository studentRepository;

	@Autowired
	RegisterCourseRepository registerCourseRepository;

	@Override
	public List<EvaluateResponse> getAllEvaluate() {
		List<Evaluate> evaluateLst = evaluateRepository.findAll();
		return evaluateLst.stream().map(this::convertToQuestionResponse).collect(Collectors.toList());
	}

	@Override
	public List<EvaluateResponse> getAllEvaluateByCourseId(Integer courseId) {
		List<Evaluate> evaluateLst = evaluateRepository.findAllEvaluateByCourseId(courseId);
		return evaluateLst.stream().map(this::convertToQuestionResponse).collect(Collectors.toList());
	}

	@Override
	public EvaluateResponse getEvaluateById(Integer evaluateId) {
		Optional<Evaluate> existingEvaluate = evaluateRepository.findById(evaluateId);

		if (existingEvaluate.isPresent()) {
			return this.convertToQuestionResponse(existingEvaluate.get());
		}

		return null;
	}

	@Override
	public EvaluateResponse createEvaluate(EvaluateRequestDTO evaluateDTO) {
		Evaluate evaluate = this.convertRequestToEntity(evaluateDTO);

		if (evaluate != null) {
			evaluate.setReviewDate(new Date());

			Evaluate saveEvaluate = evaluateRepository.save(evaluate);
			return this.convertToQuestionResponse(saveEvaluate);
		}

		return null;
	}

	@Override
	public EvaluateResponse updateEvaluateDTO(Integer evaluateId, EvaluateRequestDTO evaluateDTO) {
		Optional<Evaluate> existingEvaluate = evaluateRepository.findById(evaluateId);

		if (existingEvaluate.isPresent()) {
			Evaluate newEvaluate = existingEvaluate.get();

			this.convertRequestToEntity(evaluateDTO, newEvaluate);

			Evaluate updateEvaluate = evaluateRepository.save(newEvaluate);
			return this.convertToQuestionResponse(updateEvaluate);
		}

		return null;
	}

	@Override
	public void deleteEvaluateDTO(Integer evaluateId) {
		evaluateRepository.deleteById(evaluateId);
	}

	private Evaluate convertRequestToEntity(EvaluateRequestDTO evaluateRequest) {
		Evaluate evaluate = new Evaluate();

		Optional<Student> student = studentRepository.findById(evaluateRequest.getStudentId());
		Optional<RegisterCourse> registerCourse = registerCourseRepository
				.findById(evaluateRequest.getRegisterCourseId());

		if (student.isPresent()) {
			evaluate.setStudent(student.get());
		} else {
			System.out.println("student null");
		}

		if (registerCourse.isPresent()) {
			evaluate.setRegisterCourse(registerCourse.get());
		} else {
			System.out.println("register course null");
		}

		evaluate.setContents(evaluateRequest.getContent());
		evaluate.setRating(evaluateRequest.getRating());

		return evaluate;
	}

	private void convertRequestToEntity(EvaluateRequestDTO evaluateRequest, Evaluate evaluate) {
		Optional<Student> student = studentRepository.findById(evaluateRequest.getStudentId());
		Optional<RegisterCourse> registerCourse = registerCourseRepository
				.findById(evaluateRequest.getRegisterCourseId());

		if (student.isPresent()) {
			evaluate.setStudent(student.get());
		} else {
			System.out.println("student null");
		}

		if (registerCourse.isPresent()) {
			evaluate.setRegisterCourse(registerCourse.get());
		} else {
			System.out.println("register course null");
		}

		evaluate.setContents(evaluateRequest.getContent());
		evaluate.setRating(evaluateRequest.getRating());
	}

	private EvaluateResponse convertToQuestionResponse(Evaluate evaluate) {
		EvaluateResponse evaluateResponse = new EvaluateResponse();

		evaluateResponse.setContent(evaluate.getContents());
		evaluateResponse.setRating(evaluate.getRating());
		evaluateResponse.setStudentName(evaluate.getStudent().getFullname());
		evaluateResponse.setStudentImage(evaluate.getStudent().getImage());
		evaluateResponse.setRegisterCourse(evaluate.getRegisterCourse());
		evaluateResponse.setEvaluateId(evaluate.getEvaluateId());
		evaluateResponse.setReviewDate(evaluate.getReviewDate());

		return evaluateResponse;
	}

}
