#Week 0 — Billing and Architecture

# Business Scenario
1. Your company has asked to put together a technical presentation on the proposed architecture that will be implemented so it can be reviewed by the fractional CTO.
2. Your presentation must include a technical architectural diagram and breakdown of possible services used along with their justification.
3. The company also wants to generally know what spend we expect to encounter and how we will ensure we keep our spending low.

# Weekly Outcome
1. Gain confidence when working meter-billing with a Cloud Service Provider (CSP)
2. To understand how to build useful architecture diagrams
3. To gain a general idea of the cost of common cloud services
4. To ensure we have a working AWS account

#  Homework Challenges
1. Destroy your root account credentials, Set MFA, IAM role
2. Use EventBridge to hookup Health Dashboard to SNS and send notification when there is a service health issue.
3. Review all the questions of each pillars in the Well Architected Tool (No specialized lens)
4. Create an architectural diagram (to the best of your ability) the CI/CD logical pipeline in Lucid Charts
5. Research the technical and service limits of specific services and how they could impact the technical path for technical flexibility. 
6. Open a support ticket and request a service limit

# solutions
# 1 for using gitpod we have to install aws cli and configrize. Used cli commands 
```sh
    1. curl "https://awscli.amazonaws.com/awscli-exe-linux-x86_64.zip" -o "awscliv2.zip"
    2. sudo ./aws/install
    3. unzip awscliv2.zip
    5. sudo ./aws/install
    6. aws sts get-user-id
    7. aws get-account-information
    8. aws account get-contact-information
    9. aws sts get-caller-identity
```


## update gitpod.yml file 
``` yml
tasks:
  - name: aws-cli
    env:
      AWS_CLI_AUTO_PROMPT: on-partial
    init: |
      cd /workspace
      curl "https://awscli.amazonaws.com/awscli-exe-linux-x86_64.zip" -o "awscliv2.zip"
      unzip awscliv2.zip
      sudo ./aws/install
      cd $THEIA_WORKSPACE_ROOT
```
      
## whan we configure aws cli to gitpo we can use the commands to save our credentialas in local veriable
``` sh
    gp env AWS_ACCESS_KEY_ID=""
    gp env AWS_SECRET_ACCESS_KEY=""
    gp env AWS_DEFAULT_REGION=us-east-1

```

## check if aws cli successfully configured 
``` sh
    aws sts get-caller-identity
```

# 2 Creating a Billing Alarm by CLI:
 1. Enable Billing ->  `Billing Preferences` ->  `Receive Billing Alerts` -> `Save Preferences`
 2. create SNS topic  
 ``` sh
    aws sns create-topic --name billing-alarm
 ```
 3. create a email subscription supply the TopicARN which is returned above command
 ``` sh
    aws sns subscribe \
    --topic-arn TopicARN \
    --protocol email \
    --notification-endpoint your@email.com
```
 4. Check your email and confirm the subscription 
 5. Create cloudwatch alarm
    - [aws cloudwatch put-metric-alarm](https://docs.aws.amazon.com/cli/latest/reference/cloudwatch/put-metric-alarm.html)
    - [Create an Alarm via AWS CLI](https://aws.amazon.com/premiumsupport/knowledge-center/cloudwatch-estimatedcharges-alarm/)
    - We need to update the configuration json script with the TopicARN we generated earlier
    - We are just a json file because --metrics is is required for expressions and so its easier to us a JSON file.

 ```sh
    aws cloudwatch put-metric-alarm --cli-input-json file://aws/json/alarm_config.json
 ```


## Create a billing alarm by Terraform 
``` sh 
module "billing_alert" {
  source = "binbashar/cost-billing-alarm/aws"
  aws_env = "${var.aws_profile}"
  aws_account_id = 111111111111
  monthly_billing_threshold = 500
  currency = "USD"
}

output "sns_topic_arn" {
  value = "${module.billing_alert.sns_topic_arn}"
}

```
## cloudwatch-billing-alert-to-pre-existing-sns-with-acct-id

```sh
module "billing_cloudwatch_alert" {
  source = "binbashar/cost-billing-alarm/aws"

  aws_env = "${var.aws_profile}"
  aws_account_id = 111111111111
  monthly_billing_threshold = 500
  currency = "USD"
}
```

## cloudwatch-billing-alert-to-pre-existing-sns-consolidated-acct
```sh
module "billing_cloudwatch_alert" {
  source = "binbashar/cost-billing-alarm/aws"

  aws_env = "${var.aws_profile}"
  monthly_billing_threshold = 500
  currency = "USD"
}
```


## Create an AWS Budget by CLI

  1. Get your AWS Account ID

```sh
  aws sts get-caller-identity --query Account --output text
```
- Supply your AWS Account ID
- Update the json files
- This is another case with AWS CLI its just much easier to json files due to lots of nested json

```sh
aws budgets create-budget \
    --account-id AccountID \
    --budget file://aws/json/budget.json \
    --notifications-with-subscribers file://aws/json/budget-notifications-with-subscribers.json
```


## Create an AWS Budget by Terraform

``` json
provider "aws" {
  version = "2.70.0"
  region  = "us-west-2"
}

resource "aws_sns_topic" "billing_alarm" {
  name = "billing-alarm"
}

resource "aws_cloudwatch_metric_filter" "billing_metric_filter" {
  name           = "billing-metric-filter"
  pattern        = "{ ($.eventType = 'AWS Usage Report') && ($.usageType = 'DataTransfer-Out-Bytes') }"
  log_group_name = "/aws/billing/ice"
  metric_transformation {
    name      = "BillingMetric"
    namespace = "AWS/Billing"
    value     = "1"
  }
}

resource "aws_cloudwatch_metric_alarm" "billing_metric_alarm" {
  alarm_name          = "billing-alarm"
  comparison_operator = "GreaterThanOrEqualToThreshold"
  evaluation_periods  = "1"
  metric_name         = "BillingMetric"
  namespace           = "AWS/Billing"
  period              = "21600" # 6 hours
  statistic           = "Sum"
  threshold           = "100.0" # $100 USD
  alarm_description   = "Billing Alarm for Total Estimated Charge >= $100 USD"
  alarm_actions       = [aws_sns_topic.billing_alarm.arn]
}
```
## Creating an EventBridge rule for AWS Health  by CLI
 1. Creating an EventBridge rule for AWS Health  (eventbridg)["https://console.aws.amazon.com/events/."]
 2. For a new or existing rule 

``` sh 
    aws events put-rule
```
 3. Creates a rule to monitor events for the issue, `accountNotification`, and `scheduledChange event type categories` for three AWS services: `Amazon EC2`, `Amazon EC2 Auto Scaling`, and `Amazon VPC`.

 ``` sh 
 {
  "detail": {
    "eventTypeCategory": [
      "issue",
      "accountNotification",
      "scheduledChange"
    ],
    "service": [
      "AUTOSCALING",
      "VPC",
      "EC2"
    ]
  },
  "detail-type": [
    "AWS Health Event"
  ],
  "source": [
    "aws.health"
  ]
}
```

### Receiving AWS Health events with AWS Chatbot
You can receive AWS Health events directly in your chat clients, such as Slack and Amazon Chime. You can use this event to identify recent AWS service issues that might affect your AWS applications and infrastructure
 ``` sh
 {
  "source": [
    "aws.health"
  ],
  "detail-type": [
    "AWS Health Event"
  ],
  "detail": {
    "service": [
      "EC2"
    ],
    "eventTypeCategory": [
      "scheduledChange"
    ],
    "eventTypeCode": [
      "AWS_EC2_PERSISTENT_INSTANCE_RETIREMENT_SCHEDULED"
    ]
  }
}
``` 

## health alert by Terraform 
``` json
resource "aws_sns_topic" "health_alert_topic" {
  name = "health-alert-topic"
}

resource "aws_cloudwatch_alarm" "health_alarm" {
  alarm_name          = "health-alarm"
  comparison_operator = "GreaterThanOrEqualToThreshold"
  evaluation_periods  = "1"
  metric_name         = "ServiceHealth"
  namespace           = "AWS/Health"
  period              = "60"
  statistic           = "SampleCount"
  threshold           = "1"
  alarm_description   = "This metric checks for AWS service health issues."
  alarm_actions       = [aws_sns_topic.health_alert_topic.arn]
}

resource "aws_sns_topic_subscription" "health_alert_subscription" {
  topic_arn = aws_sns_topic.health_alert_topic.arn
  protocol  = "email"
  endpoint  = "you@example.com"
}
```

# 3.  AWS Well-Architected Framework ;
  1. `Operational Excellence` -> the ability to support development and run workloads effectively, gain insight into their operation, and continuously improve supporting processes and procedures to delivery business value.

        5 design principles:
            Perform operations as code
            Make frequent, small, reversible changes
            Refine operations procedures frequently
            Anticipate failure
            Learn from all operational failures

  2. `Security` -> the ability to protect data, systems, and assets to take advantage of cloud technologies to improve your security. 

             7 design principles for security in the cloud:
                Implement a strong identity foundation
                Enable traceability
                Apply security at all layers
                Automate security best practices
                Protect data in transit and at rest
                Keep people away from data
                Prepare for security events

  3. `Reliability` ->the ability of a workload to perform its intended function correctly and consistently. 
                5 design principles for reliability in the cloud:
                    Automatically recover from failure
                    Test recovery procedures
                    Scale horizontally to increase aggregate workload availability
                    Stop guessing capacity
                    Manage change in automation

  4. `Performance Efficiency` ->the ability to use computing resources efficiently to meet system requirements, and to maintain that efficiency as demand changes and technologies evolve. 
            5 design principles:
                Democratize advanced technologies
                Go global in minutes
                Use serverless architectures
                Experiment more often
                Consider mechanical sympathy

  5. `Cost Optimization` ->includes the ability to run systems to deliver business value at the lowest price point.
             5 design principles:
                Implement cloud financial management
                Adopt a consumption model
                Measure overall efficiency
                Stop spending money on undifferentiated heavy lifting
                Analyze and attribute expenditure

  6. `Sustainability` ->the long-term environmental, economic, and societal impact of your business activities.   
            6 design principles:
                Understand your impact
                Establish sustainability goals
                Maximize utilization
                Anticipate and adopt new, more efficient hardware and software offerings
                Use managed services
                Reduce the downstream impact of your cloud workloads

# 4 Create an architectural diagram (to the best of your ability) the CI/CD logical pipeline in Lucid Charts
  [Napkin Design](https://lucid.app/lucidchart/6a933070-367a-4d8a-b66b-6ad2a98fe512/edit?viewport_loc=-435%2C-84%2C2863%2C1485%2C0_0&invitationId=inv_ac166ebb-5096-4142-b588-8b5608e8b0b5)

  [CI/CD piple line](https://lucid.app/lucidchart/2e0a440f-9342-46ea-b0b5-1e306a7a152d/edit?viewport_loc=-26%2C-102%2C2889%2C1498%2C0_0&invitationId=inv_c578b5ab-9304-40de-a6d3-9cbc3457a6a5)
  
  [AWS Architecting](https://lucid.app/lucidchart/75a58bbc-8dc0-406c-a572-3729f1f0ead8/edit?viewport_loc=-2047%2C-407%2C4813%2C2545%2C0_0&invitationId=inv_a5feadb8-637f-49c8-86fd-45019dbd55a3) 

 # 5.  The technical and service limits of specific services and how they could impact the technical path for technical flexibility.          
        
        AWS service limits are the maximum limits of usage for specific services within an AWS account. These limits may include the number of resources (such as EC2 instances, S3 buckets, or RDS databases) that can be created, the amount of storage that can be used, or the number of API requests that can be made per second. Service limits are in place to prevent accidental overspending or abuse of services and to ensure service performance and availability.

        1. Limitations on the number of resources: If an AWS account reaches its limit for a particular resource, it can no longer create additional resources of that type. This can impact the ability to scale out or handle unexpected traffic spikes. To avoid hitting service limits, it may be necessary to design for horizontal scaling, optimize resource usage, or request a limit increase from AWS support.

        2. Limitations on the amount of storage: If an application requires more storage than the account's limit, it may not be able to store all the necessary data. This can impact the ability to scale, store data backups, or provide a better user experience. To work around storage limits, it may be necessary to optimize data storage, use external storage solutions, or request a limit increase.

        3. Limitations on the number of API requests: If an application needs to make more API requests than the account's limit, it may not be able to function properly. This can impact the application's ability to provide real-time updates or process large amounts of data. To avoid hitting API request limits, it may be necessary to optimize API usage, use caching, or request a limit increase.

        In summary, service limits can impact technical flexibility by limiting the ability to scale, store data, or process API requests. To ensure technical flexibility, it is important to monitor service limits and plan for scalability, optimize resource usage, and request limit increases as needed.

 # 6. Open a support ticket and request a service limit

        To request a service limit increase in AWS, you can follow these steps:
            1. Log in to your AWS account and go to the AWS Support Center.
            2. Click on "Create a Case" in the top right corner of the page.
            3. Under "Regarding", select "Service Limit Increase".
            4. Select the service for which you want to request a limit increase.
            5. Enter the details of your request, including the specific limit you want increased, the reason for the request, and any additional information that may be helpful.
            6. Click "Submit" to create the case.

  # 7   C4 model  - >  Maps of your code

  The C4 model for visualising software architecture
            Context, Containers, Components, and Code
    The C4 model was created as a way to help software development teams describe and communicate software architecture, both during up-front design sessions and when retrospectively documenting an existing codebase. It's a way to create maps of your code, at various levels of detail, in the same way you would use something like Google Maps to zoom in and out of an area you are interested in.

    The C4 model is an "abstraction-first" approach to diagramming software architecture, based upon abstractions that reflect how software architects and developers think about and build software. The small set of abstractions and diagram types makes the C4 model easy to learn and use. Please note that you don't need to use all 4 levels of diagram; only those that add value - the System Context and Container diagrams are sufficient for many software development teams.   

# 9 Create EventBridge to hookup Health Dashboard to SNS and send notification when there is a service health issue.  
   ##  Via AWS console follow these steps;
            1. Create an SNS topic:
                1.  Log in to the AWS Management Console and go to the Amazon SNS dashboard.
                2.  Click on the "Create Topic" button.
                3.  Give your topic a name and an optional display name, and click on the "Create Topic" button.

            2. Create an EventBridge rule:
                1. Go to Amazon EventBridge dashboard.
                2. Click on the "Create rule" button.
                3. Give your rule a name and an optional description.
                4. Under "Define pattern", select "Event pattern".
                5. Select "AWS Health" as the service name, and "AWS Health Event" as the event type.
                6. Under "Specify the conditions", select "Specific AWS Health events", and choose the events that you want to trigger notifications for.
                7. Under "Select targets", choose "SNS topic" as the target type.
                8. Select the SNS topic you created in step 1.
                9. Click on the "Create" button to create the rule.

            3. Subscribe to the SNS topic:

                1. Log in to the AWS Management Console and go to the Amazon SNS dashboard.
                2. Click on the SNS topic you created in step 1.
                3. Click on the "Create subscription" button.
                4. Choose the protocol you want to use for the subscription (e.g., email, SMS, etc.) and enter the endpoint information.
                5. Click on the "Create subscription" button to create the subscription.
                6. That's it! Now, when there is a service health issue in AWS, EventBridge will detect the issue and trigger a notification through the SNS topic. The notification will be forwarded to all subscribed endpoints, such as email addresses or phone numbers, allowing you to take appropriate actions as needed.
