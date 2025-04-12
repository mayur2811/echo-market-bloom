
package com.ecommerce.service;

import jakarta.mail.MessagingException;
import java.util.Map;

public interface EmailService {
    
    void sendSimpleEmail(String to, String subject, String body);
    
    void sendHtmlEmail(String to, String subject, String htmlBody) throws MessagingException;
    
    void sendTemplatedEmail(String to, String subject, String templateName, Map<String, Object> templateModel) throws MessagingException;
}
