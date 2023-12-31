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
        this.from = "F4Education";
        this.to = to;
        this.subject = subject;
        this.body = body;
        this.date = date;
    }

    // public MailInfo(String subject, String[] to, String content) {
    // this.from = "F4Education";
    // this.to = to;
    // this.subject = subject;
    // this.content = content;
    // }

    public MailInfo(String to, String subject, String body, Date date) {
        this.from = "F4Education";
        String[] mail = { to };
        this.to = mail;
        this.subject = subject;
        this.body = body;
        this.date = date;
    }

    public MailInfo(String[] to, String subject, String body) {
        this.from = "F4Education";
        this.to = to;
        this.subject = subject;
        this.body = body;
    }

    public MailInfo(String[] to, String[] bcc, String subject, String body) {
        this.from = "F4Education";
        this.to = to;
        this.bcc = bcc;
        this.subject = subject;
        this.body = body;
    }

    public MailInfo(String[] to, String subject, String body, byte[] pdfFile) {
        this.from = "F4Education";
        this.to = to;
        this.subject = subject;
        this.body = body;
        this.pdfFile = pdfFile;
    }

}
