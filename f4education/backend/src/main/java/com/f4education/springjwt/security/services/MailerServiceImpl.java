package com.f4education.springjwt.security.services;

import java.io.File;
import java.text.SimpleDateFormat;
import java.util.ArrayList;
import java.util.Date;
import java.util.List;
import java.util.Base64;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;

import com.f4education.springjwt.interfaces.MailerService;
import com.f4education.springjwt.models.MailInfo;
import com.f4education.springjwt.models.Task;

import jakarta.mail.MessagingException;
import jakarta.mail.internet.MimeMessage;

@Service
public class MailerServiceImpl implements MailerService {
	List<MailInfo> list = new ArrayList<>();

	@Autowired
	JavaMailSender sender;

	@Override
	public void send(MailInfo mail) throws MessagingException {
		// Tạo message
		MimeMessage message = sender.createMimeMessage();
		// Sử dụng Helper để thiết lập các thông tin cần thiết cho message
		MimeMessageHelper helper = new MimeMessageHelper(message, true, "utf-8");
		helper.setFrom(mail.getFrom());
		helper.setTo(mail.getTo());
		helper.setSubject(mail.getSubject());
		helper.setText(mail.getBody(), true);
		helper.setReplyTo(mail.getFrom());
		String[] cc = mail.getCc();
		if (cc != null && cc.length > 0) {
			helper.setCc(cc);
		}
		String[] bcc = mail.getBcc();
		if (bcc != null && bcc.length > 0) {
			helper.setBcc(bcc);
		}
		String[] attachments = mail.getAttachments();
		if (attachments != null && attachments.length > 0) {
			for (String path : attachments) {
				File file = new File(path);
				helper.addAttachment(file.getName(), file);
			}
		}
		// Gửi message đến SMTP server
		sender.send(message);
	}

	@Override
	public void send(String[] to, String subject, String body) throws MessagingException {
		this.send(new MailInfo(to, subject, body));
	}

	@Override
	public void queue(MailInfo mail) {
		list.add(mail);
		System.out.println();
	}

	@Override
	public void queue(String[] to, String subject, String body, Date date) {
		String link = "http://localhost:3000/client-register/" + to;
		body = ""
				+ "<div style=\"font-family: Helvetica,Arial,sans-serif;min-width:1000px;overflow:auto;line-height:2\">\n"
				+ "  <div style=\"margin:50px auto;width:70%;padding:20px 0\">\n"
				+ "    <div style=\"border-bottom:1px solid #eee\">\n" + "      <a href='" + link // ! Linh website
				+ "' style=\"font-size:1.4em;color: #00466a;text-decoration:none;font-weight:600\">F4 EDUCATION</a>\n"
				+ "    </div>\n" + "    <p style=\"font-size:1.1em\">Xin chào,</p>\n"
				+ "    <p>Cảm ơn bạn đã tin tưởng lựa chọn cửa hàng của chúng tôi</p>\n"
				+ "    <h2 style=\"background: #00466a;margin: 0 auto;width: max-content;padding: 0 10px;color: #fff;border-radius: 4px;\">Chào mừng bạn đã đến với thế giới bánh ngọt</h2>\n"
				+ "    <p style=\"font-size:0.9em;\">Trân trọng,<br />F4 EDUCATION</p>\n"
				+ "    <hr style=\"border:none;border-top:1px solid #eee\" />\n"
				+ "    <div style=\"float:right;padding:8px 0;color:#aaa;font-size:0.8em;line-height:1;font-weight:300\">\n"
				+ "      <p>Team 6</p>\n" + "      <p>123, Đường Nguyễn Văn Linh, TP.Cần Thơ</p>\n"
				+ "      <p>Việt Nam</p>\n" + "    </div>\n" + "  </div>\n" + "</div>";
		subject = "Thư chào mừng";
		queue(new MailInfo(to, subject, body, date));
	}

	@Override
	public void queue(String to, String subject, String body, Date date) {
		String encodedEmail = Base64.getEncoder().encodeToString(to.getBytes());
		String link = "http://localhost:3000/client-register/" + encodedEmail;
		body = ""
				+ "<div style=\"font-family: Helvetica,Arial,sans-serif;min-width:1000px;overflow:auto;line-height:2\">\n"
				+ "  <div style=\"margin:50px auto;width:70%;padding:20px 0\">\n"
				+ "    <div style=\"border-bottom:1px solid #eee\">\n" + "      <a href='" + link // ! Linh website
				+ "' style=\"font-size:1.4em;color: #00466a;text-decoration:none;font-weight:600\">F4 EDUCATION</a>\n"
				+ "    </div>\n" + "    <p style=\"font-size:1.1em\">Xin chào,</p>\n"
				+ "    <p>Cảm ơn bạn đã tin tưởng lựa chọn cửa hàng của chúng tôi</p>\n"
				+ "    <h2 style=\"background: #00466a;margin: 0 auto;width: max-content;padding: 0 10px;color: #fff;border-radius: 4px;\">Chào mừng bạn đã đến với thế giới bánh ngọt</h2>\n"
				+ "    <p style=\"font-size:0.9em;\">Trân trọng,<br />F4 EDUCATION</p>\n"
				+ "    <hr style=\"border:none;border-top:1px solid #eee\" />\n"
				+ "    <div style=\"float:right;padding:8px 0;color:#aaa;font-size:0.8em;line-height:1;font-weight:300\">\n"
				+ "      <p>Team 6</p>\n" + "      <p>123, Đường Nguyễn Văn Linh, TP.Cần Thơ</p>\n"
				+ "      <p>Việt Nam</p>\n" + "    </div>\n" + "  </div>\n" + "</div>";
		subject = "Thư chào mừng";
		queue(new MailInfo(to, subject, body, date));
	}

	@Override
	public void queue(String to, String subject, String body, Date date, int OTP) {
		body = ""
				+ "<div style=\"font-family: Helvetica,Arial,sans-serif;min-width:1000px;overflow:auto;line-height:2\">\n"
				+ "  <div style=\"margin:50px auto;width:70%;padding:20px 0\">\n"
				+ "    <div style=\"border-bottom:1px solid #eee\">\n" + "      <a href='" // ! Linh website
				+ "' style=\"font-size:1.4em;color: #00466a;text-decoration:none;font-weight:600\">F4 EDUCATION</a>\n"
				+ "    </div>\n" + "    <p style=\"font-size:1.1em\">Xin chào,</p>\n"
				+ "    <p>Cảm ơn bạn đã tin tưởng lựa chọn cửa hàng của chúng tôi</p>\n"
				+ "    <h2 style=\"background: #00466a;margin: 0 auto;width: max-content;padding: 0 10px;color: #fff;border-radius: 4px;\">"
				+ OTP + "</h2>\n"
				+ "    <p style=\"font-size:0.9em;\">Trân trọng,<br />F4 EDUCATION</p>\n"
				+ "    <hr style=\"border:none;border-top:1px solid #eee\" />\n"
				+ "    <div style=\"float:right;padding:8px 0;color:#aaa;font-size:0.8em;line-height:1;font-weight:300\">\n"
				+ "      <p>Team 6</p>\n" + "      <p>123, Đường Nguyễn Văn Linh, TP.Cần Thơ</p>\n"
				+ "      <p>Việt Nam</p>\n" + "    </div>\n" + "  </div>\n" + "</div>";
		subject = "Thư chào mừng";
		queue(new MailInfo(to, subject, body, date));
	}

	@Override
	public void queueAttendance(String[] to, String subject, String body, Integer absentCount, Integer totalCount,
			String isPassed, Date date) {
		String link = "http://localhost:3000/student/classes";
		body = ""
				+ "<div style=\"font-family: Helvetica,Arial,sans-serif;min-width:1000px;overflow:auto;line-height:2\">\n"
				+ "  <div style=\"margin:50px auto;width:70%;padding:20px 0\">\n"
				+ "    <div style=\"border-bottom:1px solid #eee\">\n" + "      <a href='" + link// ! Linh website
				+ "' style=\"font-size:1.4em;color: #00466a;text-decoration:none;font-weight:600\">F4 EDUCATION CENTER</a>\n"
				+ "    </div>\n" + " <p>Cảnh báo bạn đã vắng điểm danh vào ngày " + formatDate(date) + "</p>\n"
				+ "    <h2 style=\"background: #00466a;margin: 0 auto;width: max-content;padding: 0 10px;color: #fff;border-radius: 4px;\">"
				+ "    Bạn đã vắng " + absentCount + "/" + totalCount + " buổi học</h2>\n"
				+ "<p style=\"color:red;font-size:1.2em;\">"
				+ isPassed + "</p>" + "    <p style=\"font-size:0.9em;\">Trân trọng,<br />F4 EDUCATION</p>\n"
				+ "    <hr style=\"border:none;border-top:1px solid #eee\" />\n"
				+ "    <div style=\"float:right;padding:8px 0;color:#aaa;font-size:0.8em;line-height:1;font-weight:300\">\n"
				+ "      <p>Team Bộ tứ siêu đẳng</p>\n" + "      <p>123, Đường Nguyễn Văn Linh, TP.Cần Thơ</p>\n"
				+ "      <p>Việt Nam</p>\n" + "    </div>\n" + "  </div>\n" + "</div>";
		subject = "Cảnh báo vắng điểm danh";
		queue(new MailInfo(to, subject, body, date));
	}

	private String formatDate(Date date) {
		SimpleDateFormat sdf = new SimpleDateFormat("dd-MM-yyyy HH:mm:ss");
		String formattedDate = sdf.format(date);
		return formattedDate;
	}

	@Scheduled(fixedDelay = 5000)
	public void run() {
		if (!list.isEmpty()) {

			for (int i = 0; i < list.size(); i++) {
				MailInfo mail = list.get(i);
				if (mail.getDate() == null) {
					list.remove(i);
					sendMail(mail);
					System.out.println("Đã gửi mail");
				} else {
					Date date = new Date();
					if (date.after(mail.getDate())) {
						sendMail(mail);
						list.remove(i);
						System.out.println("Đã gửi mail có ngày");
					}
				}
			}
		}
	}

	private boolean sendMail(MailInfo mail) {
		try {
			this.send(mail);
			return true;
		} catch (Exception e) {
			e.printStackTrace();
			return false;
		}
	}

	@Override
	public void mailNewTask(String to, String subject, String body, Date date, Task task) {
		// ! Xử lý gửi mail khi mới giao bài tập
	}

	@Override
	public void mailUpdateTask(String to, String subject, String body, Date date, Task oldTask, Task newTask) {
		// ! Xử lý gửi mail khi có sự thay đổi giao bài tập
	}

}
