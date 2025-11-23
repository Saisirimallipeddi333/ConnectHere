package com.connecthere.model;

import jakarta.persistence.*;
import lombok.*;

import java.time.Instant;

@Entity
@Table(name = "channels")
@Getter @Setter
@NoArgsConstructor @AllArgsConstructor @Builder
public class Channel {

    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, unique = true, length = 100)
    private String name; // e.g. CSE101, AI Club

    @Column(length = 20)
    private String type; // COURSE, CLUB

    @Column(length = 500)
    private String description;

    @ManyToOne
    @JoinColumn(name = "created_by_id")
    private User createdBy;

    @Builder.Default
    private Instant createdAt = Instant.now();
}
