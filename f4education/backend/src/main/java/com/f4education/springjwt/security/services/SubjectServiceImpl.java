package com.f4education.springjwt.security.services;

import java.util.Date;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

import org.springframework.beans.BeanUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.f4education.springjwt.interfaces.AdminService;
import com.f4education.springjwt.interfaces.SubjectService;
import com.f4education.springjwt.models.Admin;
import com.f4education.springjwt.models.Bill;
import com.f4education.springjwt.models.ClassRoom;
import com.f4education.springjwt.models.ClassRoomHistory;
import com.f4education.springjwt.models.PaymentMethod;
import com.f4education.springjwt.models.Student;
import com.f4education.springjwt.models.Subject;
import com.f4education.springjwt.models.SubjectHistory;
import com.f4education.springjwt.payload.request.BillRequestDTO;
import com.f4education.springjwt.payload.request.SubjectDTO;
import com.f4education.springjwt.repository.AdminRepository;
import com.f4education.springjwt.repository.SubjectHistoryRepository;
import com.f4education.springjwt.repository.SubjectRepository;

@Service
public class SubjectServiceImpl implements SubjectService {
	@Autowired
	private SubjectRepository subjectRepository;

	@Autowired
	private AdminRepository adminRepository;

	@Autowired
	private SubjectHistoryRepository subjectHistoryRepository;

	@Override
	public List<SubjectDTO> getAllSubjects() {
		return subjectRepository.findAll().stream().map(this::convertToResponseDTO).collect(Collectors.toList());
	}

	@Override
	public SubjectDTO getSubjectById(Integer subjectId) {
		Optional<Subject> subjectOptional = subjectRepository.findById(subjectId);
		if (subjectOptional.isPresent()) {
			Subject subjet = subjectOptional.get();
			return this.convertToResponseDTO(subjet);
		}
		return null;
	}

	@Override
	public SubjectDTO createSubject(SubjectDTO subjectDTO) {
		Subject subject = this.convertRequestToEntity(subjectDTO);

		subject.setCreateDate(new Date());

		Subject savedSubject = subjectRepository.save(subject);

		this.saveSubjectHistory(savedSubject, "CREATE");
		return this.convertToResponseDTO(savedSubject);
	}

	@Override
	public SubjectDTO updateSubject(Integer subjectId, SubjectDTO subjectDTO) {
		Optional<Subject> exitsubject = subjectRepository.findById(subjectId);

		if (exitsubject.isPresent()) {
			Subject subject = exitsubject.get();

			subject.setSubjectName(subjectDTO.getSubjectName());

			Subject updateSubject = subjectRepository.save(subject);

			this.saveSubjectHistory(updateSubject, "UPDATE");
			return this.convertToResponseDTO(updateSubject);
		}
		return null;
	}

	private SubjectDTO convertToResponseDTO(Subject subject) {
		SubjectDTO subjectDTO = new SubjectDTO();

		String adminId = subject.getAdmin().getAdminId();

		BeanUtils.copyProperties(subject, subjectDTO);

		subjectDTO.setAdminId(adminId);
		subjectDTO.setCreateDate(subject.getCreateDate());

		return subjectDTO;
	}

	private Subject convertRequestToEntity(SubjectDTO subjectDTO) {
		Subject subject = new Subject();

		Admin admin = adminRepository.findById(subjectDTO.getAdminId()).get();

		BeanUtils.copyProperties(subjectDTO, subject);

		subject.setSubjectName(subjectDTO.getSubjectName());
		subject.setAdmin(admin);

		return subject;
	}

	private void saveSubjectHistory(Subject subject, String action) {
		SubjectHistory subjectHistory = new SubjectHistory();
		BeanUtils.copyProperties(subject, subjectHistory);
		subjectHistory.setSubject(subject);
		subjectHistory.setAction(action);
		subjectHistory.setModifyDate(new Date());
		subjectHistory.setSubjectName(subject.getSubjectName());
		subjectHistory.setAdmin(subject.getAdmin());
		subjectHistoryRepository.save(subjectHistory);
	}
}
