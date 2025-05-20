//package com.github.k6mt.surfer.system.core;
//
//import com.sun.management.OperatingSystemMXBean;
//
//import java.lang.management.ManagementFactory;
//
//public class JvmResourceMonitor {
//
//  private final OperatingSystemMXBean osBean;
//
//  public JvmResourceMonitor() {
//    // cast required
//    this.osBean = (OperatingSystemMXBean) ManagementFactory.getOperatingSystemMXBean();
//  }
//
//  /**
//   * System-wide CPU load (0.0 ~ 1.0)
//   */
//  public double getSystemCpuLoad() {
//    return osBean.getSystemCpuLoad();
//  }
//
//  /**
//   * JVM process CPU load (0.0 ~ 1.0)
//   */
//  public double getProcessCpuLoad() {
//    return osBean.getProcessCpuLoad();
//  }
//
//  /**
//   * Total physical memory size (bytes)
//   */
//  public long getTotalPhysicalMemory() {
//    return osBean.getTotalPhysicalMemorySize();
//  }
//
//  /**
//   * Available (free) physical memory size (bytes)
//   */
//  public long getFreePhysicalMemory() {
//    return osBean.getFreePhysicalMemorySize();
//  }
//
//  /**
//   * Memory usage ratio (0.0 ~ 1.0)
//   */
//  public double getMemoryUsage() {
//    long total = getTotalPhysicalMemory();
//    long free = getFreePhysicalMemory();
//    return (double) (total - free) / total;
//  }
//
//  //    public static void main(String[] args) throws InterruptedException {
//  //        JvmResourceMonitor m = new JvmResourceMonitor();
//  //
//  //        while (true) {
//  //            System.out.printf("CPU 전체: %.1f%%, 프로세스: %.1f%%, 메모리: %.1f%%%n",
//  //                    m.getSystemCpuLoad() * 100,
//  //                    m.getProcessCpuLoad() * 100,
//  //                    m.getMemoryUsage() * 100
//  //            );
//  //            Thread.sleep(2_000);
//  //        }
//  //    }
//}
