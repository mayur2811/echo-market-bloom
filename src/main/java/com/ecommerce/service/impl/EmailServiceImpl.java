
package com.ecommerce.service.impl;

import com.ecommerce.service.EmailService;
import jakarta.mail.MessagingException;
import jakarta.mail.internet.MimeMessage;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.stereotype.Service;
import org.thymeleaf.TemplateEngine;
import org.thymeleaf.context.Context;

import java.util.Map;

@Service
public class EmailServiceImpl implements EmailService {

    @Autowired
    private JavaMailSender mailSender;
    
    @Autowired(required = false)
    private TemplateEngine templateEngine;
    
    @Value("${spring.mail.username:no-reply@ecommerce.com}")
    private String fromEmail;

    @Override
    public void sendSimpleEmail(String to, String subject, String body) {
        try {
            SimpleMailMessage message = new SimpleMailMessage();
            message.setFrom(fromEmail);
            message.setTo(to);
            message.setSubject(subject);
            message.setText(body);
            
            mailSender.send(message);
        } catch (Exception e) {
            System.err.println("Failed to send email: " + e.getMessage());
        }
    }

    @Override
    public void sendHtmlEmail(String to, String subject, String htmlBody) throws MessagingException {
        try {
            MimeMessage message = mailSender.createMimeMessage();
            MimeMessageHelper helper = new MimeMessageHelper(message, true, "UTF-8");
            
            helper.setFrom(fromEmail);
            helper.setTo(to);
            helper.setSubject(subject);
            helper.setText(htmlBody, true);
            
            mailSender.send(message);
        } catch (MessagingException e) {
            System.err.println("Failed to send HTML email: " + e.getMessage());
            throw e;
        }
    }

    @Override
    public void sendTemplatedEmail(String to, String subject, String templateName, Map<String, Object> templateModel) throws MessagingException {
        if (templateEngine != null) {
            Context context = new Context();
            context.setVariables(templateModel);
            
            String htmlContent = templateEngine.process(templateName, context);
            sendHtmlEmail(to, subject, htmlContent);
        } else {
            // Fallback to simple text content if template engine is not available
            StringBuilder textContent = new StringBuilder();
            textContent.append("Dear ").append(templateModel.getOrDefault("name", "Customer")).append(",\n\n");
            
            if (templateName.contains("reset-password")) {
                textContent.append("You requested a password reset. Please use this link to reset your password: ")
                          .append(templateModel.getOrDefault("resetLink", ""))
                          .append("\n\nIf you did not request this, please ignore this email.");
            } else if (templateName.contains("welcome")) {
                textContent.append("Welcome to our eCommerce platform! Thank you for registering with us.");
            } else if (templateName.contains("password-reset-confirmation")) {
                textContent.append("Your password has been successfully reset. If you did not make this change, please contact our support team immediately.");
            }
            
            textContent.append("\n\nThank you,\nThe eCommerce Team");
            
            sendSimpleEmail(to, subject, textContent.toString());
        }
    }
}
