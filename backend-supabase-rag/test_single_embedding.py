from sentence_transformers import SentenceTransformer
import requests
import os
from dotenv import load_dotenv

load_dotenv()

SUPABASE_URL = os.getenv("SUPABASE_URL")
SUPABASE_API_KEY = os.getenv("SUPABASE_API_KEY")

headers = {
    "apikey": SUPABASE_API_KEY,
    "Authorization": f"Bearer {SUPABASE_API_KEY}",
    "Content-Type": "application/json",
    "Prefer": "return=representation"
}

model = SentenceTransformer('all-MiniLM-L6-v2')
text = "El iPhone es el smartphone insignia de Apple, reconocido a nivel mundial por su diseño elegante."
vector = model.encode(text).tolist()

print(f"Vector generado (dim {len(vector)}): ejemplo: {vector[:5]}")

update = requests.patch(
    f"{SUPABASE_URL}/rest/v1/products?id=eq.1",
    headers=headers,
    json={"embedding": vector}
)

print(f"\n🛠 Resultado del PATCH:")
print("Status code:", update.status_code)
print("Respuesta:", update.text)
