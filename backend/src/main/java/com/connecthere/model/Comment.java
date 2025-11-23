package com.connecthere.model;

import jakarta.persistence.*;
import lombok.*;

import java.time.Instant;

@Entity
@Table(name = "comments")
@Getter @Setter
@NoArgsConstructor @AllArgsConstructor @Builder
public class Comment {

    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, length = 1000)
    private String content;

    @ManyToOne @JoinColumn(name = "announcement_id")
    private Announcement announcement;

    @ManyToOne @JoinColumn(name = "author_id")
    private User author;

    @Builder.Default
    private Instant createdAt = Instant.now();
}
