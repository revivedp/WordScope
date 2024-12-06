document.getElementById("uploadForm").onsubmit = function (e) {
  e.preventDefault();

  const fileInput = document.getElementById("fileInput");
  const textInput = document.getElementById("textInput");
  const keywordsInput = document.getElementById("keywords");
  const dividerInput = document.getElementById("divider");
  const resultsDiv = document.getElementById("output");

  resultsDiv.textContent = "";

  const keywords = keywordsInput.value
    .split(",")
    .map((keyword) => keyword.trim());

  const textContent = textInput.value.trim();
  const divider = dividerInput.value.trim();

  if (textContent) {
    const blocks = processFile(textContent, keywords, divider);
    displayBlocks(blocks, resultsDiv);
  } else {
    const file = fileInput.files[0];
    if (!file) {
      alert("Por favor, insira um texto ou selecione um arquivo.");
      return;
    }

    const reader = new FileReader();
    reader.onload = function () {
      const content = reader.result;
      const blocks = processFile(content, keywords, divider);
      displayBlocks(blocks, resultsDiv);
    };
    reader.readAsText(file);
  }
};

function processFile(content, keywords, divider) {
  const blocks = [];
  let buffer = [];

  const lines = content.split("\n");
  lines.forEach((line) => {
    if (line.startsWith(divider)) {
      if (buffer.length > 0 && containsKeywords(buffer.join("\n"), keywords)) {
        blocks.push(buffer.join("\n").trim());
      }
      buffer = [];
    } else {
      buffer.push(line);
    }
  });

  if (buffer.length > 0 && containsKeywords(buffer.join("\n"), keywords)) {
    blocks.push(buffer.join("\n").trim());
  }

  return blocks;
}

function containsKeywords(text, keywords) {
  const normalizedText = text.normalize("NFD").toLowerCase();

  return keywords.some((keyword) => {
    const normalizedKeyword = keyword.normalize("NFD").toLowerCase();
    const regex = new RegExp(`\\b${normalizedKeyword}\\b`, "i");
    return regex.test(normalizedText);
  });
}

function displayBlocks(blocks, container) {
  if (blocks.length === 0) {
    container.textContent = "Nenhum bloco encontrado.";
    return;
  }

  blocks.forEach((block, index) => {
    container.textContent += `Captura ${index + 1}:\n${block}\n${"=".repeat(
      40
    )}\n\n`;
  });
}
