package com.connecthere.controller;

import com.connecthere.model.Comment;
import com.connecthere.service.CommentService;
import com.connecthere.service.CommentService.CommentRequest;
import jakarta.validation.Valid;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/announcements/{id}/comments")
@CrossOrigin
public class CommentController {

    private final CommentService commentService;

    public CommentController(CommentService commentService) {
        this.commentService = commentService;
    }

    @GetMapping
    public List<Comment> getComments(@PathVariable Long id) {
        return commentService.getComments(id);
    }

    @PostMapping
    public Comment addComment(@PathVariable Long id,
                              @Valid @RequestBody CommentRequest req,
                              Authentication auth) {
        return commentService.addComment(id, req, auth);
    }
}
