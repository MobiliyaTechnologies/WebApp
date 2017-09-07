# Energy Management Web App

## Getting Started

These instructions will get you a copy of the project up and running on your local machine for development and testing purposes. See deployment for notes on how to deploy the project on a live system.
### Prerequisites

1. Bower component need to be install which are specified in bower.json
    - ex - bower install


2. ARM template should add following configuration in app.settings
   - restServer
   - b2cApplicationId
   - tenantName
   - signInPolicyName
   - signInSignUpPolicyName
   - editProfilePolicyName
   - redirect_uri    

    Example : Web.config should have following values

```

    <add key="restServer" value="https://emtestrest.azurewebsites.net/" />
    <add key="b2cApplicationId" value="adcfca9a-078a-4e5f-9f20-" />
    <add key="tenantName" value="ABCB2C.onmicrosoft.com" />
    <add key="signInPolicyName" value="B2C_1_b2cSignin" />
    <add key="signInSignUpPolicyName" value="B2C_1_b2cSignup" />
    <add key="editProfilePolicyName" value="B2C_1_b2cSiPe" />
    <add key="redirect_uri" value="http://localhost:65159/redirect.html" />
    <add key="adB2CSignIn" value="" />
    <add key="adB2CSignInSignUp" value="" />
    <add key="demoMode" value="true" />
```
	
### Installing

Once webApp is ready need to configure following to see Data as well reports :

1. Need to create campus or else you cant assoicate PI server
2. Assoicate campus with pi server.
3. Add university level power BI report urls to see reports in REPORTS section on dasboard.
4. Add campus level powerBI report urls to see reports on dashboard.
5. Add building  level powerBI report urls to see reports on dashboard drill down view.
6. Add feedback  powerBI report url to see reports on feedback page.
7. Add azureML subscribtion detials to see prediction reports.








## Versioning

We use [SemVer](http://semver.org/) for versioning. For the versions available, see the [tags on this repository](https://github.com/your/project/tags). 

