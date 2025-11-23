package com.connecthere.repository;

import com.connecthere.model.Announcement;
import com.connecthere.model.Comment;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface CommentRepository extends JpaRepository<Comment, Long> {
    List<Comment> findByAnnouncementOrderByCreatedAtAsc(Announcement announcement);
}
