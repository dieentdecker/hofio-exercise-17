/*  Logon configuration used by packaged apps (N.B. We do not include the fioriclient 
 *  plugin to packaged apps but just borrow some of its configuration format.)
 *	The {{}} placeholder values, if any, will be populated before the first build. 
 *	The "appName" and "appVersion" will be updated with the input values in the build wizard.
 *	Do not change the "appID", "fioriURL" and "auth" values to avoid inconsistent 
 *	app settings.
 */
var fiori_client_appConfig = {
	"appName": "FioriDeepDive",
	"appVersion": "1.2",
	"appID": "com.sap.webide.x0266fcbfa9414bb8a004586e57efe22d",
	"fioriURL": "https://mobile-ed926da1b.eu2.hana.ondemand.com:443",
	"auth": [
		{
			"type": "saml2.web.post",
			"config": {
				"saml2.web.post.authchallengeheader.name": "com.sap.cloud.security.login",
				"saml2.web.post.finish.endpoint.uri": "/SAMLAuthLauncher",
				"saml2.web.post.finish.endpoint.redirectparam": "finishEndpointParam"
			}
		}
	],
	"communicatorId": "REST"
};