# AWS Architecture Optimization Plan

## Current Footprint
* **Compute:** Single ECS Fargate service using 256 vCPU / 512 MB tasks as defined in `task-definition.json` with a single container exposing port 8000.【F:task-definition.json†L1-L33】
* **IAM:** Task role grants broad S3 object permissions and wildcard CloudWatch Logs access, increasing blast radius.【F:ecs-task-policy.json†L1-L33】
* **Logging:** AWS Logs driver configured but no metrics/alarms, and no structured logging pipeline.【F:task-definition.json†L16-L31】
* **Networking:** `awsvpc` mode indicated; no explicit mention of private subnets, NAT gateways, or WAF/ALB hardening.

## Objectives
1. Achieve high availability (99.9%+) through multi-AZ deployments and auto scaling.
2. Reduce cost via right-sized tasks, spot capacity, and storage optimisation.
3. Strengthen security with least-privilege IAM, network segmentation, and managed secrets.
4. Provide observability with dashboards, alarms, and tracing across the stack.

## Recommended Enhancements

### 1. Compute & Scaling
* Deploy across at least two private subnets in different AZs with an Application Load Balancer (ALB) in public subnets.
* Increase task size to `512 vCPU / 1 GB` after profiling, or enable autoscaling on CPU/memory + request count metrics.
* Use ECS capacity providers with Fargate Spot for background workers; maintain on-demand base for critical traffic.
* Implement blue/green deployments via AWS CodeDeploy or ECS deployment circuit breakers for zero-downtime releases.

### 2. Networking & Security
* Terminate TLS at ALB with ACM certificates; enforce HTTPS and enable AWS WAF (rate limiting, bot control, geo-restrictions).
* Place tasks in private subnets with outbound access via NAT Gateway; restrict security groups to ALB and necessary AWS endpoints.
* Enable AWS Shield Advanced for DDoS protection due to PHI sensitivity.

### 3. IAM & Secrets Management
* Refine task role policies to least privilege—limit S3 actions to required prefixes (read-only for certain buckets) and scope CloudWatch permissions to specific log groups.【F:ecs-task-policy.json†L1-L33】
* Store secrets (API keys, datastore IDs) in AWS Secrets Manager or Parameter Store and inject via task definition environment overrides.
* Rotate credentials automatically using AWS Secrets Manager rotation lambdas.

### 4. Data & Storage
* Store structured data in Amazon RDS (PostgreSQL) with Multi-AZ and automated backups; enable storage encryption and audit logging.
* Use S3 Intelligent-Tiering for medical images and configure lifecycle policies for archival (Glacier Deep Archive) while meeting retention requirements.
* Enable AWS Backup plans for RDS, EFS, and S3 to support disaster recovery.

### 5. Observability & Operations
* Ship logs to CloudWatch with JSON structure; create dashboards for latency, error rates, throughput.
* Integrate AWS X-Ray or OpenTelemetry collectors to trace request paths across services.
* Configure CloudWatch alarms and SNS notifications for CPU, memory, 5XX rates, and custom business KPIs (claim failures).
* Enable GuardDuty, Security Hub, Config, and CloudTrail for continuous compliance monitoring.

### 6. Cost Optimisation
* Right-size task memory/CPU after load testing; consider reserved capacity or Savings Plans for steady workloads.
* Use CloudFront for static assets to reduce data transfer from ECS and improve latency.
* Adopt Graviton-based runtimes where supported for 20-40% cost savings.

## Implementation Roadmap
1. **Week 1:** Establish VPC architecture diagrams, update Terraform/CloudFormation to include ALB, security groups, and private subnets.
2. **Week 2:** Migrate secrets to AWS Secrets Manager, update task definitions, and apply IAM least-privilege policies.
3. **Week 3:** Implement observability stack (CloudWatch dashboards, X-Ray, alarms) and configure auto scaling policies.
4. **Week 4:** Conduct GameDays and disaster recovery drills; evaluate cost savings and adjust capacity plans.

