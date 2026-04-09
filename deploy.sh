#!/bin/bash
set -e

# ── Configuration ──
PROJECT_ID="breeze-automatic-prod"
REGION="asia-south1"
SERVICE_NAME="aarokya"
REGISTRY="asia-south1-docker.pkg.dev/${PROJECT_ID}/aarokya"
IMAGE_TAG=$(git rev-parse --short HEAD 2>/dev/null || echo "latest")
IMAGE="${REGISTRY}/app:${IMAGE_TAG}"
echo "============================================"
echo "  Aarokya - Cloud Run Deployment"
echo "============================================"
echo ""
echo "  Project:  ${PROJECT_ID}"
echo "  Region:   ${REGION}"
echo "  Service:  ${SERVICE_NAME}"
echo "  Image:    ${IMAGE}"
echo ""

# ── Step 1: Ensure gcloud is configured ──
echo ">> Setting GCP project..."
gcloud config set project ${PROJECT_ID}

# ── Step 2: Enable required APIs ──
echo ">> Enabling required APIs..."
gcloud services enable run.googleapis.com artifactregistry.googleapis.com cloudbuild.googleapis.com --quiet

# ── Step 3: Create Artifact Registry repo (if not exists) ──
echo ">> Ensuring Artifact Registry repo exists..."
gcloud artifacts repositories describe aarokya \
  --location=${REGION} \
  --format="value(name)" 2>/dev/null || \
gcloud artifacts repositories create aarokya \
  --repository-format=docker \
  --location=${REGION} \
  --description="Aarokya app container images"

# ── Step 4: Build & push using Cloud Build ──
echo ">> Building image with Cloud Build..."
gcloud builds submit \
  --tag="${IMAGE}" \
  --region=${REGION} \
  --quiet

# ── Step 5: Deploy to Cloud Run ──
echo ">> Deploying to Cloud Run..."
gcloud run deploy ${SERVICE_NAME} \
  --image="${IMAGE}" \
  --region=${REGION} \
  --platform=managed \
  --allow-unauthenticated \
  --port=8080 \
  --memory=512Mi \
  --cpu=1 \
  --max-instances=10 \
  --min-instances=0 \
  --set-env-vars="NODE_ENV=production"

# ── Step 6: Allow public access (in case --allow-unauthenticated didn't work) ──
echo ">> Ensuring public access..."
gcloud run services add-iam-policy-binding ${SERVICE_NAME} \
  --region=${REGION} \
  --member="allUsers" \
  --role="roles/run.invoker" \
  --quiet 2>/dev/null || true

# ── Step 7: Get service URL ──
SERVICE_URL=$(gcloud run services describe ${SERVICE_NAME} --region=${REGION} --format='value(status.url)')
echo ""
echo ">> Cloud Run service deployed at: ${SERVICE_URL}"

echo ""
echo "============================================"
echo "  Deployment complete!"
echo "============================================"
echo ""
echo "  Cloud Run URL: ${SERVICE_URL}"
echo "  Image:         ${IMAGE}"
echo ""
