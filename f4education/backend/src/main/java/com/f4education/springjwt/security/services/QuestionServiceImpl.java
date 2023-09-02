package com.f4education.springjwt.security.services;

import java.util.List;
import java.util.stream.Collectors;

import org.springframework.beans.BeanUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.f4education.springjwt.interfaces.QuestionService;
import com.f4education.springjwt.models.Question;
import com.f4education.springjwt.payload.request.QuestionDTO;
import com.f4education.springjwt.repository.QuestionReposotory;

@Service
public class QuestionServiceImpl implements QuestionService {
	@Autowired
	QuestionReposotory questionReposotory;

	@Override
	public List<QuestionDTO> getAllQuestion() {
		List<Question> question = questionReposotory.findAll();
		return question.stream().map(this::convertToDto).collect(Collectors.toList());
	}

	@Override
	public QuestionDTO getQuestionById(Integer questionId) {
		// TODO Auto-generated method stub
		return null;
	}

	@Override
	public QuestionDTO createQuestion(QuestionDTO questionDTO) {
		// TODO Auto-generated method stub
		return null;
	}

	@Override
	public QuestionDTO updateQuestion(Integer questionId, QuestionDTO questionDTO) {
		// TODO Auto-generated method stub
		return null;
	}

	private QuestionDTO convertToDto(Question question) {
		QuestionDTO questionDTO = new QuestionDTO();
		questionDTO.setCourseName(question.getCourse().getCourseName());
		questionDTO.setAdminName(question.getAdmin().getFullname());
		BeanUtils.copyProperties(question, questionDTO);
		return questionDTO;
	}

	private void convertToEntity(QuestionDTO questionDTO, Question question) {
		BeanUtils.copyProperties(questionDTO, question);
	}

}
