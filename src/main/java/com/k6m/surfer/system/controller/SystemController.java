package com.k6m.surfer.system.controller;

import com.k6m.surfer.system.model.SystemStatusDto;
import com.k6m.surfer.system.service.SystemMonitorService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/k6m-system")
public class SystemController {

    @GetMapping()
    public ResponseEntity<SystemStatusDto> system() throws InterruptedException {
        return ResponseEntity.ok(new SystemMonitorService().getSystemStatus(1000));
    }
}
