package com.k6m.surfer.system.service;

import com.k6m.surfer.system.core.AutoNetworkMonitor;
import com.k6m.surfer.system.core.JvmResourceMonitor;
import com.k6m.surfer.system.model.SystemStatusDto;

public class SystemMonitorService {
    private final JvmResourceMonitor jvmMonitor;
    private final AutoNetworkMonitor networkMonitor;

    public SystemMonitorService() {
        this.jvmMonitor = new JvmResourceMonitor();
        this.networkMonitor = new AutoNetworkMonitor();
    }

    public SystemStatusDto getSystemStatus(long networkIntervalMs) throws InterruptedException {
        double systemCpu = jvmMonitor.getSystemCpuLoad();
        double processCpu = jvmMonitor.getProcessCpuLoad();
        double memory = jvmMonitor.getMemoryUsage();
        double network = networkMonitor.getNetworkUsagePercent(networkIntervalMs);

        return new SystemStatusDto(systemCpu, processCpu, memory, network);
    }

//    public static void main(String[] args) throws InterruptedException {
//        SystemMonitorService service = new SystemMonitorService();
//
//        while (true) {
//            SystemStatusDto status = service.getSystemStatus(1000);
//            System.out.printf("System CPU: %.1f%%, Process CPU: %.1f%%, Memory: %.1f%%, Network: %.1f%%%n",
//                    status.getSystemCpuLoad() * 100,
//                    status.getProcessCpuLoad() * 100,
//                    status.getMemoryUsage() * 100,
//                    status.getNetworkUsagePercent());
//            Thread.sleep(2000);
//        }
//    }
}

