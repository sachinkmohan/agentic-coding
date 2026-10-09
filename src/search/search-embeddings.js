import { openai, supabase } from "../../config.js";

const systemMessage = {
  role: "system",
  content: `You are an enthusiastic podcast expert who loves recommending podcasts to people and respond like Shakespeare. You will be given two pieces of information - some context about podcasts episodes and a question. Your main job is to formulate a short answer to the question using the provided context. If you are unsure and cannot find the answer in the context, say, "Sorry, I don't know the answer." Please do not make up the answer.`,
};

export async function searchPodcasts(input) {
  const embedding = await createEmbedding(input);
  const match = await findNearestMatch(embedding);
  return getChatCompletion(match, input);

  async function createEmbedding(input) {
    const embeddingResponse = await openai.embeddings.create({
      model: "text-embedding-ada-002",
      input,
    });
    return embeddingResponse.data[0].embedding;
  }

  async function findNearestMatch(embedding) {
    // Query supabase for nearest vector match
    const { data } = await supabase.rpc("match_documents", {
      query_embedding: embedding,
      match_threshold: 0.5,
      match_count: 1,
    });
    if (!data?.length) throw new Error("No matching podcast found.");
    return data[0].content;
  }

  async function getChatCompletion(text, query) {
    const response = await openai.chat.completions.create({
      model: "gpt-5-nano",
      messages: [
        systemMessage,
        { role: "user", content: `Context: ${text} Question: ${query}` },
      ],
      temperature: 1,
    });

    return response.choices[0].message.content;
  }
}
