sap.ui.define([
	"at/clouddna/training/FioriDeepDive/controller/BaseController",
	"sap/m/MessageBox",
	"sap/ui/model/Filter",
	"sap/ui/model/FilterOperator",
	"sap/ui/core/Fragment",
	"sap/ui/model/json/JSONModel",
	"sap/ui/generic/app/navigation/service/NavigationHandler"
], function (BaseController, MessageBox, Filter, FilterOperator, Fragment, JSONModel, NavigationHandler) {
	"use strict";

	return BaseController.extend("at.clouddna.training.FioriDeepDive.controller.Master", {

		onInit: function () {
			this.getRouter().getRoute("Master").attachPatternMatched(this._onPatternMatched, this);
		},

		_onPatternMatched: function () {
			let sCurrentLocale = sap.ui.getCore().getConfiguration().getLanguage(),
				oLanguageModel = new JSONModel({
					currentLanguage: sCurrentLocale
				});

			this.getView().byId("master_smarttable").setDemandPopin(true);

			oLanguageModel.attachPropertyChange(function (oProperty) {
				let oLanguage = oProperty.getParameter("value"),
					sFormatLocale = sap.ui.getCore().getConfiguration().getFormatLocale();

				sap.ui.getCore().getConfiguration().setLanguage(oLanguage);
				sap.ui.getCore().getConfiguration().setFormatLocale(sFormatLocale);
			});

			this.setModel(oLanguageModel, "languageModel");

			let oParameter = this.getOwnerComponent().getCustomerID();

			if (oParameter) {
				this.getRouter().navTo("Customer", {
					customerid: oParameter
				}, false);
			}
		},

		onCustomerPress: function (oEvent) {
			let sCustomerID = oEvent.getSource().getBindingContext().sPath.split("'")[1];

			this.getRouter().navTo("Customer", {
				customerid: sCustomerID
			}, false);
		},

		onNewCustomerPress: function (oEvent) {
			this.getRouter().navTo("Customer", {
				customerid: "create"
			}, false);
		},

		onDeleteCustomerPress: function (oEvent) {
			let sCustomerPath = oEvent.getSource().getBindingContext().sPath,
				oTable = this.getView().byId("master_smarttable");

			this.deleteODataEntry(this.getModel(), sCustomerPath, null, oTable);
		},

		onScanQRCodePress: function (oEvent) {
			cordova.plugins.barcodeScanner.scan(
				function (oResult) {
					if (!oResult.cancelled) {
						this.getRouter().navTo("Customer", {
							customerid: oResult.text
						}, false);
					}
				}.bind(this),
				function (oError) {
					MessageBox.error(oError);
				}
			);
		}
	});
});