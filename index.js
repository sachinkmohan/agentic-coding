import { openai, supabase } from "./config.js";
import podcasts from "./content.js";

/** Create embeddings representing the input text */
async function main(input) {
  const data = await Promise.all(
    input.map(async (textChunk) => {
      const embeddingResponse = await openai.embeddings.create({
        model: "text-embedding-ada-002",
        input: textChunk,
      });
      return {
        content: textChunk,
        embedding: embeddingResponse.data[0].embedding,
      };
    }),
  );

  // Insert content and embedding into Supabase
  const { error } = await supabase.from("documents").insert(data);
  if (error) {
    console.error("Supabase insert failed:", error);
    return;
  }
  console.log("Embeddings created and inserted into Supabase.");
}
main(podcasts);
