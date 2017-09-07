# Energy Management Web App

## Getting Started

These instructions will get you a copy of the project up and running on your local machine for development and testing purposes. See deployment for notes on how to deploy the project on a live system.
### Prerequisites

1.Bower component need to be install which are specified in bower.json 
  ex - bower install
2. ARM template should add following configuration in app.settings
   -restServer
   -b2cApplicationId
   -tenantName
   -signInPolicyName
   -signInSignUpPolicyName
   -editProfilePolicyName
   -redirect_uri    

```
Give examples
```

### Installing

Once webApp is ready need to configure following to see Data as well reports :

1.Need to create campus or else you cant assoicate PI server 
2.Assoicate campus with pi server.
3.Add university level power BI report urls to see reports in REPORTS section on dasboard.
4.Add campus level powerBI report urls to see reports on dashboard.
5.Add building  level powerBI report urls to see reports on dashboard drill down view.
6.Add feedback  powerBI report url to see reports on feedback page.
7.Add azureML subscribtion detials to see prediction reports.






## Running the tests

Explain how to run the automated tests for this system

### Break down into end to end tests

Explain what these tests test and why

```
Give an example
```

### And coding style tests

Explain what these tests test and why

```
Give an example
```

## Deployment

Add additional notes about how to deploy this on a live system

## Built With

* [Dropwizard](http://www.dropwizard.io/1.0.2/docs/) - The web framework used
* [Maven](https://maven.apache.org/) - Dependency Management
* [ROME](https://rometools.github.io/rome/) - Used to generate RSS Feeds

## Contributing

Please read [CONTRIBUTING.md] for details on our code of conduct, and the process for submitting pull requests to us.

## Versioning

We use [SemVer](http://semver.org/) for versioning. For the versions available, see the [tags on this repository](https://github.com/your/project/tags). 

## License

Currently keep this open