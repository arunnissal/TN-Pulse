package com.tnpulse.api.service;

import com.tnpulse.api.model.Issue;
import lombok.Getter;
import org.springframework.context.ApplicationEvent;

@Getter
public class IssueCreatedEvent extends ApplicationEvent {
    
    private final Issue issue;

    public IssueCreatedEvent(Object source, Issue issue) {
        super(source);
        this.issue = issue;
    }
}
