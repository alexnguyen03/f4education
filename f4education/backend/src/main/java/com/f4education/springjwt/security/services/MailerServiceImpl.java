package com.f4education.springjwt.security.services;

import java.io.File;
import java.text.SimpleDateFormat;
import java.util.ArrayList;
import java.util.Base64;
import java.util.Date;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.io.ByteArrayResource;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;

import com.f4education.springjwt.interfaces.MailerService;
import com.f4education.springjwt.models.Classes;
import com.f4education.springjwt.models.MailInfo;
import com.f4education.springjwt.models.Task;
import com.f4education.springjwt.repository.ClassRepository;

import jakarta.mail.MessagingException;
import jakarta.mail.internet.InternetAddress;
import jakarta.mail.internet.MimeMessage;

@Service
public class MailerServiceImpl implements MailerService {
	List<MailInfo> list = new ArrayList<>();

	@Autowired
	JavaMailSender sender;

	@Autowired
	ClassRepository classesRepository;

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
		helper.setReplyTo("noreply@f4education.sp.com");
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

		// if (mail.getPdfFile() != null) {
		// try {
		// // Tạo phần nội dung của email và thêm vào email
		// MimeBodyPart messageBodyPart = new MimeBodyPart();
		// Multipart multipart = new MimeMultipart();
		// multipart.addBodyPart(messageBodyPart);
		//
		// // Tạo phần đính kèm từ mảng byte và thêm vào email
		// MimeBodyPart attachmentBodyPart = new MimeBodyPart();
		// attachmentBodyPart.setContent(mail.getPdfFile(), "application/pdf");
		// attachmentBodyPart.setFileName("my_pdf.pdf");
		// multipart.addBodyPart(attachmentBodyPart);
		//
		// message.setContent(multipart);
		// } catch (Exception e) {
		// e.printStackTrace();
		// }
		// }

		// Attach the PDF file
		if (mail.getPdfFile() != null) {
			try {
				helper.addAttachment("document.pdf", new ByteArrayResource(mail.getPdfFile()));
			} catch (Exception e) {
				e.printStackTrace();
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
	public void sendMailWithAttachment(String[] to, String subject, String body, byte[] pdfFile)
			throws MessagingException {
		this.send(new MailInfo(to, subject, body, pdfFile));
	}

	@Override
	public void queue(MailInfo mail) {
		list.add(mail);
		System.out.println("Mail has already added!");
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
				+ OTP + "</h2>\n" + "    <p style=\"font-size:0.9em;\">Trân trọng,<br />F4 EDUCATION</p>\n"
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
				+ "    </div>\n" + " <p>Cảnh báo bạn đã vắng điểm danh vào ngày " + formatDateTime(date) + "</p>\n"
				+ "    <h2 style=\"background: #00466a;margin: 0 auto;width: max-content;padding: 0 10px;color: #fff;border-radius: 4px;\">"
				+ "    Bạn đã vắng " + absentCount + "/" + totalCount + " buổi học</h2>\n"
				+ "<p style=\"color:red;font-size:1.2em;\">" + isPassed + "</p>"
				+ "    <p style=\"font-size:0.9em;\">Trân trọng,<br />F4 EDUCATION</p>\n"
				+ "    <hr style=\"border:none;border-top:1px solid #eee\" />\n"
				+ "    <div style=\"float:right;padding:8px 0;color:#aaa;font-size:0.8em;line-height:1;font-weight:300\">\n"
				+ "      <p>Team Bộ tứ siêu đẳng</p>\n" + "      <p>123, Đường Nguyễn Văn Linh, TP.Cần Thơ</p>\n"
				+ "      <p>Việt Nam</p>\n" + "    </div>\n" + "  </div>\n" + "</div>";
		subject = "Cảnh báo vắng điểm danh";
		queue(new MailInfo(to, subject, body, date));
	}

	@Override
	public void queueCertificate(String[] to, String subject, String body, Date date, String courseName, String link,
			byte[] pdfFile) {
		String href = link;
		body = ""
				+ "<div style=\"font-family: Helvetica,Arial,sans-serif;min-width:1000px;overflow:auto;line-height:2\">\n"
				+ "  <div style=\"margin:50px auto;width:70%;padding:20px 0\">\n"
				+ "    <div style=\"border-bottom:1px solid #eee\">\n" + "      <a href='" + link//
				+ "' style=\"font-size:1.4em;color: #00466a;text-decoration:none;font-weight:600\">F4 EDUCATION CENTER</a>\n"
				+ "    </div>\n" + " <p>Nhận chứng chỉ khóa học " + courseName + "</p>\n"
				+ "<h2 style=\"background: #00466a;margin: 0 auto;width: max-content;padding: 0 10px;color: #fff;border-radius: 4px;\">"
				+ "    <a href='" + href
				+ "' style=\"color: #fff;text-decoration: none;\">Nhấn vào đây để nhận chứng chỉ</a></h2>\n"
				+ "		<p style=\"color:#000;font-size:1em;\">Xin cảm ơn bạn đã đồng hành cùng chúng tôi!</p>"
				+ "    <p style=\"font-size:0.9em;\">Trân trọng,<br />F4 EDUCATION</p>\n"
				+ "    <hr style=\"border:none;border-top:1px solid #eee\" />\n"
				+ "    <div style=\"float:right;padding:8px 0;color:#aaa;font-size:0.8em;line-height:1;font-weight:300\">\n"
				+ "      <p>Team Bộ tứ siêu đẳng</p>\n" + "      <p>123, Đường Nguyễn Văn Linh, TP.Cần Thơ</p>\n"
				+ "      <p>Việt Nam</p>\n" + "    </div>\n" + "  </div>\n" + "</div>";
		subject = "Thư chúc mừng hoàn thành khóa học";
		queue(new MailInfo(to, subject, body, pdfFile));
	}

	private String formatDateTime(Date date) {
		SimpleDateFormat sdf = new SimpleDateFormat("dd-MM-yyyy HH:mm:ss");
		String formattedDate = sdf.format(date);
		return formattedDate;
	}

	private String formatDate(Date date) {
		SimpleDateFormat sdf = new SimpleDateFormat("dd-MM-yyyy");
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
	public void mailNewTask(String to[], String subject, String body, Date date, Task task) {
		// ! Xử lý gửi mail khi mới giao bài tập
		String link = "http://localhost:3000/student/classes";
		body = "<div style=\"font-family: Helvetica,Arial,sans-serif;min-width:1000px;overflow:auto;line-height:2\">\r\n"
				+
				"    <div style=\"margin:50px auto;width:70%;padding:20px 0\">\r\n" +
				"        <div style=\"border-bottom:1px solid #eee\"> <a href=' link// ! Linh website'\r\n" + //
				"                style=\"font-size:1.4em;color: #00466a;text-decoration:none;font-weight:600\">F4 EDUCATION CENTER</a>\r\n"
				+
				"        </div>\r\n" +
				"        <p>Cảnh báo bạn đã vắng điểm danh vào ngày \" + formatDateTime(date) </p>\r\n" +
				"        <h2 style=\"background: #00466a;margin: 0 auto;width: max-content;padding: 0 10px;color: #fff;border-radius:\r\n"
				+
				"            4px;\">\"\r\n" +
				"            Bạn đã vắng \" + absentCount /\" + totalCount buổi học</h2>\r\n" +
				"        <p style=\"color:red;font-size:1.2em;\">\"\r\n" +
				"            + isPassed </p>\" <p style=\"font-size:0.9em;\">Trân trọng,<br />F4 EDUCATION</p>\r\n" +
				"        <hr style=\"border:none;border-top:1px solid #eee\" />\r\n" +
				"        <div style=\"float:right;padding:8px 0;color:#aaa;font-size:0.8em;line-height:1;font-weight:300\">\r\n"
				+
				"            <p>Team Bộ tứ siêu đẳng</p>\r\n" +
				"            <p>123, Đường Nguyễn Văn Linh, TP.Cần Thơ</p>\r\n" +
				"            <p>Việt Nam</p>\r\n" +
				"        </div>\r\n" +
				"    </div>\r\n" +
				"</div>";
		subject = "Bạn vừa được giao bài tập mới";
		queue(new MailInfo(to, subject, body, date));
	}

	@Override
	public void mailUpdateTask(String to[], String subject, String body, Date date, Task oldTask, Task newTask) {
		// ! Xử lý gửi mail khi có sự thay đổi giao bài tập
		String link = "http://localhost:3000/student/classes";
		body = "<div style=\"font-family: Helvetica,Arial,sans-serif;min-width:1000px;overflow:auto;line-height:2\">\r\n"
				+
				"    <div style=\"margin:50px auto;width:70%;padding:20px 0\">\r\n" +
				"        <div style=\"border-bottom:1px solid #eee\"> <a href=' link// ! Linh website'\r\n" + //
				"                style=\"font-size:1.4em;color: #00466a;text-decoration:none;font-weight:600\">F4 EDUCATION CENTER</a>\r\n"
				+
				"        </div>\r\n" +
				"        <p>Cảnh báo bạn đã vắng điểm danh vào ngày \" + formatDateTime(date) </p>\r\n" +
				"        <h2 style=\"background: #00466a;margin: 0 auto;width: max-content;padding: 0 10px;color: #fff;border-radius:\r\n"
				+
				"            4px;\">\"\r\n" +
				"            Bạn đã vắng \" + absentCount /\" + totalCount buổi học</h2>\r\n" +
				"        <p style=\"color:red;font-size:1.2em;\">\"\r\n" +
				"            + isPassed </p>\" <p style=\"font-size:0.9em;\">Trân trọng,<br />F4 EDUCATION</p>\r\n" +
				"        <hr style=\"border:none;border-top:1px solid #eee\" />\r\n" +
				"        <div style=\"float:right;padding:8px 0;color:#aaa;font-size:0.8em;line-height:1;font-weight:300\">\r\n"
				+
				"            <p>Team Bộ tứ siêu đẳng</p>\r\n" +
				"            <p>123, Đường Nguyễn Văn Linh, TP.Cần Thơ</p>\r\n" +
				"            <p>Việt Nam</p>\r\n" +
				"        </div>\r\n" +
				"    </div>\r\n" +
				"</div>";
		subject = "Có sự thay đổi bài tập được giao";
		queue(new MailInfo(to, subject, body, date));
	}

	@Override
	public void sendWhenClassSeted(String[] to, String className, String courseName,
			String teacherName,
			String teacherId) {

		String subject = "Chào mừng học viên mới!";
		String htmlContent = "<!DOCTYPE html>\r\n" + //
				"\t\t<html lang=\"en\">\r\n" + //
				"\t\t\r\n" + //
				"\t\t\t<head>\r\n" + //
				"\t\t\t\t<meta charset=\"UTF-8\">\r\n" + //
				"\t\t\t\t<meta name=\"viewport\"\r\n" + //
				"\t\t\t\t\t  content=\"width=device-width, initial-scale=1.0\">\r\n" + //
				"\t\t\t\t<title>Document</title>\r\n" + //
				"\t\t\t\t<style>\r\n" + //
				"\t\t\t\t\t/* CSS định dạng */\r\n" + //
				"\t\t\t\t\tbody {\r\n" + //
				"\t\t\t\t\t\tfont-family: Arial, sans-serif;\r\n" + //
				"\t\t\t\t\t\tbackground-color: #f4f4f4;\r\n" + //
				"\t\t\t\t\t\tpadding: 20px;\r\n" + //
				"\t\t\t\t\t}\r\n" + //
				"\t\t\r\n" + //
				"\t\t\t\t\t.container {\r\n" + //
				"\t\t\t\t\t\tmax-width: 600px;\r\n" + //
				"\t\t\t\t\t\tmargin: 0 auto;\r\n" + //
				"\t\t\t\t\t\tbackground-color: #ffffff;\r\n" + //
				"\t\t\t\t\t\tborder-radius: 4px;\r\n" + //
				"\t\t\t\t\t\tpadding: 20px;\r\n" + //
				"\t\t\t\t\t\tbox-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);\r\n" + //
				"\t\t\t\t\t}\r\n" + //
				"\t\t\r\n" + //
				"\t\t\t\t\th1 {\r\n" + //
				"\t\t\t\t\t\tcolor: #333333;\r\n" + //
				"\t\t\t\t\t\tfont-size: 24px;\r\n" + //
				"\t\t\t\t\t\tmargin-bottom: 20px;\r\n" + //
				"\t\t\t\t\t}\r\n" + //
				"\t\t\r\n" + //
				"\t\t\t\t\tp {\r\n" + //
				"\t\t\t\t\t\tcolor: #666666;\r\n" + //
				"\t\t\t\t\t\tfont-size: 16px;\r\n" + //
				"\t\t\t\t\t\tline-height: 1.5;\r\n" + //
				"\t\t\t\t\t}\r\n" + //
				"\t\t\r\n" + //
				"\t\t\t\t\t/* Các thuộc tính mới thêm */\r\n" + //
				"\t\t\t\t\t.container {\r\n" + //
				"\t\t\t\t\t\tborder: 2px solid #e0e0e0;\r\n" + //
				"\t\t\t\t\t}\r\n" + //
				"\t\t\r\n" + //
				"\t\t\t\t\th1 {\r\n" + //
				"\t\t\t\t\t\tcolor: #ff6600;\r\n" + //
				"\t\t\t\t\t\tfont-size: 28px;\r\n" + //
				"\t\t\t\t\t\tmargin-bottom: 30px;\r\n" + //
				"\t\t\t\t\t\ttext-decoration: underline;\r\n" + //
				"\t\t\t\t\t}\r\n" + //
				"\t\t\r\n" + //
				"\t\t\t\t\tp.highlight {\r\n" + //
				"\t\t\t\t\t\tcolor: #009900;\r\n" + //
				"\t\t\t\t\t\tfont-weight: bold;\r\n" + //
				"\t\t\t\t\t}\r\n" + //
				"\t\t\r\n" + //
				"\t\t\t\t\t.footer {\r\n" + //
				"\t\t\t\t\t\tmargin-top: 30px;\r\n" + //
				"\t\t\t\t\t\tcolor: #6c6b6b;\r\n" + //
				"\t\t\t\t\t\tfont-size: 14px;\r\n" + //
				"\t\t\t\t\t}\r\n" + //
				"\t\t\r\n" + //
				"\t\t\t\t\t.button {\r\n" + //
				"\t\t\t\t\t\tdisplay: inline-block;\r\n" + //
				"\t\t\t\t\t\tpadding: 12px 24px;\r\n" + //
				"\t\t\t\t\t\tborder: none;\r\n" + //
				"\t\t\t\t\t\tbackground-color: #228be6;\r\n" + //
				"\t\t\t\t\t\tcolor: #fff;\r\n" + //
				"\t\t\t\t\t\tfont-size: 16px;\r\n" + //
				"\t\t\t\t\t\tfont-weight: 600;\r\n" + //
				"\t\t\t\t\t\ttext-align: center;\r\n" + //
				"\t\t\t\t\t\ttext-decoration: none;\r\n" + //
				"\t\t\t\t\t\tcursor: pointer;\r\n" + //
				"\t\t\t\t\t\tborder-radius: 4px;\r\n" + //
				"\t\t\t\t\t\ttransition: background-color 0.3s ease;\r\n" + //
				"\t\t\t\t\t}\r\n" + //
				"\t\t\r\n" + //
				"\t\t\t\t\t.button:hover {\r\n" + //
				"\t\t\t\t\t\tbackground-color: #1c78c9;\r\n" + //
				"\t\t\t\t\t}\r\n" + //
				"\t\t\r\n" + //
				"\t\t\t\t\tul {\r\n" + //
				"\t\t\t\t\t\tlist-style-type: none;\r\n" + //
				"\t\t\t\t\t\tpadding: 0;\r\n" + //
				"\t\t\t\t\t\tpadding-left: 10px;\r\n" + //
				"\t\t\t\t\t}\r\n" + //
				"\t\t\r\n" + //
				"\t\t\t\t\tli {\r\n" + //
				"\t\t\t\t\t\tmargin-bottom: 10px;\r\n" + //
				"\t\t\t\t\t}\r\n" + //
				"\t\t\r\n" + //
				"\t\t\t\t\t.course-info {\r\n" + //
				"\t\t\t\t\t\tfont-weight: bold;\r\n" + //
				"\t\t\t\t\t}\r\n" + //
				"\t\t\r\n" + //
				"\t\t\t\t\t.teacher-info {\r\n" + //
				"\t\t\t\t\t\tcolor: #888;\r\n" + //
				"\t\t\t\t\t}\r\n" + //
				"\t\t\t\t</style>\r\n" + //
				"\t\t\t</head>\r\n" + //
				"\t\t\r\n" + //
				"\t\t\t<body>\r\n" + //
				"\t\t\r\n" + //
				"\t\t\t\t<div class=\"container\">\r\n" + //
				"\t\t\t\t\t<h1>Chào mừng học viên mới!</h1>\r\n" + //
				"\t\t\t\t\t<p>Xin chào, </p>\r\n" + //
				"\t\t\t\t\t<p>Chúng tôi xin gửi lời chào mừng đến bạn với tư cách là học viên mới của chúng tôi. Chúng tôi rất vui mừng\r\n"
				+ //
				"\t\t\t\t\t\tđược chào đón bạn vào cộng đồng học tập và phát triển cùng chúng tôi.</p>\r\n" + //
				"\t\t\t\t\t<p class=\"highlight\">Chúng tôi cam kết cung cấp cho bạn các khóa học chất lượng cao, đội ngũ giảng viên giàu\r\n"
				+ //
				"\t\t\t\t\t\tkinh nghiệm và một môi trường học tập thân thiện.</p>\r\n" + //
				"\t\t\t\t\t<p>Nếu bạn có bất kỳ câu hỏi nào hoặc cần hỗ trợ, đừng ngần ngại liên hệ với chúng tôi. Chúng tôi luôn sẵn\r\n"
				+ //
				"\t\t\t\t\t\tsàng giúp đỡ bạn.</p>\r\n" + //
				"\t\t\t\t\t<p>Hãy chuẩn bị sẵn sàng để bắt đầu hành trình học tập tuyệt vời cùng chúng tôi!</p>\r\n" + //
				"\t\t\t\t\t<p>Một số thông tin về khóa học của bạn: </p>\r\n" + //
				"\t\t\r\n" + //
				"\t\t\t\t\t<ul>\r\n" + //
				"\t\t\t\t\t\t<li><span class=\"course-info\">Tên khóa học:</span> " + courseName + "</li>\r\n" + //
				"\t\t\t\t\t\t<li><span class=\"course-info\">Lớp học:</span> " + className + "</li>\r\n" + //
				"\t\t\t\t\t\t<li><span class=\"course-info\">Giáo viên phụ trách giảng dạy:</span> " + teacherName
				+ " - " + teacherId + "\r\n"
				+ //
				"\t\t\t\t\t\t</li>\r\n" + //
				"\t\t\t\t\t</ul>\r\n" + //
				"\t\t\t\t\t<a href=\"http://localhost:3000/student/classes\"\r\n" + //
				"\t\t\t\t\t   class=\"button\">Xem các lớp học</a>\r\n" + //
				"\t\t\t\t\t<p>Xin chân thành cảm ơn và chúc bạn có những trải nghiệm học tập thú vị.</p>\r\n" + //
				"\t\t\t\t\t<p class=\"footer\">Trân trọng,</p>\r\n" + //
				"\t\t\t\t\t<p class=\"footer\">Đội ngũ Quản lý Học viên</p>\r\n" + //
				"\t\t\t\t\t<div class=\"footer\">Trung tâm đào tạo kháo học lập trình ngắn hạn - F4Education.\r\n" + //
				"\t\t\t\t\t</div>\r\n" + //
				"\t\t\t\t\t<div style=\"padding: 20px 0;\">\r\n" + //
				"\t\t\t\t\t\t<img src=\"https://storage.googleapis.com/f4education-p2.appspot.com/avatars/courses/F4EDUCATION.png\"\r\n"
				+ //
				"\t\t\t\t\t\t\t alt=\"\">\r\n" + //
				"\t\t\t\t\t</div>\r\n" + //
				"\t\t\t\t</div>\r\n" + //
				"\t\t\r\n" + //
				"\t\t\t</body>\r\n" + //
				"\t\t\r\n" + //
				"\t\t</html>";

		queue(new MailInfo(to, to, subject, htmlContent));
		System.out.println("Email đã được gửi thành công!");

	}

	@Override
	public void sendToTeacherWhenClassSeted(String[] to, String className, String courseName) {
		String subject = "Thông Báo Phân Công Lớp Học Mới";
		String htmlContent = "<!DOCTYPE html>\r\n" + //
				"<html>\r\n" + //
				"\r\n" + //
				"    <head>\r\n" + //
				"        <style>\r\n" + //
				"            body {\r\n" + //
				"                font-family: Arial, sans-serif;\r\n" + //
				"                line-height: 1.6;\r\n" + //
				"            }\r\n" + //
				"\r\n" + //
				"            .container {\r\n" + //
				"                max-width: 650px;\r\n" + //
				"                margin: 0 auto;\r\n" + //
				"                padding: 20px;\r\n" + //
				"                border: 1px solid #f5f3f3;\r\n" + //
				"                border-radius: 5px;\r\n" + //
				"                background-color: #f9f9f9;\r\n" + //
				"            }\r\n" + //
				"\r\n" + //
				"            h1 {\r\n" + //
				"                color: #333;\r\n" + //
				"            }\r\n" + //
				"\r\n" + //
				"            p,\r\n" + //
				"            .footer {\r\n" + //
				"                color: #666;\r\n" + //
				"            }\r\n" + //
				"\r\n" + //
				"            /* CSS cho bảng */\r\n" + //
				"            table {\r\n" + //
				"                width: 100%;\r\n" + //
				"                margin-bottom: 1rem;\r\n" + //
				"                color: #212529;\r\n" + //
				"                border-collapse: collapse;\r\n" + //
				"            }\r\n" + //
				"\r\n" + //
				"            th,\r\n" + //
				"            td {\r\n" + //
				"                padding: 0.75rem;\r\n" + //
				"                vertical-align: top;\r\n" + //
				"                border-top: 1px solid #dee2e6;\r\n" + //
				"                text-align: center;\r\n" + //
				"            }\r\n" + //
				"\r\n" + //
				"            thead {\r\n" + //
				"                background-color: #e9ecef;\r\n" + //
				"                border-bottom: 2px solid #dee2e6;\r\n" + //
				"            }\r\n" + //
				"\r\n" + //
				"            tbody tr:nth-of-type(even) {\r\n" + //
				"                background-color: #f8f9fa;\r\n" + //
				"            }\r\n" + //
				"\r\n" + //
				"            tbody tr:hover {\r\n" + //
				"                background-color: rgba(0, 0, 0, 0.075);\r\n" + //
				"            }\r\n" + //
				"        </style>\r\n" + //
				"    </head>\r\n" + //
				"\r\n" + //
				"    <body>\r\n" + //
				"        <div class=\"container\">\r\n" + //
				"            <h1>Thông Báo: Phân Công Lớp Học</h1>\r\n" + //
				"            <p>Kính gửi thầy/cô,</p>\r\n" + //
				"            <p>Chúc mừng! Thầy/cô đã được xếp vào lớp học mới như sau:</p>\r\n" + //
				"            <table>\r\n" + //
				"                <thead>\r\n" + //
				"                    <tr>\r\n" + //
				"                        <th>Khóa Học</th>\r\n" + //
				"                        <th>Lớp</th>\r\n" + //
				"                    </tr>\r\n" + //
				"                </thead>\r\n" + //
				"                <tbody>\r\n" + //
				"                    <tr>\r\n" + //
				"                        <td> " + courseName + " </td>\r\n" + //
				"                        <td>" + className + "</td>\r\n" + //
				"                    </tr>\r\n" + //
				"                    <!-- Các dòng tiếp theo thêm thông tin lớp học khác nếu cần -->\r\n" + //
				"                </tbody>\r\n" + //
				"            </table>\r\n" + //
				"            <p>Thông tin chi tiết về thời khóa biểu sẽ được gửi đến thầy/cô trong thời gian sớm nhất.</p>\r\n"
				+ //
				"            <p>Xin vui lòng kiểm tra lại thông tin chi tiết trong hệ thống và chuẩn bị cho việc giảng dạy.</p>\r\n"
				+ //
				"            <p>Cảm ơn thầy/cô đã đồng ý tham gia giảng dạy và chúc thầy/cô có một khóa học tốt lành!</p>\r\n"
				+ //
				"            <p>Trân trọng,</p>\r\n" + //
				"            <p>Đội ngũ Quản lý Học viên</p>\r\n" + //
				"\r\n" + //
				"\r\n" + //
				"            <div class=\"footer\">\r\n" + //
				"                Trung tâm đào tạo kháo học lập trình ngắn hạn - F4Education.\r\n" + //
				"            </div>\r\n" + //
				"            <div style=\"padding: 20px 0;\">\r\n" + //
				"                <img src=\"https://storage.googleapis.com/f4education-p2.appspot.com/avatars/courses/F4EDUCATION.png\"\r\n"
				+ //
				"                     alt=\"\">\r\n" + //
				"            </div>\r\n" + //
				"        </div>\r\n" + //
				"    </body>\r\n" + //
				"\r\n" + //
				"</html>";
		queue(new MailInfo(to, to, subject, htmlContent));
		System.out.println("Email đã được gửi thành công!");
	}

	@Override
	public void mailUpdateSchedule(String[] to, String subject, String body, Date date, Classes classes) {
		// ! Mails khi mới bổ sung thời khóa biểu
		subject = "Thông Báo Thay Đổi Lịch Học";

		Date studyDate = null;
		try {
			studyDate = classes.getSchedules().get(0).getStudyDate();
		} catch (Exception e) {
		}
		String htmlBody = "<!DOCTYPE html>\r\n" +
				"<html>\r\n" +
				"\r\n" +
				"<head>\r\n" +
				"    <style>\r\n" +
				"        a {\r\n" +
				"            text-decoration: none;\r\n" +
				"        }\r\n" +
				"\r\n" +
				"        body {\r\n" +
				"            font-family: Arial, sans-serif;\r\n" +
				"            line-height: 1.6;\r\n" +
				"        }\r\n" +
				"\r\n" +
				"        .container {\r\n" +
				"            max-width: 650px;\r\n" +
				"            margin: 0 auto;\r\n" +
				"            padding: 20px;\r\n" +
				"            border: 1px solid #f5f3f3;\r\n" +
				"            border-radius: 5px;\r\n" +
				"            background-color: #f9f9f9;\r\n" +
				"        }\r\n" +
				"\r\n" +
				"        h1 {\r\n" +
				"            color: #333;\r\n" +
				"        }\r\n" +
				"\r\n" +
				"        .button {\r\n" +
				"            display: inline-block;\r\n" +
				"            padding: 6px 12px;\r\n" +
				"            border: none;\r\n" +
				"            background-color: #228be6;\r\n" +
				"            color: #fff;\r\n" +
				"            font-size: 16px;\r\n" +
				"            font-weight: 600;\r\n" +
				"            text-align: center;\r\n" +
				"            text-decoration: none;\r\n" +
				"            cursor: pointer;\r\n" +
				"            border-radius: 4px;\r\n" +
				"            transition: background-color 0.3s ease;\r\n" +
				"        }\r\n" +
				"\r\n" +
				"        /* CSS cho bảng */\r\n" +
				"        table {\r\n" +
				"            width: 100%;\r\n" +
				"            margin-bottom: 1rem;\r\n" +
				"            color: #212529;\r\n" +
				"            border-collapse: collapse;\r\n" +
				"        }\r\n" +
				"\r\n" +
				"        th,\r\n" +
				"        td {\r\n" +
				"            padding: 0.75rem;\r\n" +
				"            vertical-align: top;\r\n" +
				"            border-top: 1px solid #dee2e6;\r\n" +
				"            text-align: center;\r\n" +
				"        }\r\n" +
				"\r\n" +
				"        thead {\r\n" +
				"            background-color: #e9ecef;\r\n" +
				"            border-bottom: 2px solid #dee2e6;\r\n" +
				"        }\r\n" +
				"\r\n" +
				"        tbody tr:nth-of-type(even) {\r\n" +
				"            background-color: #f8f9fa;\r\n" +
				"        }\r\n" +
				"\r\n" +
				"        tbody tr:hover {\r\n" +
				"            background-color: rgba(0, 0, 0, 0.075);\r\n" +
				"        }\r\n" +
				"    </style>\r\n" +
				"</head>\r\n" +
				"\r\n" +
				"<body>\r\n" +
				"    <div class=\"container\">\r\n" +
				"        <h2>Thông báo: lớp học " + classes.getClassName()
				+ " đã được chỉnh sửa thời khóa biểu</h2>\r\n"
				+
				"        <p>Kính gửi các bạn học viên của lớp " + classes.getClassName() + ".</p>\r\n" +
				"        <p>Thời khóa biểu của lớp đã được chỉnh sửa bổ sung sung trên hệ thống!" +

				"        <p>Thông tin chi tiết về thời khóa biểu, vui lòng xem thông tin: <br> <a\r\n" +
				"                href=\"http:localhost:3000/student/classes?classId=" + classes.getClassId()
				+ "\" class=\"button\">Xem thông tin thời khóa\r\n"
				+
				"                biểu</a>.\r\n" +
				"        </p>\r\n" +
				"        <p>Xin vui lòng kiểm tra lại thông tin chi tiết trên hệ thống và chuẩn bị cho việc học tập.</p>\r\n"
				+
				"        <p>Chúc các bạn học viên có một khóa học tốt lành!</p>\r\n" +
				"        <hr>\r\n" +
				"        <p>Trân trọng,</p>\r\n" +
				"        <p>Đội ngũ Quản lý Học viên</p>\r\n" +
				"        <div class=\"footer\">\r\n" +
				"            Trung tâm đào tạo kháo học lập trình ngắn hạn - F4Education.\r\n" +
				"        </div>\r\n" +
				"        <div style=\"padding: 20px 0;\">\r\n" +
				"            <img src=\"https:storage.googleapis.com/f4education-p2.appspot.com/avatars/courses/F4EDUCATION.png\" alt=\"\">\r\n"
				+
				"        </div>\r\n" +
				"    </div>\r\n" +
				"</body>\r\n" +
				"\r\n" +
				"</html>";
		queue(new MailInfo(to, to, subject, htmlBody));
		System.out.println("Email đã được gửi thành công!");
	}

	@Override
	public void mailNewSchedule(String[] to, String subject, String body, Date date, Classes classes) {
		// ! Mails khi mới bổ sung thời khóa biểu
		subject = "Thông Báo Bổ Sung Lịch Học";
		Date studyDate = null;
		try {
			studyDate = classes.getSchedules().get(0).getStudyDate();
		} catch (Exception e) {
		}
		String htmlBody = "<!DOCTYPE html>\r\n" +
				"<html>\r\n" +
				"\r\n" +
				"<head>\r\n" +
				"    <style>\r\n" +
				"        a {\r\n" +
				"            text-decoration: none;\r\n" +
				"        }\r\n" +
				"\r\n" +
				"        body {\r\n" +
				"            font-family: Arial, sans-serif;\r\n" +
				"            line-height: 1.6;\r\n" +
				"        }\r\n" +
				"\r\n" +
				"        .container {\r\n" +
				"            max-width: 650px;\r\n" +
				"            margin: 0 auto;\r\n" +
				"            padding: 20px;\r\n" +
				"            border: 1px solid #f5f3f3;\r\n" +
				"            border-radius: 5px;\r\n" +
				"            background-color: #f9f9f9;\r\n" +
				"        }\r\n" +
				"\r\n" +
				"        h1 {\r\n" +
				"            color: #333;\r\n" +
				"        }\r\n" +
				"\r\n" +
				"        .button {\r\n" +
				"            display: inline-block;\r\n" +
				"            padding: 6px 12px;\r\n" +
				"            border: none;\r\n" +
				"            background-color: #228be6;\r\n" +
				"            color: #fff;\r\n" +
				"            font-size: 16px;\r\n" +
				"            font-weight: 600;\r\n" +
				"            text-align: center;\r\n" +
				"            text-decoration: none;\r\n" +
				"            cursor: pointer;\r\n" +
				"            border-radius: 4px;\r\n" +
				"            transition: background-color 0.3s ease;\r\n" +
				"        }\r\n" +
				"\r\n" +
				"        /* CSS cho bảng */\r\n" +
				"        table {\r\n" +
				"            width: 100%;\r\n" +
				"            margin-bottom: 1rem;\r\n" +
				"            color: #212529;\r\n" +
				"            border-collapse: collapse;\r\n" +
				"        }\r\n" +
				"\r\n" +
				"        th,\r\n" +
				"        td {\r\n" +
				"            padding: 0.75rem;\r\n" +
				"            vertical-align: top;\r\n" +
				"            border-top: 1px solid #dee2e6;\r\n" +
				"            text-align: center;\r\n" +
				"        }\r\n" +
				"\r\n" +
				"        thead {\r\n" +
				"            background-color: #e9ecef;\r\n" +
				"            border-bottom: 2px solid #dee2e6;\r\n" +
				"        }\r\n" +
				"\r\n" +
				"        tbody tr:nth-of-type(even) {\r\n" +
				"            background-color: #f8f9fa;\r\n" +
				"        }\r\n" +
				"\r\n" +
				"        tbody tr:hover {\r\n" +
				"            background-color: rgba(0, 0, 0, 0.075);\r\n" +
				"        }\r\n" +
				"    </style>\r\n" +
				"</head>\r\n" +
				"\r\n" +
				"<body>\r\n" +
				"    <div class=\"container\">\r\n" +
				"        <h2>Thông báo: lớp học " + classes.getClassName() + " đã được bổ sung thời khóa biểu</h2>\r\n"
				+
				"        <p>Kính gửi các bạn học viên của lớp " + classes.getClassName() + ".</p>\r\n" +
				"        <p>Thời khóa biểu của lớp đã được bổ sung trên hệ thống! Buổi học đầu tiên sẽ bắt đầu vào ngày: "
				+ formatDate(studyDate) + "</p>\r\n" +

				"        <p>Thông tin chi tiết về thời khóa biểu, vui lòng xem thông tin: <br><a\r\n" +
				"                href=\"http:localhost:3000/student/classes?classId=" + classes.getClassId()
				+ "\" class=\"button\">Xem thông tin thời khóa\r\n"
				+
				"                biểu</a>.\r\n" +
				"        </p>\r\n" +
				"        <p>Xin vui lòng kiểm tra lại thông tin chi tiết trên hệ thống và chuẩn bị cho việc học tập.</p>\r\n"
				+
				"        <p>Chúc các bạn học viên có một khóa học tốt lành!</p>\r\n" +
				"        <hr>\r\n" +
				"        <p>Trân trọng,</p>\r\n" +
				"        <p>Đội ngũ Quản lý Học viên</p>\r\n" +
				"        <div class=\"footer\">\r\n" +
				"            Trung tâm đào tạo kháo học lập trình ngắn hạn - F4Education.\r\n" +
				"        </div>\r\n" +
				"        <div style=\"padding: 20px 0;\">\r\n" +
				"            <img src=\"https:storage.googleapis.com/f4education-p2.appspot.com/avatars/courses/F4EDUCATION.png\" alt=\"\">\r\n"
				+
				"        </div>\r\n" +
				"    </div>\r\n" +
				"</body>\r\n" +
				"\r\n" +
				"</html>";
		queue(new MailInfo(to, to, subject, htmlBody));
		System.out.println("Email đã được gửi thành công!");
	}

	// public static void main(String[] args) {
	// MailerServiceImpl ml = new MailerServiceImpl();
	// String[] listMail = { "hienttpc03323@fpt.edu.vn" };
	// Classes cl = new Classes();
	// ml.mailNewSchedule(listMail, "", "", new Date(), cl);
	// }
}
