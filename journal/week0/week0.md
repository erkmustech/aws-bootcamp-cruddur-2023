# Week 0 — Billing and Architecture

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

# Homework solutions
# 1. Here are the steps to destroy the AWS root account credentials, set up    multi-factor authentication (MFA), and create an IAM role:

   ## 1. Delete the root account access keys:
        1. Log in to the AWS Management Console as the root user.
        2. Go to the IAM dashboard.
        3. Click on the "Security credentials" tab.
        4. Locate the "Access keys" section and click on the "Manage Access Keys" button.
        5. Identify the access keys you want to delete and click the "Delete" button.
    
   ## 2. Enable MFA for the root user:
        1. Log in to the AWS Management Console as the root user.
        2. Go to the IAM dashboard.
        3. Click on the "Security credentials" tab.
        4. Locate the "Multi-Factor Authentication (MFA)" section and click on the "Activate" button.
        5. Follow the prompts to set up MFA for the root user.

   ## 3. Create an IAM role:
        1. Log in to the AWS Management Console as the root user.
        2. Go to the IAM dashboard.
        3. Click on the "Roles" menu item.
        4. Click on the "Create role" button.
        5. Select the "AWS service" option and then choose the service you want to use the role with.
        6. Select the permissions you want to grant to the role.
        7. Give the role a name and description.
        8. Click on the "Create role" button to create the role.
           Note: Use IAM roles instead of root account credentials. 


# 2. Use EventBridge to hookup Health Dashboard to SNS and send notification when there is a service health issue.  
   ## Two different methods are avaible
       1. Via AWS console follow these steps;
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
 ### 2. Through IaC services. (Cloud Formation or Terraform)
``` Json      
                    provider "aws" {
                        version = "2.70.0"
                        region  = "us-west-2"
                        }

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

# 3.  Review all the questions of each pillars in the Well Architected Tool (No specialized lens)
        The AWS Well-Architected Framework includes six pillars of best practices to help customers build and operate reliable, secure, efficient, and cost-effective systems in the cloud. The six pillars are:

        1. Operational Excellence
        The Operational Excellence pillar includes the ability to support development and run workloads effectively, gain insight into their operation, and continuously improve supporting processes and procedures to delivery business value.

        Five design principles for operational excellence in the cloud:
            Perform operations as code
            Make frequent, small, reversible changes
            Refine operations procedures frequently
            Anticipate failure
            Learn from all operational failures

        Best Practices
            Operations teams need to understand their business and customer needs so they can support business outcomes. Ops creates and uses procedures to respond to operational events, and validates their effectiveness to support business needs. Ops also collects metrics that are used to measure the achievement of desired business outcomes.

            Everything continues to change—your business context, business priorities, and customer needs. It’s important to design operations to support evolution over time in response to change, and to incorporate lessons learned through their performance.

        2. Security
            The Security pillar includes the ability to protect data, systems, and assets to take advantage of cloud technologies to improve your security. 

             Seven design principles for security in the cloud:
                Implement a strong identity foundation
                Enable traceability
                Apply security at all layers
                Automate security best practices
                Protect data in transit and at rest
                Keep people away from data
                Prepare for security events

            Best Practices
                Before you architect any workload, you need to put in place practices that influence security. You’ll want to control who can do what. In addition, you want to be able to identify security incidents, protect your systems and services, and maintain the confidentiality and integrity of data through data protection.

                You should have a well-defined and practiced process for responding to security incidents. These tools and techniques are important because they support objectives such as preventing financial loss or complying with regulatory obligations.

                The AWS Shared Responsibility Model enables organizations that adopt the cloud to achieve their security and compliance goals. Because AWS physically secures the infrastructure that supports our cloud services, as an AWS customer you can focus on using services to accomplish your goals. The AWS Cloud also provides greater access to security data and an automated approach to responding to security events.

        3. Reliability
                The Reliability pillar encompasses the ability of a workload to perform its intended function correctly and consistently when it’s expected to. This includes the ability to operate and test the workload through its total lifecycle.

                Five design principles for reliability in the cloud:
                    Automatically recover from failure
                    Test recovery procedures
                    Scale horizontally to increase aggregate workload availability
                    Stop guessing capacity
                    Manage change in automation
                Best Practices
                    Before building any system, foundational requirements that influence reliability should be in place. For example, you must have sufficient network bandwidth to your data center. These requirements are sometimes neglected (because they are beyond a single project’s scope). With AWS, however, most of the foundational requirements are already incorporated or can be addressed as needed.


        4. Performance Efficiency
            The Performance Efficiency pillar includes the ability to use computing resources efficiently to meet system requirements, and to maintain that efficiency as demand changes and technologies evolve. 

            Five design principles for performance efficiency in the cloud:
                Democratize advanced technologies
                Go global in minutes
                Use serverless architectures
                Experiment more often
                Consider mechanical sympathy

            Best Practices
                 Take a data-driven approach to building a high-performance architecture. Gather data on all aspects of the architecture, from the high-level design to the selection and configuration of resource types.

        5. Cost Optimization
            The Cost Optimization pillar includes the ability to run systems to deliver business value at the lowest price point.

             Five design principles for cost optimization in the cloud:
                Implement cloud financial management
                Adopt a consumption model
                Measure overall efficiency
                Stop spending money on undifferentiated heavy lifting
                Analyze and attribute expenditure

            Best Practices
                As with the other pillars, there are trade-offs to consider. For example, do you want to optimize for speed to market or for cost? In some cases, it’s best to optimize for speed—going to market quickly, shipping new features, or simply meeting a deadline—rather than investing in up-front cost optimization.


        6. Sustainability
        The discipline of sustainability addresses the long-term environmental, economic, and societal impact of your business activities.
            
            Six design principles for sustainability in the cloud:
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

        AWS support will review your request and respond as soon as possible. Depending on the service and the requested limit increase, the response time may vary. You may also receive an automated response that confirms your request has been received.

        Note that there may be certain requirements for requesting a limit increase, such as providing a detailed use case and justification for the increase. In some cases, AWS may require additional information or documentation before granting the limit increase.

        It's important to regularly monitor your service limits to ensure that you don't hit any unexpected limits that may impact your system's functionality. If you anticipate the need for a service limit increase in the future, it's a good practice to request it in advance to avoid any potential downtime or service interruptions.

  # 7   C4 model  - >  Maps of your code

  The C4 model for visualising software architecture
            Context, Containers, Components, and Code
    The C4 model was created as a way to help software development teams describe and communicate software architecture, both during up-front design sessions and when retrospectively documenting an existing codebase. It's a way to create maps of your code, at various levels of detail, in the same way you would use something like Google Maps to zoom in and out of an area you are interested in.

    The C4 model is an "abstraction-first" approach to diagramming software architecture, based upon abstractions that reflect how software architects and developers think about and build software. The small set of abstractions and diagram types makes the C4 model easy to learn and use. Please note that you don't need to use all 4 levels of diagram; only those that add value - the System Context and Container diagrams are sufficient for many software development teams.      


# install aws cli 
1. curl "https://awscli.amazonaws.com/awscli-exe-linux-x86_64.zip" -o "awscliv2.zip"
2. sudo ./aws/install
3. unzip awscliv2.zip
4. sudo ./aws/install


# some useful aws-shell commdans 
1. aws sts get-user-id
2. aws get-account-information
3. aws account get-contact-information

# terraform code 
//provide block 

```terraform 
provider "aws" {
  version = "2.70.0"
  region  = "us-west-2"
}


//resource block  for billing alarm 

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

// resource block for health alarming
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










