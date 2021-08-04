package com.codebin.backend.controllers;

import org.apache.commons.lang3.RandomStringUtils;
import org.apache.commons.io.FileUtils;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RestController;

import java.io.File;
import java.io.IOException;
import java.nio.charset.StandardCharsets;
import java.util.Arrays;

@RestController
public class FileController {
    public String getNewFileName() {
        return RandomStringUtils.randomAlphabetic(5, 20);
    }

    public String getPath() {
        String path = "files/";
        File dir = new File(path);
        String absolutePath = dir.getAbsolutePath();
        if (!dir.exists()){
            System.out.println("Doesn't exist");
            dir.mkdirs();
        }
        return absolutePath+"/";
    }

    public String[] getFilesList() {
        String[] fileNames;
        File f = new File(getPath());
        fileNames = f.list();
        return fileNames;
    }

    @GetMapping("/saveNewFile")
    public void saveNewFile(String data, String extension) {
        String[] pathNames = getFilesList();
        String fileName = getNewFileName();
        boolean isPresent = Arrays.asList(pathNames).contains(fileName);
        if(!isPresent) {
            try {
                File file = new File(getPath() + fileName + "." + extension);
                FileUtils.writeStringToFile(file, data, StandardCharsets.UTF_8);
                System.out.println(fileName);
            } catch (IOException e) {
                System.out.println(e);
                e.printStackTrace();
            }
        } else {
            saveNewFile(data, extension);
        }
    }

    @GetMapping("/getFileData/{fileName}")
    public void getFileData(@PathVariable("fileName") String fileName) {
        try {
            File file = new File(getPath() + fileName);
            System.out.println(FileUtils.readFileToString(file, StandardCharsets.UTF_8));
        } catch (IOException e) {
            System.out.println(e);
            e.printStackTrace();
        }
        System.out.println();
    }
}