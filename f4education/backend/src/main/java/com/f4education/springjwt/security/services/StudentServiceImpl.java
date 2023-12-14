package com.f4education.springjwt.security.services;

import java.util.ArrayList;
import java.util.List;

import org.springframework.beans.BeanUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.f4education.springjwt.interfaces.StudentService;
import com.f4education.springjwt.models.Classes;
import com.f4education.springjwt.models.Student;
import com.f4education.springjwt.models.Task;
import com.f4education.springjwt.payload.request.StudentDTO;
import com.f4education.springjwt.repository.GoogleDriveRepository;
import com.f4education.springjwt.repository.StudentRepository;
import com.f4education.springjwt.repository.TaskRepository;

@Service
public class StudentServiceImpl implements StudentService {

	@Autowired
	StudentRepository studentRepository;

	@Autowired
	GoogleDriveRepository googleDriveRepository;

	@Autowired
	private TaskRepository taskRepository;

	@Override
	public Student findByUserId(String userId) {
		// TODO Auto-generated method stub
		throw new UnsupportedOperationException("Unimplemented method 'findByUserId'");
	}

	@Override
	public StudentDTO getStudentDTOByID(String studentId) {
		return convertEntityToDTO(studentRepository.getStudentDTOByID(studentId));
	}

	@Override
	public StudentDTO updateStudent(StudentDTO studentDTO) {
		Student student = studentRepository.findById(studentDTO.getStudentId()).get();
		Long oldId = student.getUser().getId();
		String oldName = student.getFullname();
		String newName = studentDTO.getFullname();
		List<Task> listTask = taskRepository.findAll();
		List<Classes> listClass = new ArrayList<>();
		for (Task task : listTask) {
			listClass.add(task.getClasses());
		}
		convertToEntity(studentDTO, student);
		if (!oldName.equals(newName)) {
			String linkFoler = null;
			for (Task task : listTask) {
				for (Classes c : listClass) {
					linkFoler = "Tasks/" + c.getClassName() + "/" + task.getTitle() + "/" + oldId + " - " + oldName;
				}
				try {
					String idFolder = googleDriveRepository.getFolderIdNoCreate(linkFoler);
					System.out.println(idFolder);
					if (idFolder != null) {
						googleDriveRepository.renameFolderById(idFolder,  student.getUser().getId() + " - " + newName);
					} else {
						System.out.println("Folder does not exist: " + idFolder);
					}
				} catch (Exception e) {
					System.out.println(e);
				}
			}
		}
		studentRepository.save(student);
		return convertEntityToDTO(student);
	}

	private void convertToEntity(StudentDTO studentDTO, Student student) {
		BeanUtils.copyProperties(studentDTO, student);
	}

	private StudentDTO convertEntityToDTO(Student student) {
		return new StudentDTO(student.getStudentId(), student.getFullname(), student.getGender(), student.getAddress(),
				student.getPhone(), student.getImage());
	}

	@Override
	public Student findById(String studentId) {
		return studentRepository.findById(studentId).get();
	}
}
