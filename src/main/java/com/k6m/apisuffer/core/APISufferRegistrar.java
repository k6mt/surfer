package com.k6m.apisuffer.core;

import org.springframework.beans.factory.support.AbstractBeanDefinition;
import org.springframework.beans.factory.support.BeanDefinitionBuilder;
import org.springframework.beans.factory.support.BeanDefinitionRegistry;
import org.springframework.context.annotation.ImportBeanDefinitionRegistrar;
import org.springframework.core.type.AnnotationMetadata;
import org.springframework.util.ClassUtils;

public class APISufferRegistrar implements ImportBeanDefinitionRegistrar {

    @Override
    public void registerBeanDefinitions(AnnotationMetadata metadata, BeanDefinitionRegistry registry) {
        String basePackage = ClassUtils.getPackageName(metadata.getClassName());

        BeanDefinitionBuilder processorBuilder = BeanDefinitionBuilder
                .genericBeanDefinition(ApiScannerProcessor.class);
        registry.registerBeanDefinition("apiScannerProcessor", processorBuilder.getBeanDefinition());

        /**
         * Aspect Registrar (Constructor injection + basePackage attribute)
         */
        BeanDefinitionBuilder aspectBuilder = BeanDefinitionBuilder
                .genericBeanDefinition(APISufferAspect.class);
        aspectBuilder.setAutowireMode(AbstractBeanDefinition.AUTOWIRE_CONSTRUCTOR);
        aspectBuilder.addPropertyValue("basePackage", basePackage);
        registry.registerBeanDefinition("apiSufferAspect", aspectBuilder.getBeanDefinition());
    }
}
