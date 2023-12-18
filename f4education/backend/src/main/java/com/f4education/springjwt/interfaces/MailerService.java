package com.f4education.springjwt.interfaces;

import java.util.Date;
import java.util.List;

import com.f4education.springjwt.models.Classes;
import com.f4education.springjwt.models.MailInfo;
import com.f4education.springjwt.models.Task;

import jakarta.mail.MessagingException;

public interface MailerService {
	/**
	 * Gửi email
	 * 
	 * @param mail thông tin email
	 * @throws MessagingException lỗi gửi email
	 */
	void send(MailInfo mail) throws MessagingException;

	/**
	 * Gửi email đơn giản
	 * 
	 * @param to      email người nhận
	 * @param subject tiêu đề email
	 * @param body    nội dung email
	 * @throws MessagingException lỗi gửi email
	 */
	void send(String[] to, String subject, String body) throws MessagingException;

	void sendWhenClassSeted(String[] to, String className, String courseName, String teacherName,
			String teacherId);

	void sendToTeacherWhenClassSeted(String[] to, String className, String courseName);

	void sendMailWithAttachment(String[] to, String subject, String body, byte[] file) throws MessagingException;

	/**
	 * Xếp mail vào hàng đợi
	 * 
	 * @param mail thông tin email
	 */
	void queue(MailInfo mail);

	/**
	 * Tạo MailInfo và xếp vào hàng đợi
	 * 
	 * @param to      email người nhận
	 * @param subject tiêu đề email
	 * @param body    nội dung email
	 */
	void queue(String[] to, String subject, String body, Date date);

	void queue(String to, String subject, String body, Date date);

	void sendEmailForRegsiter(String to, String subject, String body, Date date, int OTP);

	void queueAttendance(String[] to, String subject, String body, Integer absentCount, Integer totalCount,
			String isPassed, Date date);

	void queueCertificate(String[] to, String subject, String body, Date date, String courseName, String link,
			byte[] pdfFile);

	void mailNewTask(String to[], String subject, String body, Date date, Task task);

	void mailUpdateTask(String to[], String subject, String body, Date date, Task oldTask, Task newTask);

	void mailNewSchedule(String to[], String subject, String body, Date date, Classes classes);

	void mailUpdateSchedule(String to[], String subject, String body, Date date, Classes classes);
}
