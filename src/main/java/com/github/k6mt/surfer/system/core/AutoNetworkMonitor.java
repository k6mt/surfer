//package com.github.k6mt.surfer.system.core;
//
//import oshi.SystemInfo;
//import oshi.hardware.HardwareAbstractionLayer;
//import oshi.hardware.NetworkIF;
//
//import java.net.NetworkInterface;
//import java.net.SocketException;
//import java.util.List;
//
//public class AutoNetworkMonitor {
//
//  private final HardwareAbstractionLayer hal;
//  private NetworkIF activeIf;
//
//  public AutoNetworkMonitor() {
//    SystemInfo si = new SystemInfo();
//    this.hal = si.getHardware();
//    selectActiveInterface();
//  }
//
//  /**
//   * Selects the physical network interface with the highest traffic (excluding virtual
//   * interfaces).
//   */
//  private void selectActiveInterface() {
//    // 1차 시도: 원래 조건으로 필터링
//    List<NetworkIF> candidates = hal.getNetworkIFs().stream()
//        .filter(n -> {
//          try {
//            NetworkInterface nif = n.queryNetworkInterface();
//            return !nif.isLoopback()
//                && nif.isUp()
//                && n.getIfOperStatus() == NetworkIF.IfOperStatus.UP;
//          } catch (SocketException e) {
//            return false;
//          }
//        })
//        .toList();
//
//    // Choose the best interface for traffic measurement
//    NetworkIF best = null;
//    long maxDelta = 0;
//
//    for (NetworkIF n : candidates) {
//      n.updateAttributes();
//      long sent1 = n.getBytesSent();
//      long recv1 = n.getBytesRecv();
//      try {
//        Thread.sleep(500);
//      } catch (InterruptedException e) {
//        Thread.currentThread().interrupt();
//        return;
//      }
//
//      n.updateAttributes();
//      long sent2 = n.getBytesSent();
//      long recv2 = n.getBytesRecv();
//      long delta = (sent2 - sent1) + (recv2 - recv1);
//
//      if (delta > maxDelta) {
//        best = n;
//        maxDelta = delta;
//      }
//    }
//
//    // If there is no interface selected for traffic measurement, select the first candidate
//    if (best == null && !candidates.isEmpty()) {
//      best = candidates.get(0);
//    }
//
//    // If there is still no interface, select from all interfaces in UP state
//    if (best == null) {
//      candidates = hal.getNetworkIFs().stream()
//          .filter(n -> {
//            try {
//              return n.queryNetworkInterface().isUp();
//            } catch (SocketException e) {
//              return false;
//            }
//          })
//          .toList();
//
//      if (!candidates.isEmpty()) {
//        best = candidates.get(0);
//      }
//    }
//
//    // Finally, if no interface is found, select the first interface
//    if (best == null && !hal.getNetworkIFs().isEmpty()) {
//      best = hal.getNetworkIFs().get(0);
//    }
//
//    // If still no interface is found, throw an exception
//    if (best == null) {
//      throw new IllegalStateException("Unable to find an active network interface.");
//    }
//
//    this.activeIf = best;
//    System.out.printf("Selected interface: %s (%s)%n",
//        activeIf.getName(), activeIf.getDisplayName());
//  }
//
//  /**
//   * Calculates the usage percentage of the selected interface.
//   *
//   * @param intervalMs measurement interval in milliseconds
//   * @return usage percentage (0.0 ~ 100.0)
//   * @throws InterruptedException if the sleep is interrupted
//   */
//  public double getNetworkUsagePercent(long intervalMs) throws InterruptedException {
//    activeIf.updateAttributes();
//    long sent1 = activeIf.getBytesSent();
//    long recv1 = activeIf.getBytesRecv();
//    long speed = activeIf.getSpeed(); // bits per second
//
//    // Set default value if speed information is not available (1 Gbps)
//    if (speed <= 0) {
//      speed = 1_000_000_000L; // 1 Gbps
//    }
//
//    Thread.sleep(intervalMs);
//    activeIf.updateAttributes();
//    long sent2 = activeIf.getBytesSent();
//    long recv2 = activeIf.getBytesRecv();
//    long deltaBytes = (sent2 - sent1) + (recv2 - recv1);
//    double deltaBits = deltaBytes * 8.0;
//    double usedBps = deltaBits / (intervalMs / 1000.0);
//
//    return (usedBps / speed) * 100.0;
//  }
//
//  // public static void main(String[] args) throws InterruptedException {
//  //     AutoNetworkMonitor monitor = new AutoNetworkMonitor();
//  //     while (true) {
//  //         double pct = monitor.getNetworkUsagePercent(1_000);
//  //         System.out.printf("Interface %s usage: %.1f%%%n",
//  //                 monitor.activeIf.getName(), pct);
//  //     }
//  // }
//}
