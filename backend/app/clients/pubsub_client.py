
import os
import json
from app.core.config import settings

# Ensure the environment variable is set for Google client libraries
os.environ["GOOGLE_APPLICATION_CREDENTIALS"] = settings.google_application_credentials

from google.cloud import pubsub_v1

PROJECT_ID = settings.gcp_project_id
TOPIC_ID = settings.gcp_pubsub_topic

publisher = pubsub_v1.PublisherClient()
topic_path = publisher.topic_path(PROJECT_ID, TOPIC_ID)

def publish_vendor_registration(data: dict):
    message = json.dumps(data).encode("utf-8")
    future = publisher.publish(topic_path, message)
    return future.result()
