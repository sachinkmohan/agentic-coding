import { searchPodcasts } from "./src/search/search-embeddings";

/** Create embeddings representing the input text */
async function main() {
  const form = document.getElementById("search-form");
  const input = document.getElementById("search-input");
  const button = document.getElementById("search-button");
  const spinner = document.getElementById("spinner");
  const output = document.getElementById("output");

  form.addEventListener("submit", async (event) => {
    event.preventDefault();
    const query = input.value.trim();
    if (!query) return;

    output.textContent = "";
    spinner.hidden = false;
    button.disabled = true;
    try {
      output.textContent = await searchPodcasts(query);
    } catch (error) {
      output.textContent = `Error: ${error.message}`;
    } finally {
      spinner.hidden = true;
      button.disabled = false;
    }
  });
}

main();
