package com.k6m.surfer.system.model;

public class SystemStatusDto {
    private double systemCpuLoad;        // 0.0 ~ 1.0
    private double processCpuLoad;       // 0.0 ~ 1.0
    private double memoryUsage;          // 0.0 ~ 1.0
    private double networkUsagePercent;  // 0.0 ~ 100.0
    
    public SystemStatusDto(double systemCpuLoad, double processCpuLoad, double memoryUsage, double networkUsagePercent) {
        this.systemCpuLoad = systemCpuLoad;
        this.processCpuLoad = processCpuLoad;
        this.memoryUsage = memoryUsage;
        this.networkUsagePercent = networkUsagePercent;
    }

    // Getters
    public double getSystemCpuLoad() {
        return systemCpuLoad;
    }

    public double getProcessCpuLoad() {
        return processCpuLoad;
    }

    public double getMemoryUsage() {
        return memoryUsage;
    }

    public double getNetworkUsagePercent() {
        return networkUsagePercent;
    }
}

