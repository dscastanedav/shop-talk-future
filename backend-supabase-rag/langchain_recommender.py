# langchain_recommender.py

from dotenv import load_dotenv
import os

from langchain_community.vectorstores import SupabaseVectorStore
from langchain_huggingface import HuggingFaceEmbeddings
from langchain_core.documents import Document

from supabase import create_client, Client

# 1. Cargar variables de entorno
load_dotenv()
SUPABASE_URL = os.getenv("SUPABASE_URL")
SUPABASE_API_KEY = os.getenv("SUPABASE_API_KEY")

# 2. Conectar a Supabase
supabase: Client = create_client(SUPABASE_URL, SUPABASE_API_KEY)

# 3. Modelo de embeddings gratuito
embedding_model = HuggingFaceEmbeddings(model_name="all-MiniLM-L6-v2")

# 4. Vector store usando Supabase
vectorstore = SupabaseVectorStore(
    client=supabase,
    embedding=embedding_model,
    table_name="products",
    query_name="match_documents"  # ← esta línea es la clave
)

# 5. Entrada del usuario
query = input("🔍 ¿Sobre qué producto quieres recomendaciones?: ")

# 6. Generar embedding
query_embedding = embedding_model.embed_query(query)

# 7. Buscar documentos similares
results = supabase.rpc(
    "match_documents",
    {
        "query_embedding": query_embedding,
        "match_count": 3
    }
).execute()

if results.data:
    for i, row in enumerate(results.data, start=1):
        print(f"{i}. {row['name']} - {row['description'][:100]}...")
else:
    print("❌ No se encontraron productos similares. Verifica embeddings y datos.")
