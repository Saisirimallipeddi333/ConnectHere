package com.connecthere.model;

import jakarta.persistence.*;
import lombok.*;

import java.time.Instant;

@Entity
@Table(name = "resources")
@Getter @Setter
@NoArgsConstructor @AllArgsConstructor @Builder
public class Resource {

    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, length = 200)
    private String title;

    @Column(length = 2000)
    private String description;

    @Column(length = 50)
    private String type; // NOTES, SLIDES, LINK, ASSIGNMENT, OTHER

    @Column(length = 500)
    private String url;

    @ManyToOne @JoinColumn(name = "channel_id")
    private Channel channel;

    @ManyToOne @JoinColumn(name = "uploaded_by_id")
    private User uploadedBy;

    @Builder.Default
    private Instant createdAt = Instant.now();
}
