package com.k6m.apisuffer.core;

import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.support.BeanDefinitionBuilder;
import org.springframework.beans.factory.support.BeanDefinitionRegistry;
import org.springframework.context.annotation.ImportBeanDefinitionRegistrar;
import org.springframework.core.type.AnnotationMetadata;
import org.springframework.util.ClassUtils;

@Slf4j
public class APISufferRegistrar implements ImportBeanDefinitionRegistrar {

    @Override
    public void registerBeanDefinitions(AnnotationMetadata metadata, BeanDefinitionRegistry registry) {
        String basePackage = ClassUtils.getPackageName(metadata.getClassName());

        BeanDefinitionBuilder beanDefinitionBuilder = BeanDefinitionBuilder.genericBeanDefinition(APISufferAspect.class);
        beanDefinitionBuilder.addConstructorArgValue(basePackage);
        beanDefinitionBuilder.addConstructorArgReference("configProperties");
        beanDefinitionBuilder.addConstructorArgReference("apiSufferAspect");
        registry.registerBeanDefinition("apiSufferAspect",
                beanDefinitionBuilder.getBeanDefinition());
    }
}
