package com.highradius.models;

import java.sql.Date;
import java.sql.Timestamp;

public class InvoicePoJo {
	private Long invoiceId;
	private Long documentId;
	private Timestamp clearDate;
	private Date postingDate;
	private Date documentCreateDate;
	private Date documentCreateDate_1;
	private Date dueDate;
	private Date baselineCreateDate;
	private String customerNumber;
	private String businesCode;
	private String customerName;
	private String invoiceCurrency;
	private String documentType;
	private String areaBusiness;
	private String customerPaymentTerms;
	private Double totalOpenAmount;
	private Integer businessYear;
	private Byte isOpen;
	private Byte postingId;

	public String getBusinesCode() {
		return businesCode;
	}

	public void setBusinesCode(String businesCode) {
		this.businesCode = businesCode;
	}

	public Long getInvoiceId() {
		return invoiceId;
	}

	public void setInvoiceId(Long invoiceId) {
		try {
			this.invoiceId = invoiceId;
		} catch (Exception e) {
			this.invoiceId = null;
		}
	}

	public Long getDocumentId() {
		return documentId;
	}

	public void setDocumentId(Long documentId) {
		this.documentId = documentId;
	}

	public Byte getPostingId() {
		return postingId;
	}

	public void setPostingId(Byte postingId) {
		this.postingId = postingId;
	}

	public String getCustomerNumber() {
		return customerNumber;
	}

	public void setCustomerNumber(String customerNumber) {
		this.customerNumber = customerNumber;
	}

	public Timestamp getClearDate() {
		return clearDate;
	}

	public void setClearDate(Timestamp clearDate) {
		try {
			this.clearDate = clearDate;
		} catch (Exception e) {
			this.clearDate = null;
		}
	}

	public Date getPostingDate() {
		return postingDate;
	}

	public void setPostingDate(Date postingDate) {
		this.postingDate = postingDate;
	}

	public Date getDocumentCreateDate() {
		return documentCreateDate;
	}

	public void setDocumentCreateDate(Date documentCreateDate) {
		this.documentCreateDate = documentCreateDate;
	}

	public Date getDocumentCreateDate_1() {
		return documentCreateDate_1;
	}

	public void setDocumentCreateDate_1(Date documentCreateDate_1) {
		this.documentCreateDate_1 = documentCreateDate_1;
	}

	public Date getDueDate() {
		return dueDate;
	}

	public void setDueDate(Date dueDate) {
		this.dueDate = dueDate;
	}

	public Date getBaselineCreateDate() {
		return baselineCreateDate;
	}

	public void setBaselineCreateDate(Date baselineCreateDate) {
		this.baselineCreateDate = baselineCreateDate;
	}

	public String getCustomerName() {
		return customerName;
	}

	public void setCustomerName(String customerName) {
		this.customerName = customerName;
	}

	public String getInvoiceCurrency() {
		return invoiceCurrency;
	}

	public void setInvoiceCurrency(String invoiceCurrency) {
		this.invoiceCurrency = invoiceCurrency;
	}

	public String getDocumentType() {
		return documentType;
	}

	public void setDocumentType(String documentType) {
		this.documentType = documentType;
	}

	public String getAreaBusiness() {
		return areaBusiness;
	}

	public void setAreaBusiness(String areaBusiness) {
		this.areaBusiness = areaBusiness;
	}

	public String getCustomerPaymentTerms() {
		return customerPaymentTerms;
	}

	public void setCustomerPaymentTerms(String customerPaymentTerms) {
		this.customerPaymentTerms = customerPaymentTerms;
	}

	public Double getTotalOpenAmount() {
		return totalOpenAmount;
	}

	public void setTotalOpenAmount(Double invoiceAmount) {
		this.totalOpenAmount = invoiceAmount;
	}

	public Integer getBusinessYear() {
		return businessYear;
	}

	public void setBusinessYear(Integer businessYear) {
		this.businessYear = businessYear;
	}

	public Byte getIsOpen() {
		return isOpen;
	}

	public void setIsOpen(Byte isOpen) {
		this.isOpen = isOpen;
	}
}
