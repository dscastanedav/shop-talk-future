from sentence_transformers import SentenceTransformer
from supabase import create_client, Client
from dotenv import load_dotenv
import numpy as np
import os
import json

# 1. Cargar entorno y modelo
load_dotenv()
model = SentenceTransformer('all-MiniLM-L6-v2')  # 384 dim

# 2. Conectar a Supabase
url: str = os.getenv("SUPABASE_URL")
key: str = os.getenv("SUPABASE_API_KEY")
supabase: Client = create_client(url, key)

# 3. Función principal
def retrieve_relevant_products(question, top_k=3):
    # Generar embedding de la pregunta
    query_embedding = model.encode(question).tolist()

    # Realizar búsqueda semántica en Supabase
    response = supabase.rpc(
        'match_products',  # Nombre de la función RPC en Supabase
        {
            'query_embedding': query_embedding,
            'match_threshold': 0.78,
            'match_count': top_k
        }
    ).execute()

    if response.data:
        print(f"🧠 Productos relevantes para: '{question}'")
        for product in response.data:
            print(f"- {product['name']}: {product['description'][:80]}...")
        return response.data
    else:
        print("⚠️ No se encontraron coincidencias.")
        return []

# 4. Ejemplo de uso
if __name__ == "__main__":
    pregunta = input("Haz tu pregunta: ")
    retrieve_relevant_products(pregunta)
