sap.ui.define([
	"sap/ui/core/UIComponent",
	"sap/ui/Device",
	"at/clouddna/training/FioriDeepDive/model/models",
	"sap/m/MessageBox"
], function (UIComponent, Device, models, MessageBox) {
	"use strict";

	return UIComponent.extend("at.clouddna.training.FioriDeepDive.Component", {

		metadata: {
			manifest: "json"
		},

		/**
		 * The component is initialized by UI5 automatically during the startup of the app and calls the init method once.
		 * @public
		 * @override
		 */
		init: function () {
			// call the base component's init function
			UIComponent.prototype.init.apply(this, arguments);

			// enable routing
			this.getRouter().initialize();

			// set the device model
			this.setModel(models.createDeviceModel(), "device");

			this.getModel().attachBatchRequestFailed(function (oEvent) {
				let oResponse = oEvent.getParameters().response;

				MessageBox.show(
					oEvent.getParameters().url, {
						icon: MessageBox.Icon.ERROR,
						title: oResponse.message + ": " + oResponse.statusCode + " " + oResponse.statusText,
						actions: [MessageBox.Action.OK],
					});
			});

			this.getModel().attachRequestFailed(function (oEvent) {
				let oResponse = oEvent.getParameters().response;

				MessageBox.show(
					oEvent.getParameters().url, {
						icon: MessageBox.Icon.ERROR,
						title: oResponse.message + ": " + oResponse.statusCode + " " + oResponse.statusText,
						actions: [MessageBox.Action.OK],
					});
			});

			this._getStartupParameters();
		},

		_getStartupParameters: function () {
			let oComponentData = this.getComponentData();

			if (oComponentData && oComponentData.startupParameters) {
				if (oComponentData.startupParameters.customerID) {
					this._customerID = oComponentData.startupParameters.customerID[0];
				}
			} else {
				let sCustomerID = jQuery.sap.getUriParameters().get("customerID");

				if (sCustomerID) {
					this._customerID = sCustomerID;
				}
			}
		},

		getCustomerID: function () {
			return this._customerID;
		},

	});
});