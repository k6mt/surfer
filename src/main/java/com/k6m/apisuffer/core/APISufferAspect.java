package com.k6m.apisuffer.core;


import jakarta.annotation.PostConstruct;
import lombok.Setter;

public class APISufferAspect {

    @Setter
    private String basePackage;

    // TODO: Implement the logic for @EnableAPISuffer annotation

    private final ApiScannerProcessor apiScannerProcessor;

    public APISufferAspect(ApiScannerProcessor apiScannerProcessor){
        this.apiScannerProcessor = apiScannerProcessor;
    }

    @PostConstruct
    public void init(){
        System.out.println("[APISufferAspect] ApiScanner Initialized with basePackage = " + basePackage);
        apiScannerProcessor.scanApis(basePackage);
    }



}
