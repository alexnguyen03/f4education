package com.f4education.springjwt.interfaces;

import java.text.ParseException;
import java.util.Date;
import java.util.List;

import com.f4education.springjwt.payload.request.CourseDTO;
import com.f4education.springjwt.payload.request.CourseRequest;
import com.f4education.springjwt.payload.request.ReportCourseCountStudentCertificateDTO;
import com.f4education.springjwt.payload.request.ReportCourseCountStudentDTO;
import com.f4education.springjwt.payload.response.CourseResponse;

public interface CoursesService {
	List<CourseResponse> findAllCourseDTO(String studentId);

	List<CourseResponse> findNewestCourse(String studentId);

	CourseResponse findCourseByCourseId(Integer courseId, String studentId);

	List<CourseResponse> findTop10SoldCourse(String studentId);

	CourseDTO findById(Integer id);

	Boolean isCourseNameExist(String courseName);

	CourseDTO saveCourse(CourseRequest courseRequest);

	List<CourseDTO> findAllByAdminId(String adminId);

	List<CourseDTO> findBySubjectNames(List<String> subjectNames);

	List<CourseDTO> findByThoiLuongInRange(List<String> checkedDurations);

	List<CourseDTO> findAllCourseDTOByStudentId(String studentId);

	List<CourseDTO> getCourseBySubjectName(String subjectName);

	List<String> getAllCourseContentByClassId(Integer classId);

	String renameFolder(String folderName, String newFolderName) throws Exception;

	List<ReportCourseCountStudentDTO> getCoursesWithStudentCount();

	List<ReportCourseCountStudentCertificateDTO> getCoursesWithStudentCountCertificate();
}
