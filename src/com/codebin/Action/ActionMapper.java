package com.codebin.Action;

import org.springframework.context.ApplicationContext;
import org.springframework.context.support.ClassPathXmlApplicationContext;

import com.codebin.Manager.FilesManager;
import com.codebin.Manager.ManagerInterface;

public class ActionMapper {
	private String fileName;
	private String data;
	private String extension;

	public String getFileName() {
		return fileName;
	}

	public void setFileName(String fileName) {
		this.fileName = fileName;
	}

	public String getData() {
		return data;
	}

	public void setData(String data) {
		this.data = data;
	}
	
	public String getExtension() {
		return extension;
	}

	public void setExtension(String extension) {
		this.extension = extension;
	}

	public String getFileData() {
		ApplicationContext context = new ClassPathXmlApplicationContext("applicationContext.xml");
		ManagerInterface managerObj = (FilesManager) context.getBean("manager");
		data = managerObj.getFileData(fileName);
		((ClassPathXmlApplicationContext) context).close();
		if (data != "" || data != null) {
			return "success";
		} else
			return "error";
	}

	public String saveNewFile() {
		System.out.println(data);
		ApplicationContext context = new ClassPathXmlApplicationContext("applicationContext.xml");
		ManagerInterface managerObj = (FilesManager) context.getBean("manager");
		fileName = managerObj.saveNewFile(data, extension);
		((ClassPathXmlApplicationContext) context).close();
		if (fileName != "" || fileName != null) {
			return "success";
		} else {
			return "error";
		}
	}
}
