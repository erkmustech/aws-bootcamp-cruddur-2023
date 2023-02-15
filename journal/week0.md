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

# homeworm solutions
1.  Here are the steps to destroy the AWS root account credentials, set up multi-factor authentication (MFA), and create an IAM role:

    1. Delete the root account access keys:
        1. Log in to the AWS Management Console as the root user.
        2. Go to the IAM dashboard.
        3. Click on the "Security credentials" tab.
        4. Locate the "Access keys" section and click on the "Manage Access Keys" button.
        5. Identify the access keys you want to delete and click the "Delete" button.
    
    2. Enable MFA for the root user:
        1. Log in to the AWS Management Console as the root user.
        2. Go to the IAM dashboard.
        3. Click on the "Security credentials" tab.
        4. Locate the "Multi-Factor Authentication (MFA)" section and click on the "Activate" button.
        5. Follow the prompts to set up MFA for the root user.

    3. Create an IAM role:
        1. Log in to the AWS Management Console as the root user.
        2. Go to the IAM dashboard.
        3. Click on the "Roles" menu item.
        4. Click on the "Create role" button.
        5. Select the "AWS service" option and then choose the service you want to use the role with.
        6. Select the permissions you want to grant to the role.
        7. Give the role a name and description.
        8. Click on the "Create role" button to create the role.
           Note: It's important to follow best practices for securing your AWS account and resources, including regularly rotating access keys, enabling MFA for all IAM users, and using IAM roles instead of root account credentials.


2. Use EventBridge to hookup Health Dashboard to SNS and send notification when there is a service health issue.  

    Two kind of methods are avaible. 
    1. Through the AWS console. The steps are as below;
    2. Through IaC services. (Cloud Formation or Terraform)