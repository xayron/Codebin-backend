package com.codebin.Manager;

import java.io.File;
import java.io.IOException;
import java.nio.charset.StandardCharsets;
import java.util.Arrays;

import org.apache.commons.io.FileUtils;
import org.apache.commons.lang3.RandomStringUtils;

public class FilesManager implements ManagerInterface {
	
	public String getNewFileName() {
		return RandomStringUtils.randomAlphabetic(5, 20) + ".txt";
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

	@Override
	public Boolean saveNewFile(String data) {
		String[] pathNames = getFilesList();
		String fileName = getNewFileName();
		boolean isPresent = Arrays.asList(pathNames).contains(fileName);
		if(!isPresent) {
			try {
				File file = new File(getPath() + fileName);
				FileUtils.writeStringToFile(file, data, StandardCharsets.UTF_8);
			} catch (IOException e) {
				System.out.println(e);
				e.printStackTrace();
				return false;
			}
		} else {
			saveNewFile(data);
		}
		return true;
	}

	@Override
	public String getFileData(String fileName) {
		try {
			File file = new File(getPath() + fileName);
			String data = FileUtils.readFileToString(file, StandardCharsets.UTF_8);
			return data;
		} catch (IOException e) {
			System.out.println(e);
			e.printStackTrace();
		}
		return "";
	}
}