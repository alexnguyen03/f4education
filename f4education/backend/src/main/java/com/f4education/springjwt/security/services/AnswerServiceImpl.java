package com.f4education.springjwt.security.services;

import java.util.List;
import java.util.stream.Collectors;

import org.springframework.beans.BeanUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.f4education.springjwt.interfaces.AnswerService;
import com.f4education.springjwt.models.Answer;
import com.f4education.springjwt.models.QuestionDetail;
import com.f4education.springjwt.payload.request.AnswerDTO;
import com.f4education.springjwt.repository.AnswerReposotory;
import com.f4education.springjwt.repository.QuestionDetailReposotory;

@Service
public class AnswerServiceImpl implements AnswerService {
    @Autowired
    private AnswerReposotory answerReposotory;

    @Autowired
    private QuestionDetailReposotory questionRepository;

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
        Answer answer = new Answer();

        convertToEntity(answerDTO, answer);

        Answer newAnswer = answerReposotory.save(answer);
        return convertToDto(newAnswer);
    }

    @Override
    public AnswerDTO updateAnswer(Integer answerId, AnswerDTO answerDTO) {
        Answer exitAnswer = answerReposotory.findById(answerId).get();

        convertToEntity(answerDTO, exitAnswer);

        Answer updateAnswer = answerReposotory.save(exitAnswer);
        return convertToDto(updateAnswer);
    }

    private AnswerDTO convertToDto(Answer answer) {
        AnswerDTO answerDTO = new AnswerDTO();

        answerDTO.setIsCorrect(answer.getIsCorrect());
        answerDTO.setQuestionId(answer.getQuestionDetail().getQuestionDetailId());

        BeanUtils.copyProperties(answer, answerDTO);
        return answerDTO;
    }

    private void convertToEntity(AnswerDTO answerDTO, Answer answer) {
        QuestionDetail question = new QuestionDetail();

        if (answerDTO.getQuestionId() == null) {
            Integer questionId = questionRepository.getMaxQuestionId();
            question = questionRepository.findById(questionId).get();
        }
        answer.setIsCorrect(answerDTO.getIsCorrect());
        answer.setQuestionDetail(question);
        answer.setText(answerDTO.getText());
    }
}
