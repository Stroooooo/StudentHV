package com.api.api.cron;

import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;

import com.api.api.services.VMService;

@Component
public class StopVMJobs {
    private final VMService vmService;
    
    public StopVMJobs(VMService vmService) {
        this.vmService = vmService;
    }

    @Scheduled(cron = "0 0 1 * * ?")
    public void StopVMS() {
        // vmService.stopAllVMs();
    }
}
