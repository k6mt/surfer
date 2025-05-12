package com.k6m.surfer.util;

import com.github.javaparser.StaticJavaParser;
import com.github.javaparser.ast.CompilationUnit;
import com.github.javaparser.ast.body.MethodDeclaration;

import java.io.File;
import java.nio.file.Files;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

/**
 * Utility to parse and print source snippets when an exception occurs.
 */
public class ErrorSourceReader {
    private final String sourceRoot;

    /**
     * @param sourceRoot The base directory or package name to locate sources.
     *                   If it contains '.', it is treated as a package root
     *                   (relative to src/main/java). Otherwise, it is treated
     *                   as a filesystem path to the project root or source root.
     */
    public ErrorSourceReader(String sourceRoot) {
        this.sourceRoot = sourceRoot;
    }

    /**
     * Prints the method source and context around the error line for the top stack trace element.
     */
    public void printErrorContext(Exception e) {
        StackTraceElement elem = e.getStackTrace()[0];
        String fqcn = elem.getClassName();
        String methodName = elem.getMethodName();
        int errorLine = elem.getLineNumber();

        try {
            File file = getSourceFile(fqcn);
            CompilationUnit cu = StaticJavaParser.parse(file);

            Optional<MethodDeclaration> mdOpt = cu.findAll(MethodDeclaration.class).stream()
                .filter(m -> m.getNameAsString().equals(methodName))
                .findFirst();

            if (mdOpt.isPresent()) {
                System.out.println("---- Source for " + fqcn + "#" + methodName + " ----");

                List<String> lines = Files.readAllLines(file.toPath());
                int start = Math.max(errorLine - 3, 1);
                int end   = Math.min(errorLine + 2, lines.size());
                for (int ln = start; ln <= end; ln++) {
                    String prefix = (ln == errorLine ? "=> " : "   ") + ln + ": ";
                    System.out.println(prefix + lines.get(ln - 1));
                }
            } else {
                System.out.println("Method '" + methodName + "' not found in " + fqcn);
            }

        } catch (Exception ex) {
            System.err.println("[ErrorSourceReader] Failed to read source: " + ex.getMessage());
        }
    }

    /**
     * Attempts to locate the .java source file for a given fully qualified class name.
     * Supports two modes:
     * 1. If sourceRoot contains '.', treat as package and resolve under src/main/java
     * 2. Otherwise, treat sourceRoot as a filesystem path (project or source root)
     */
    private File getSourceFile(String className) {
        String relPath = className.replace('.', File.separatorChar) + ".java";
        List<File> roots = new ArrayList<>();

        // Default source directory: src/main/java under project working dir
        File projectDir = new File(System.getProperty("user.dir"));
        File defaultSrc = new File(projectDir, "src" + File.separator + "main" + File.separator + "java");

        if (sourceRoot.contains(".")) {
            // Treat sourceRoot as package path under defaultSrc
            String pkgPath = sourceRoot.replace('.', File.separatorChar);
            File pkgRoot = new File(defaultSrc, pkgPath);
            roots.add(pkgRoot);
        } else {
            // Treat sourceRoot as filesystem path
            File sr = new File(sourceRoot);
            if (sr.exists()) {
                // might be project or src root
                roots.add(new File(sr, "src" + File.separator + "main" + File.separator + "java"));
                roots.add(sr);
            }
        }
        // Fallback to defaultSrc
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
