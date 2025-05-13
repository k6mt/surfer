package com.k6m.surfer.error.core;

import com.github.javaparser.Range;
import com.github.javaparser.StaticJavaParser;
import com.github.javaparser.ast.CompilationUnit;
import com.github.javaparser.ast.body.MethodDeclaration;

import java.io.File;
import java.nio.file.Files;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

public class ErrorSourceCapture {
    private final String sourceRoot;

    public ErrorSourceCapture(String sourceRoot) {
        this.sourceRoot = sourceRoot;
    }

    /**
     * Captures the error context and returns an ErrorInfo object, including method arguments.
     */
    public ErrorInfo captureErrorContext(Exception e, Object[] args) {
        StackTraceElement elem      = e.getStackTrace()[0];
        String fqcn                 = elem.getClassName();
        String methodName           = elem.getMethodName();
        int errorLine               = elem.getLineNumber();

        StringBuilder stackTraceStr = new StringBuilder();
        for (StackTraceElement ste : e.getStackTrace()) {
            stackTraceStr.append(ste.toString()).append("\n");
        }

        try {
            File file = getSourceFile(fqcn);
            CompilationUnit cu = StaticJavaParser.parse(file);

            Optional<MethodDeclaration> mdOpt = cu.findAll(MethodDeclaration.class).stream()
                .filter(m -> m.getNameAsString().equals(methodName))
                .findFirst();

            if (mdOpt.isPresent()) {
                MethodDeclaration md = mdOpt.get();

                Range range = md.getRange()
                    .orElseThrow(() -> new IllegalStateException("No range info for method"));
                int methodStart = range.begin.line;
                int methodEnd   = range.end.line;

                List<String> allLines    = Files.readAllLines(file.toPath());
                List<String> sourceLines = new ArrayList<>();
                int errorLineIndex       = -1;

                for (int ln = methodStart; ln <= methodEnd; ln++) {
                    sourceLines.add(allLines.get(ln - 1));
                    if (ln == errorLine) {
                        errorLineIndex = ln - methodStart;
                    }
                }

                return new ErrorInfo(
                    fqcn,
                    methodName,
                    errorLine,
                    e.getMessage(),
                    sourceLines,
                    errorLineIndex,
                    stackTraceStr.toString(),
                    List.of(args)
                );
            }
        } catch (Exception ex) {
            System.err.println("[ErrorSourceReader] Failed to read source: " + ex.getMessage());
        }

        // Fallback with minimal information
        return new ErrorInfo(
            fqcn,
            methodName,
            errorLine,
            e.getMessage(),
            List.of("Not Found Error Source"),
            0,
            stackTraceStr.toString(),
            List.of(args)
        );
    }

    private File getSourceFile(String className) {
        String relPath = className.replace('.', File.separatorChar) + ".java";
        List<File> roots = new ArrayList<>();

        File projectDir = new File(System.getProperty("user.dir"));
        File defaultSrc = new File(projectDir, "src" + File.separator + "main" + File.separator + "java");

        if (sourceRoot.contains(".")) {
            String pkgPath = sourceRoot.replace('.', File.separatorChar);
            roots.add(new File(defaultSrc, pkgPath));
        } else {
            File sr = new File(sourceRoot);
            if (sr.exists()) {
                roots.add(new File(sr, "src" + File.separator + "main" + File.separator + "java"));
                roots.add(sr);
            }
        }
        roots.add(defaultSrc);

        for (File root : roots) {
            File candidate = new File(root, relPath);
            if (candidate.exists()) {
                return candidate;
            }
        }
        throw new RuntimeException("Source file not found for " + className + ". Tried roots: " + roots);
    }
}
