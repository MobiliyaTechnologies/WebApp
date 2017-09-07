# Energy Management Web App

## Getting Started

   These instructions will get you a copy of the project up and running on your local machine for development and testing purposes. See    deployment for notes on how to deploy the project on a live system.

### Prerequisites

* Install dependency components (like Bower).

* ARM template should add following configuration in app.settings

   * restServer
   
   * b2cApplicationId
   
   * tenantName
   
   * signInPolicyName
   
   * signInSignUpPolicyName
   
   * editProfilePolicyName
   
   * redirect_uri    



### Installing

Once webApp is ready need to configure following to see Data as well reports :

* Need to create campus or else you cant assoicate PI server 

* Assoicate campus with pi server.

* Add premise level power BI report urls to see reports in REPORTS section on dasboard.

* Add campus level powerBI report urls to see reports on dashboard.

* Add building  level powerBI report urls to see reports on dashboard drill down view.

* Add feedback  powerBI report url to see reports on feedback page.

* Add azureML subscribtion detials to see prediction reports.


## Deployment

 * Follow the ARMTemplate guidelines to deploy this project on Azure.
