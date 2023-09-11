package com.f4education.springjwt.security.services;

import com.f4education.springjwt.interfaces.AdminService;
import com.f4education.springjwt.interfaces.AnswerService;
import com.f4education.springjwt.interfaces.SubjectService;
import com.f4education.springjwt.models.Admin;
import com.f4education.springjwt.models.Answer;
import com.f4education.springjwt.models.Question;
import com.f4education.springjwt.models.Subject;
import com.f4education.springjwt.payload.request.AnswerDTO;
import com.f4education.springjwt.payload.request.QuestionDTO;
import com.f4education.springjwt.repository.AdminRepository;
import com.f4education.springjwt.repository.AnswerReposotory;
import com.f4education.springjwt.repository.QuestionReposotory;
import com.f4education.springjwt.repository.SubjectRepository;
import org.springframework.beans.BeanUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.Date;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class AnswerServiceImpl implements AnswerService {
	@Autowired
	private AnswerReposotory answerReposotory;

	@Autowired
	private QuestionReposotory questionRepository;

	@Override
	public List<AnswerDTO> getAllAnswer() {
		List<Answer> answer = answerReposotory.findAll();
		return answer.stream().map(this::convertToDto).collect(Collectors.toList());
	}

	@Override
	public AnswerDTO getAnswerById(Integer questionId) {

		return null;
	}

	@Override
	public AnswerDTO createAnswer(AnswerDTO answerDTO) {
		Answer answer = this.convertToEntity(answerDTO);
		Answer newAnswer = answerReposotory.save(answer);
		return convertToDto(newAnswer);
	}

	@Override
	public AnswerDTO updateAnswer(Integer questionId, AnswerDTO AnswerDTO) {
		return null;
	}

	private AnswerDTO convertToDto(Answer answer) {
		AnswerDTO answerDTO = new AnswerDTO();
		answerDTO.setQuestionId(answer.getQuestion().getQuestionId());
		BeanUtils.copyProperties(answer, answerDTO);
		return answerDTO;
	}

	private Answer convertToEntity(AnswerDTO answerDTO) {
		Answer answer = new Answer();
		BeanUtils.copyProperties(answerDTO, answer);
		Question question = questionRepository.findById(answerDTO.getQuestionId()).get();
		answer.setText(answerDTO.getText());
		answer.setIsCorrect(answerDTO.isCorrect());
		answer.setQuestion(question);
		return answer;
	}
}
