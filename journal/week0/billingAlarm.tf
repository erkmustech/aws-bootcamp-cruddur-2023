#provide block 

provider "aws" {
  version = "2.70.0"
  region  = "us-west-2"
}

#resource block  for billing alarm 

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

# resource block for health alarming
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









