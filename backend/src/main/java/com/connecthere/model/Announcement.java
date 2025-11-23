package com.connecthere.model;

import jakarta.persistence.*;
import lombok.*;

import java.time.Instant;

@Entity
@Table(name = "announcements")
@Getter @Setter
@NoArgsConstructor @AllArgsConstructor @Builder
public class Announcement {

    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, length = 200)
    private String title;

    @Column(nullable = false, length = 4000)
    private String content;

    @ManyToOne @JoinColumn(name = "channel_id")
    private Channel channel;

    @ManyToOne @JoinColumn(name = "created_by_id")
    private User createdBy;

    @Builder.Default
    private Instant createdAt = Instant.now();

    @Builder.Default
    private boolean important = false;
}
