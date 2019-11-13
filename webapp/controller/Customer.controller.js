 sap.ui.define([
 	"at/clouddna/training/FioriDeepDive/controller/BaseController",
 	"sap/ui/model/json/JSONModel",
 	"sap/m/MessageBox",
 	"sap/ui/core/routing/History",
 	"sap/m/UploadCollectionParameter"
 ], function (BaseController, JSONModel, MessageBox, History, UploadCollectionParameter) {
 	"use strict";

 	return BaseController.extend("at.clouddna.training.FioriDeepDive.controller.Customer", {
 		_sMode: "",
 		_validInput: true,

 		onInit: function () {
 			this.getRouter().getRoute("Customer").attachPatternMatched(this._onPatternMatched, this);
 		},

 		_onPatternMatched: function (oEvent) {
 			let sCustomerID = oEvent.getParameter("arguments").customerid,
 				editModel = new JSONModel({
 					editmode: false
 				}),
 				oSmartForm = this.getView().byId("customer_smartform"),
 				oUploadCollection = this.getView().byId("customer_uploadcollection");

 			this.getView().unbindElement();
 			oUploadCollection.setUploadUrl("/sap/opu/odata/sap/ZHOUI5_CUSTOMER_SRV/CustomerDocumentSet");
 			this.setModel(editModel, "editModel");

 			oSmartForm.attachEditToggled(function (oEvent) {
 				let bEdit = oEvent.getParameter("editable");

 				if (bEdit) {
 					sap.ushell.Container.setDirtyFlag(bEdit);
 				}
 				editModel.setProperty("/editmode", bEdit);
 			});

 			if (sCustomerID === "create") {
 				oUploadCollection.setVisible(false);
 				oSmartForm.setEditable(true);
 				this._sMode = "create";
 				this.getView().byId("customer_button_cancel").setEnabled(false);
 				this.getView().byId("customer_button_qrcode").setVisible(false);
 				this._oContext = this.getModel().createEntry("/CustomerSet");
 				this.getView().setBindingContext(this._oContext);
 				oSmartForm.check();
 			} else {
 				oUploadCollection.setVisible(true);
 				this.getView().byId("customer_button_cancel").setEnabled(true);
 				this.getView().byId("customer_button_qrcode").setVisible(true);
 				this.getView().bindElement("/CustomerSet(guid'" + sCustomerID + "')");
 			}
 		},

 		onDocumentPress: function (oEvent) {
 			this.getModel().read(oEvent.getSource().getBindingContext().sPath, {
 				success: function (oData, response) {
 					if (oData.DocumentType === "application/pdf") {
 						let pdfViewer = new sap.m.PDFViewer();

 						pdfViewer.setSource(oData.__metadata.edit_media + "/$value");
 						pdfViewer.setTitle(oData.DocumentName);
 						pdfViewer.open();
 					} else {
 						sap.m.URLHelper.redirect(oData.__metadata.edit_media + "/$value");
 					}
 				}
 			});
 		},

 		onUploadComplete: function (oEvent) {
 			let oUploadCollection = this.getView().byId("customer_uploadcollection");
 			oUploadCollection.setBusy(false);
 			this.getModel().refresh();
 		},

 		onUploadChange: function (oEvent) {
 			let oUploadCollection = this.getView().byId("customer_uploadcollection"),
 				oCustomerHeaderToken = new UploadCollectionParameter({
 					name: "x-csrf-token",
 					value: this.getModel().getSecurityToken()
 				});

 			oUploadCollection.addHeaderParameter(oCustomerHeaderToken);
 		},

 		onBeforeUploadStarts: function (oEvent) {
 			let oUploadCollection = this.getView().byId("customer_uploadcollection"),
 				oCustomerHeaderSlug = new UploadCollectionParameter({
 					name: "slug",
 					value: oEvent.getParameter("fileName")
 				});
 			oEvent.getParameters().addHeaderParameter(oCustomerHeaderSlug);

 			oUploadCollection.setBusy(true);
 		},

 		onDocumentDelete: function (oEvent) {
 			let aDocumentPath = oEvent.getParameter("documentId").split(","),
 				sDocId = aDocumentPath[0],
 				sCustomerId = aDocumentPath[1],
 				oModel = this.getModel(),
 				oUploadCollection = this.getView().byId("customer_uploadcollection");

 			this.deleteODataEntry(
 				oModel,
 				"/CustomerDocumentSet(DocId=guid'" + sDocId + "',CustomerId=guid'" + sCustomerId + "')",
 				null,
 				oUploadCollection);
 		},

 		onCancelPress: function (oEvent) {
 			let oSmartForm = this.getView().byId("customer_smartform");

 			oSmartForm.check();
 			if (this._isFormValid()) {
 				oSmartForm.setEditable(false);
 				this._removeAllMessages();

 				if (this.getModel().hasPendingChanges()) {
 					this.getModel().resetChanges();
 				}

 				sap.ushell.Container.setDirtyFlag(false);
 			}
 		},

 		_isFormValid: function () {
 			let oSmartForm = this.getView().byId("customer_smartform"),
 				oGroups = oSmartForm.getGroups(),
 				oGroupElements = [],
 				oElements = [];

 			oGroups.forEach(function (oGroup) {
 				let oItems = oGroup.getGroupElements();

 				oItems.forEach(function (oItem) {
 					oGroupElements.push(oItem);
 				});
 			});

 			oGroupElements.forEach(function (oGroupElement) {
 				let oItems = oGroupElement.getElements();

 				oItems.forEach(function (oItem) {
 					oElements.push(oItem);
 				});
 			});

 			return oElements.every(function (oElement) {
 				if (oElement.getValueState() == "Error") {
 					this._insertMessage("ERROR", "Error", oElement.getValueStateText());
 				}

 				return oElement.getValueState() === "None";
 			}.bind(this));
 		},

 		onSavePress: function (oEvent) {
 			let oSmartForm = this.getView().byId("customer_smartform");

 			oSmartForm.check();
 			if (this._isFormValid()) {
 				oSmartForm.setEditable(false);
 				this._removeAllMessages();
 				if (this.getModel().hasPendingChanges()) {
 					this.getModel().submitChanges();
 					sap.ushell.Container.setDirtyFlag(false);
 					if (this._sMode === "create") {
 						MessageBox.information(this.geti18nText("dialog.create.success"), {
 							onClose: function (oEvent) {
 								this.onNavBack();
 							}.bind(this)
 						});
 						this.onNavBack();
 					} else {
 						MessageBox.information(this.geti18nText("dialog.update.success"));
 					}
 				}
 				sap.ushell.Container.setDirtyFlag(false);
 			}
 		},

 		onQRCodePress: function (oEvent) {
 			let sCustomerID = this.getView().getBindingContext().sPath.split("'")[1],
 				url = "https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=" 
 						+ sCustomerID;

 			var oLightBox = new sap.m.LightBox({
 				imageContent: new sap.m.LightBoxItem({
 					imageSrc: url,
 					title: sCustomerID,
 					subtitle: "",
 				})
 			});
 			oLightBox.open();
 		}
 	});
 });