# Hostel Management System - Project Analysis

## Project Overview

A full-stack hostel management application with comprehensive infrastructure automation, containerization, and monitoring capabilities. The project includes a Node.js/Express backend, React/Vite frontend, and complete DevOps/IaC setup for AWS deployment.

---

## Architecture Components

### 1. **Application Architecture**

```
┌─────────────────────────────────────────────────────┐
│               FRONTEND (React + Vite)               │
│         Running on port 3001 (via Nginx)            │
├─────────────────────────────────────────────────────┤
│                  Backend (Express)                  │
│              Running on port 5001 → 5000            │
├─────────────────────────────────────────────────────┤
│         SQLite Database (Local - /db folder)        │
└─────────────────────────────────────────────────────┘
```

**Key Services:**
- **Backend**: Express.js server with REST API
- **Frontend**: React app built with Vite, served by Nginx
- **Database**: SQLite (file-based)
- **Monitoring**: Prometheus + Grafana
- **Authentication**: JWT-based with bcryptjs

---

## 2. **Containerization & Orchestration**

### Docker Setup (`docker-compose.yml`)

**Multi-container deployment with 4 services:**

| Service | Image | Port | Purpose |
|---------|-------|------|---------|
| **backend** | Custom (Node.js) | 5001 | API server |
| **frontend** | Custom (Nginx) | 3001 | Web UI |
| **prometheus** | prom/prometheus | 9090 | Metrics collection |
| **grafana** | grafana/grafana | 3002 | Visualization dashboard |

### Backend Dockerfile
- **Base**: Node.js 18
- **Approach**: Single-stage build
- **Dependencies**: npm install with sqlite3 compilation
- **Expose**: Port 5000
- **Entrypoint**: `npm start`

**⚠️ Issue**: Building sqlite3 from source every deployment is slow. Consider:
- Using pre-built sqlite3 binary
- Caching npm dependencies in multi-stage build

### Frontend Dockerfile
- **Build Stage**: Node.js 18 + Vite build
- **Runtime Stage**: Nginx Alpine
- **Approach**: Multi-stage build (optimized ✅)
- **Expose**: Port 80
- **Advantage**: Smaller final image, production-ready

---

## 3. **Infrastructure as Code (Terraform)**

### AWS Infrastructure

**Provider**: AWS (us-east-1 by default)

**Resources Created:**

```
aws_security_group (hostel-sg)
├── Ingress Rules:
│   ├── SSH (22) - 0.0.0.0/0 ⚠️ (security risk)
│   ├── App (5001) - 0.0.0.0/0
│   ├── App (3001) - 0.0.0.0/0
│   └── HTTP (80) - 0.0.0.0/0
└── Egress: All traffic allowed

aws_instance (hostel_server)
├── AMI: Amazon Linux 2 (ami-098e39bafa7e7303d)
├── Type: t3.micro (free tier eligible ✅)
├── Key Name: hostel-key
└── Security Group: hostel-sg
```

**Current Configuration:**
- **Instance Type**: t3.micro (1 vCPU, 1 GB RAM)
- **Region**: us-east-1 (customizable)
- **State**: Stored in `terraform.tfstate` (⚠️ unencrypted, tracked in git)

**Variables** (`terraform/variables.tf`):
```hcl
aws_region = "us-east-1"
ami_id     = "ami-098e39bafa7e7303d" (Amazon Linux 2)
key_name   = "hostel-key"
```

### Security Concerns ⚠️

1. **SSH open to world** (0.0.0.0/0) - Use specific IP ranges
2. **Terraform state in git** - Should use S3 backend with encryption
3. **No encrypted volumes** configured
4. **No auto-scaling** - Single instance with no redundancy

---

## 4. **Configuration Management (Ansible)**

### Playbook Structure (`ansible/playbook.yml`)

**Target**: `web` group (hosts from inventory)

**Tasks Executed** (on first deployment):

1. ✅ **Install Git** - For cloning repository
2. ✅ **Install Docker** - Container runtime (yum package)
3. ✅ **Start Docker service** - Enable on boot
4. ✅ **Add ec2-user to docker group** - Passwordless docker commands
5. ✅ **Clone GitHub repository** - Force pull latest
6. ✅ **Run docker compose** - Start all services

**Inventory** (`ansible/inventory.ini`):
```ini
[web]
<ec2_instance_ip>
```

**Limitations:**
- Only provisions once (no idempotency for updates)
- No error handling
- Direct deployment without validation
- No rollback mechanism

---

## 5. **CI/CD Pipeline**

### GitHub Actions Workflow (`.github/workflows/deploy.yml`)

**Trigger**: Push to `main` branch

**Deployment Flow**:

```
Push to main
    ↓
GitHub Actions (ubuntu-latest)
    ↓
SSH into EC2 (13.217.10.217)
    ↓
Cleanup + Git Pull
    ↓
Docker Build (backend + frontend)
    ↓
Docker Compose Up
    ↓
✅ Live Update
```

**Key Steps**:

1. **SSH Connection** - Uses `appleboy/ssh-action@v1.0.3`
2. **Docker Cleanup** - Remove docker-buildx plugin
3. **Directory Ownership** - Fix permissions
4. **Git Operations** - Reset, clean, pull
5. **Build Images** - Two custom images
6. **Deploy** - Compose up with no restart policy

**Issues & Recommendations** ⚠️

| Issue | Impact | Fix |
|-------|--------|-----|
| No build validation | Broken code deployed | Add `npm run build` check |
| Hardcoded IP (13.217.10.217) | Manual update needed | Use Terraform outputs |
| No rollback | Failed deploy stuck | Add version tagging |
| No health checks | Unknown service status | Add curl health endpoint |
| Secrets in plaintext | EC2_SSH_KEY exposure | Already using secrets ✅ |

---

## 6. **Monitoring & Observability**

### Prometheus Configuration (`prometheus.yml`)

```yaml
global:
  scrape_interval: 15s  # Metrics every 15 seconds

scrape_configs:
  - job_name: "prometheus"
    static_configs:
      - targets: ["localhost:9090"]
```

**Current Status** ⚠️ **Minimal Setup**:
- Only monitors Prometheus itself
- No backend/frontend metrics
- No application-level monitoring
- No alerting rules

**What's Missing**:
- Prometheus service discovery
- Backend application metrics
- Node exporter for system metrics
- Grafana dashboards not configured
- Alert rules (no notifications)

---

## 7. **Application Features**

### API Endpoints

**Authentication**
- `POST /api/auth/register` - Admin registration
- `POST /api/auth/login` - JWT token generation

**Core Resources**
- Students: CRUD operations
- Rooms: Room management with capacity/rent
- Bookings: Student-to-room allocation with checkout
- Fees: Monthly fee tracking with payment status

**Security**: JWT token-based auth with bcryptjs password hashing

---

## 8. **Database Design**

**SQLite Database** (persistent in `./backend/db`)

Tables (inferred from API):
- `users` - Admin credentials
- `students` - Student records
- `rooms` - Hostel rooms
- `bookings` - Student room allocations
- `fees` - Fee records with payment tracking

---

## Deployment Status

### ✅ Configured & Ready
- Docker containerization (both images)
- Terraform infrastructure (EC2 + Security Group)
- Ansible provisioning
- GitHub Actions CI/CD pipeline
- Prometheus container running
- Application CRUD functionality

### ⚠️ Partial/Needs Work
- Monitoring (Prometheus minimal, Grafana unconfigured)
- CI/CD health checks
- Database backups
- Error handling in Ansible
- Terraform state management
- Security hardening

### ❌ Not Yet Implemented
- HTTPS/SSL certificates
- Load balancing
- Auto-scaling
- Application metrics instrumentation
- Logging aggregation
- Database replication
- Disaster recovery

---

## Performance Insights

### Infrastructure
- **Instance**: t3.micro (suitable for low traffic)
- **Memory**: 1 GB (tight for all 4 services + DB)
- **Disk**: Default (likely 8-30 GB)
- **Network**: Standard AWS throughput

### Containerization
- **Frontend Build**: Multi-stage ✅ (optimized)
- **Backend Build**: Single-stage (could be optimized)
- **Database**: File-based SQLite (no concurrency issues for small scale)

### CI/CD
- **Speed**: ~2-3 minutes (build time depends on npm)
- **Downtime**: ~30 seconds during deployment
- **Rollback**: None (manual required)

---

## Security Assessment

### 🟢 Good
- JWT authentication
- Password hashing (bcryptjs)
- CORS configured
- Environment variables for config

### 🟡 Needs Attention
- Security group (SSH open to world)
- Terraform state unencrypted
- No HTTPS/TLS
- No input validation documentation
- No rate limiting

### 🔴 Critical
- Database in container volume (not persisted properly)
- No backup strategy
- Secrets exposure risk in CI/CD logs
- No disaster recovery plan

---

## Recommendations (Priority Order)

### 1. Immediate (Security & Stability)
```
[ ] Restrict SSH to specific IPs in Security Group
[ ] Move Terraform state to S3 with encryption
[ ] Add SSL/TLS certificates (Let's Encrypt)
[ ] Implement database backups (daily minimum)
[ ] Add health check endpoint to CI/CD
```

### 2. Short-term (Observability & Quality)
```
[ ] Instrument backend with Prometheus metrics (prom-client)
[ ] Configure Grafana dashboards
[ ] Add Node exporter for system monitoring
[ ] Implement application logging (Winston/Pino)
[ ] Add automated tests to CI/CD pipeline
```

### 3. Medium-term (Scalability & Reliability)
```
[ ] Use RDS instead of SQLite
[ ] Implement Redis for caching/sessions
[ ] Add load balancer (ALB)
[ ] Enable auto-scaling
[ ] Implement blue-green deployment
```

### 4. Long-term (Enterprise-ready)
```
[ ] Kubernetes migration
[ ] Multi-region deployment
[ ] DynamoDB for NoSQL data
[ ] API Gateway for routing
[ ] Infrastructure monitoring (CloudWatch)
```

---

## Summary

Your hostel management system has a **solid modern DevOps foundation** with Docker, Terraform, Ansible, and CI/CD. The architecture is clean and follows current best practices. Main areas to focus on:

1. **Security hardening** - Public SSH, state management
2. **Monitoring completion** - Full metric collection & alerting
3. **Database strategy** - Backup, persistence, scalability
4. **CI/CD robustness** - Health checks, versioning, rollback

**Overall Grade: B+ (Strong foundation, needs production hardening)**

---

**Generated**: April 26, 2026
