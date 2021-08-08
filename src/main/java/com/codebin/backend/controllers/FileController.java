package com.codebin.backend.controllers;

import org.apache.commons.io.FileUtils;
import org.apache.commons.lang3.RandomStringUtils;
import org.springframework.web.bind.annotation.*;

import java.io.File;
import java.io.IOException;
import java.nio.charset.StandardCharsets;
import java.nio.file.Files;
import java.nio.file.Paths;
import java.nio.file.attribute.BasicFileAttributeView;
import java.nio.file.attribute.BasicFileAttributes;
import java.util.Arrays;
import java.util.Date;
import java.util.Map;
import java.util.concurrent.TimeUnit;

@CrossOrigin(origins = "*")
@RestController
public class FileController {
    private String auth = "";

    public String getNewFileName() {
        return RandomStringUtils.randomAlphabetic(5, 20);
    }

    public String getPath() {
        String path = "files/";
        File dir = new File(path);
        String absolutePath = dir.getAbsolutePath();
        if (!dir.exists()){
            System.out.println("Doesn't exist");
            if(!dir.mkdirs()) System.out.println("Cannot create directory");
        }
        return absolutePath+"/";
    }

    public String[] getFilesList() {
        String[] fileNames;
        File f = new File(getPath());
        fileNames = f.list();
        return fileNames;
    }

    @RequestMapping(value = "/saveFile", method = RequestMethod.POST)
    public String saveFile(@RequestBody Map<String, Object> payload) {
        String data = String.valueOf(payload.get("data"));
        String extension = String.valueOf(payload.get("extension"));
        return  saveNewFile(data, extension);
    }

    @RequestMapping(value = "/editFile", method = RequestMethod.POST)
    public String editFile(@RequestBody Map<String, Object> payload) {
        String data = String.valueOf(payload.get("data"));
        String fileName = String.valueOf(payload.get("fileName"));
        File file = new File(getPath() + fileName);
        try {
            FileUtils.writeStringToFile(file, data, StandardCharsets.UTF_8);
            return fileName;
        } catch (IOException e) {
            e.printStackTrace();
        }
        return "";
    }

    public String saveNewFile(String data, String extension) {
        String[] pathNames = getFilesList();
        String fileName = getNewFileName();
        boolean isPresent = Arrays.asList(pathNames).contains(fileName);
        if(!isPresent) {
            try {
                File file = new File(getPath() + fileName + "." + extension);
                FileUtils.writeStringToFile(file, data, StandardCharsets.UTF_8);
                return fileName;
            } catch (IOException e) {
                e.printStackTrace();
            }
        } else {
            saveNewFile(data, extension);
        }
        return "";
    }

    @GetMapping("/getFileData/{fileName}")
    public String getFileData(@PathVariable("fileName") String fileName) {
        try {
            File file = new File(getPath() + fileName);
            return FileUtils.readFileToString(file, StandardCharsets.UTF_8);
        } catch (IOException e) {
            e.printStackTrace();
        }
        return "";
    }

    @GetMapping("/hello/{name}")
    public String hello(@PathVariable("name") String name) {
        return "Hello " + name;
    }

    @GetMapping("/")
    public String start() {
        return "Hello World";
    }

    @GetMapping("/getAuth")
    public String getAuth() {
        auth = RandomStringUtils.randomAlphabetic(60);
        return auth;
    }

    public String deleteAllFiles() throws IOException {
        String[] fileNames = getFilesList();
        Date today = new Date();
        int count = 0, deleted = 0;
        for(String fileName : fileNames) {
            File file = new File(getPath() + fileName);
            BasicFileAttributeView basicFileAttributeView = Files.getFileAttributeView(Paths.get(file.getAbsolutePath()), BasicFileAttributeView.class);
            BasicFileAttributes attr = basicFileAttributeView.readAttributes();
            long creationDate = attr.creationTime().toMillis();
            long diffInMill = Math.abs(today.getTime() - creationDate);
            long diff = TimeUnit.DAYS.convert(diffInMill, TimeUnit.MILLISECONDS);
            if(diff == 0) {
                count++;
                if(file.delete()) deleted++;
            }
        }
        return "Count: " + count + " Deleted: " + deleted;
    }

    @RequestMapping(value = "/deleteFiles", method = RequestMethod.POST)
    public String deleteFiles(@RequestBody Map<String, Object> payload) throws IOException {
        String user = String.valueOf(payload.get("user"));
        String pass = String.valueOf(payload.get("pass"));
        String authString = String.valueOf(payload.get("auth"));
        if(user.equals("sudo.dev") && pass.equals("theseFilesCanBeDeletedNow") && authString.equals(auth))
            return deleteAllFiles();
        else return "Authentication Error";
    }
}


