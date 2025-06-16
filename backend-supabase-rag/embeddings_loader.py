from dotenv import load_dotenv
from sentence_transformers import SentenceTransformer
import requests
import os

# 🔐 Cargar variables de entorno
load_dotenv()
SUPABASE_URL = os.getenv("SUPABASE_URL")
SUPABASE_API_KEY = os.getenv("SUPABASE_API_KEY")

# 🧠 Cargar modelo local
model = SentenceTransformer('all-MiniLM-L6-v2')

# 🔧 Headers para Supabase
headers = {
    "apikey": SUPABASE_API_KEY,
    "Authorization": f"Bearer {SUPABASE_API_KEY}",
    "Content-Type": "application/json",
    "Prefer": "return=representation"
}

print("URL Supabase:", SUPABASE_URL)

# 🔍 Obtener productos sin embedding
response = requests.get(f"{SUPABASE_URL}/rest/v1/products?select=*", headers=headers)
products = response.json()
print("Respuesta de Supabase:", products)

for product in products:
    if not product["description"]:
        continue

    text = product["description"]
    
    try:
        # 🧠 Generar embedding local
        vector = model.encode(text).tolist()

        # 📝 Actualizar Supabase
        update = requests.patch(
            f"{SUPABASE_URL}/rest/v1/products?id=eq.{product['id']}",
            headers=headers,
            json={"embedding": vector}
        )
        print(f"✅ {product['name']} actualizado (status {update.status_code}): {update.text}")
    except Exception as e:
        print(f"❌ Error en {product['name']}: {str(e)}")

print("\nVerificación de embeddings:")
verif = requests.get(f"{SUPABASE_URL}/rest/v1/products?select=id,embedding", headers=headers)
print(verif.json())
