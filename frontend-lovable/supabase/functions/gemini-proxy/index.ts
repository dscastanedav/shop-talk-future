
import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  console.log("Gemini proxy called:", req.method);
  
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  let userQuestion = "";
  try {
    const body = await req.json();
    userQuestion = body.userQuestion || "";
    console.log("Pregunta recibida:", userQuestion);
    
    if (!userQuestion) {
      console.error("No question provided");
      return new Response(JSON.stringify({ error: "No question provided." }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }
  } catch (error) {
    console.error("Error parsing JSON:", error);
    return new Response(JSON.stringify({ error: "Invalid JSON body." }), {
      status: 400,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }

  const apiKey = Deno.env.get("GEMINI_API_KEY");
  console.log("API Key exists:", !!apiKey);
  
  if (!apiKey) {
    console.error("Missing Gemini API key");
    return new Response(JSON.stringify({ error: "Missing Gemini API key." }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }

  try {
    const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`;
    console.log("Calling Gemini API with model: gemini-1.5-flash");
    
    const geminiRes = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        contents: [
          {
            parts: [
              { text: `Eres un asesor de compras experto. Responde sobre el siguiente producto: ${userQuestion}` }
            ]
          }
        ]
      }),
    });
    
    console.log("Gemini response status:", geminiRes.status);
    
    if (!geminiRes.ok) {
      const errorText = await geminiRes.text();
      console.error("Gemini API error:", errorText);
      return new Response(JSON.stringify({ error: "Error from Gemini API." }), {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }
    
    const data = await geminiRes.json();
    console.log("Gemini response data:", JSON.stringify(data, null, 2));
    
    const text = data?.candidates?.[0]?.content?.parts?.[0]?.text;
    
    if (typeof text === "string" && text.trim()) {
      console.log("Returning successful response");
      return new Response(JSON.stringify({ result: text }), {
        status: 200,
        headers: { ...corsHeaders, "Content-Type": "application/json" }
      });
    } else {
      console.log("No valid text found in response");
      return new Response(JSON.stringify({ result: "No se pudo generar una respuesta válida." }), {
        status: 200,
        headers: { ...corsHeaders, "Content-Type": "application/json" }
      });
    }
  } catch (error) {
    console.error("Error in Gemini proxy:", error);
    return new Response(JSON.stringify({ error: "Error contacting Gemini." }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
