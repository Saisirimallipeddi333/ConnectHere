package com.connecthere.service;

import com.connecthere.model.Announcement;
import com.connecthere.model.Comment;
import com.connecthere.model.User;
import com.connecthere.repository.AnnouncementRepository;
import com.connecthere.repository.CommentRepository;
import com.connecthere.repository.UserRepository;
import jakarta.validation.constraints.NotBlank;
import lombok.Data;
import org.springframework.security.core.Authentication;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class CommentService {

    private final CommentRepository commentRepository;
    private final AnnouncementRepository announcementRepository;
    private final UserRepository userRepository;

    public CommentService(CommentRepository commentRepository,
                          AnnouncementRepository announcementRepository,
                          UserRepository userRepository) {
        this.commentRepository = commentRepository;
        this.announcementRepository = announcementRepository;
        this.userRepository = userRepository;
    }

    public List<Comment> getComments(Long announcementId) {
        Announcement a = announcementRepository.findById(announcementId)
            .orElseThrow(() -> new IllegalArgumentException("Announcement not found"));
        return commentRepository.findByAnnouncementOrderByCreatedAtAsc(a);
    }

    public Comment addComment(Long announcementId, CommentRequest req, Authentication auth) {
        Announcement a = announcementRepository.findById(announcementId)
            .orElseThrow(() -> new IllegalArgumentException("Announcement not found"));
        User author = getCurrentUser(auth);
        Comment c = Comment.builder()
            .announcement(a)
            .author(author)
            .content(req.getContent())
            .build();
        return commentRepository.save(c);
    }

    private User getCurrentUser(Authentication auth) {
        String email = auth.getName();
        return userRepository.findByEmail(email)
            .orElseThrow(() -> new IllegalArgumentException("User not found"));
    }

    @Data
    public static class CommentRequest {
        @NotBlank private String content;
    }
}
