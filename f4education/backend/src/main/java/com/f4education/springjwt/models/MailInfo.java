package com.f4education.springjwt.models;

import java.util.Date;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Getter
@Setter
public class MailInfo {
	String from;
	String[] to;
	String[] cc;
	String[] bcc;
	String subject;
	String body;
	String content;
	byte[] pdfFile;
	String[] attachments;
	Date date = null;

	public MailInfo(String[] to, String subject, String body, Date date) {
		this.from = "FPT Polytechnic <poly@fpt.edu.vn>";
		this.to = to;
		this.subject = subject;
		this.body = body;
		this.date = date;
	}

	public MailInfo(String to, String subject, String body, Date date) {
		this.from = "FPT Polytechnic <poly@fpt.edu.vn>";
		String[] mail = { to };
		this.to = mail;
		this.subject = subject;
		this.body = body;
		this.date = date;
	}

	public MailInfo(String[] to, String subject, String body) {
		this.from = "FPT Polytechnic <poly@fpt.edu.vn>";
		this.to = to;
		this.subject = subject;
		this.body = body;
	}

	public MailInfo(String[] to, String subject, String body, byte[] pdfFile) {
		this.from = "FPT Polytechnic <poly@fpt.edu.vn>"; 
		this.to = to;
		this.subject = subject;
		this.body = body;
		this.pdfFile = pdfFile;
	}

}
