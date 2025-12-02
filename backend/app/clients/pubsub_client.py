import os
import json
import logging
from app.core.config import settings
from google.cloud import pubsub_v1

logger = logging.getLogger(__name__)

publisher = None
topic_path = None

def _initialize_pubsub():
    """Inicializa a ligação ao Pub/Sub de forma segura."""
    global publisher, topic_path
    
    try:
        # 1. Carregar caminho das credenciais
        creds_path = settings.google_application_credentials
        
        if creds_path and not os.path.isabs(creds_path):
            base_dir = os.getcwd()
            creds_path = os.path.join(base_dir, creds_path)

        # 2. Validar existência do ficheiro
        if not creds_path or not os.path.exists(creds_path):
            logger.warning(f"⚠️ Google Credentials file not found at: {creds_path}")
            logger.warning("Pub/Sub features will be disabled.")
            return

        # 3. Configurar Ambiente
        os.environ["GOOGLE_APPLICATION_CREDENTIALS"] = creds_path
        
        project_id = settings.gcp_project_id
        topic_id = settings.gcp_pubsub_topic

        if not project_id or not topic_id:
            logger.warning("⚠️ GCP Project ID or Topic ID missing in .env")
            return

        # 4. Criar Cliente
        client = pubsub_v1.PublisherClient()
        topic_path = client.topic_path(project_id, topic_id)
        publisher = client
        
        logger.info(f"Pub/Sub connected successfully to: {project_id} -> {topic_id}")

    except Exception as e:
        logger.error(f"Failed to initialize Google Pub/Sub: {e}")

# Inicializa ao arrancar
_initialize_pubsub()

def publish_vendor_registration(data: dict):
    """Publica dados no tópico configurado."""
    if not publisher or not topic_path:
        logger.error("Cannot publish: Pub/Sub not configured.")
        return None

    try:
        message_json = json.dumps(data)
        message_bytes = message_json.encode("utf-8")
        
        future = publisher.publish(topic_path, message_bytes)
        message_id = future.result()
        
        logger.info(f"Message published! ID: {message_id}")
        return message_id
            
    except Exception as e:
        logger.error(f"Failed to publish message: {e}")
        raise e