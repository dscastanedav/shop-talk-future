
/**
 * Consulta la edge function protegida en Supabase para obtener la respuesta de Gemini.
 * @param userQuestion Pregunta del usuario.
 * @returns Respuesta generada.
 */
export async function handleGeminiQuery(userQuestion: string): Promise<string> {
  console.log("Enviando pregunta a Gemini:", userQuestion);
  
  try {
    const response = await fetch(
      "https://byhokiohhxykockbwabn.supabase.co/functions/v1/gemini-proxy",
      {
        method: "POST",
        headers: { 
          "Content-Type": "application/json",
          "Authorization": `Bearer ${import.meta.env.VITE_SUPABASE_ANON_KEY || "REMOVED"}`
        },
        body: JSON.stringify({ userQuestion })
      }
    );
    
    console.log("Respuesta del servidor:", response.status, response.statusText);
    
    if (!response.ok) {
      const errorText = await response.text();
      console.error("Error del servidor:", errorText);
      return `Error al conectar con Gemini (${response.status}).`;
    }
    
    const data = await response.json();
    console.log("Datos recibidos:", data);
    
    if (data?.result) {
      return data.result;
    }
    return "Lo siento, no pude obtener una respuesta.";
  } catch (error) {
    console.error("Error en handleGeminiQuery:", error);
    return "Ocurrió un error al consultar a Gemini.";
  }
}
