
package com.ecommerce.service.impl;

import com.ecommerce.service.EmailService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Service;

import jakarta.mail.MessagingException;
import jakarta.mail.internet.MimeMessage;

@Service
@RequiredArgsConstructor
@Slf4j
public class EmailServiceImpl implements EmailService {
    
    private final JavaMailSender mailSender;
    
    @Value("${spring.mail.username}")
    private String fromEmail;
    
    @Async
    @Override
    public void sendEmail(String to, String subject, String content) {
        try {
            // Try to send HTML email
            MimeMessage message = mailSender.createMimeMessage();
            MimeMessageHelper helper = new MimeMessageHelper(message, true, "UTF-8");
            helper.setFrom(fromEmail);
            helper.setTo(to);
            helper.setSubject(subject);
            
            // Convert plain text to basic HTML
            String htmlContent = "<html><body>" +
                    content.replace("\n", "<br/>") +
                    "</body></html>";
            
            helper.setText(htmlContent, true);
            
            mailSender.send(message);
            log.info("HTML email sent successfully to: {}", to);
        } catch (MessagingException e) {
            log.warn("Failed to send HTML email, falling back to plain text: {}", e.getMessage());
            
            // Fallback to plain text email
            try {
                SimpleMailMessage simpleMessage = new SimpleMailMessage();
                simpleMessage.setFrom(fromEmail);
                simpleMessage.setTo(to);
                simpleMessage.setSubject(subject);
                simpleMessage.setText(content);
                
                mailSender.send(simpleMessage);
                log.info("Plain text email sent successfully to: {}", to);
            } catch (Exception ex) {
                log.error("Failed to send email to: {}", to, ex);
            }
        }
    }
}
