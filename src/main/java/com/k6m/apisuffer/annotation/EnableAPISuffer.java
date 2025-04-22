package com.k6m.apisuffer.annotation;

import com.k6m.apisuffer.core.APISufferRegistrar;
import org.springframework.context.annotation.Import;

import java.lang.annotation.*;

@Retention(RetentionPolicy.RUNTIME)
@Target(ElementType.TYPE)
@Documented
@Import(APISufferRegistrar.class)
public @interface EnableAPISuffer {
}
